require('coffee-script/register');

var hubot = require('hubot');
var moment = require('moment');
var semver = require('semver');

var projectStatusToEmoji = function (status) {
    switch (status) {
        case 'blocked':
            return ':red_circle:';

        case 'delivered':
            return ':shipit:';

        case 'current':
            return ':running:';

        case 'planned':
            return ':calendar:';

        default:
            return '';
    }
};

var projectStatusToColor = function (status) {
    switch (status) {
        case 'blocked':
            return '#d9534f';

        case 'delivered':
            return '#5cb85c';

        case 'current':
            return '#f0ad4e';

        case 'planned':
            return '#5bc0de';

        default:
            return '';
    }
};

var deliveryLockToEmoji = function (locked) {
    if (locked) {
        return ':lock:';
    }

    return ':unlock:';
};

var deliveryStatusToEmoji = function (ready) {
    if (ready) {
        return ':heavy_check_mark:';
    }

    return ':heavy_multiplication_x:';
};

var deliveryStatusToColor = function (locked, ready) {
    if (locked && ready) {
        return '#5cb85c';
    }

    if (!ready) {
        return '#d9534f';
    }

    return '#f0ad4e';
};

var booleanToText = function (value) {
    if (value) {
        return 'Yes';
    }

    return 'No';
};

var formatDate = function (date) {
    return moment(date).format('LL') + ' (' + moment(date).fromNow() + ')';
};

var formatLink = function (attachment, config) {
    attachment.title_link = config.public_url + attachment.title_link;

    return attachment;
};

var deliveryToAttachment = function (delivery, versions) {
    var ready = !versions.find(function (version) { return version.status !== 'delivered'; });
    var start = null;
    var target = null;

    versions.forEach(function (version) {
        if (start === null || start > version.start_date) {
            start = version.start_date;
        }

        var endDateIsSet = version.end_date && version.end_date < version.target_date;
        var endDate = endDateIsSet ? version.end_date : version.target_date;

        if (target === null || target < endDate) {
            target = endDate;
        }
    });

    return {
        title: delivery.version,
        title_link: '/#!/delivery/' + delivery._id,
        text: delivery.description,
        color: deliveryStatusToColor(delivery.locked, ready),
        fields: [
            {
                title: 'Locked',
                value: deliveryLockToEmoji(delivery.locked) + ' ' + booleanToText(delivery.locked),
                short: true
            },
            {
                title: 'Ready',
                value: deliveryStatusToEmoji(ready) + ' ' + booleanToText(ready),
                short: true
            },
            {
                title: 'Started At',
                value: formatDate(start),
                short: true
            },
            {
                title: ready && delivery.locked ? 'Delivered At' : 'Planned For',
                value: formatDate(target),
                short: true
            }
        ]
    };
};

var projectToAttachment = function (project) {
    return {
        title: project.name,
        title_link: '/#!/project/' + project._id,
        text: project.description,
        color: project.color,
        fields: [
            {
                title: 'Scrum Master',
                value: project.scrum_master,
                short: true
            },
            {
                title: 'Project Owner',
                value: project.project_owner,
                short: true
            }
        ]
    };
};

var projectVersionToAttachment = function (version, project) {
    var fields = [
        {
            title: 'Status',
            value: projectStatusToEmoji(version.status) + ' ' + version.status,
            short: true
        },
        {
            title: 'Started At',
            value: formatDate(version.start_date),
            short: true
        },
        {
            title: 'Planned For',
            value: formatDate(version.target_date),
            short: true
        }
    ];

    if (version.end_date) {
        fields.push({
            title: 'Delivered At',
            value: formatDate(version.end_date),
            short: true
        });
    }

    return {
        title: (project ? project.name + ' ' : '') + version.version,
        title_link: '/#!/project/' + version.project,
        color: projectStatusToColor(version.status),
        fields: fields
    };
};

module.exports = function (enabled, config, models, app) {
    var robot;

    var start = function () {
        process.env.HUBOT_SLACK_TOKEN = config.token;
        robot = hubot.loadBot(null, 'slack', true, config.name || 'plan', config.alias || 'plan');

        robot.on('attachment', function (data) {
            robot.http(config.webhook)
                .header('Content-Type', 'application/json')
                .post(JSON.stringify(data))(function (err, res, body) {
                    if (err) {
                        robot.logger.error('Error!', err);
                    } else if (res.statusCode !== 200) {
                        robot.logger.error('Error!', res.statusCode, body);
                    }
                });
        });

        robot.run();

        robot.respond(/release list/i, function (res) {
            models.delivery.find(function (err, result) {
                var promises = [];

                result.forEach(function (delivery) {
                    promises.push(new Promise(function (resolve) {
                        models.project_delivery.find({ delivery: delivery._id }, function (err, versions) {
                            resolve(deliveryToAttachment(delivery, versions));
                        });
                    }));
                });

                Promise.all(promises).then(function (attachments) {
                    var mapper = function (attachment) {
                        return formatLink(attachment, config);
                    };

                    while (attachments.length > 0) {
                        robot.emit('attachment', {
                            channel: res.envelope.room,
                            username: robot.name,
                            attachments: attachments.splice(0, 10).map(mapper)
                        });
                    }
                });
            });
        });

        robot.respond(/release describe (.+)/i, function (res) {
            models.delivery.find({ version: res.match[1] }, function (err, result) {
                var delivery = result[0];

                models.project_delivery.find({ delivery: delivery._id }, function (err, versions) {
                    var promises = versions.map(function (version) {
                        return new Promise(function (resolve) {
                            models.project.findOne(version.project, function (error, project) {
                                resolve(projectVersionToAttachment(version, project));
                            });
                        });
                    });

                    Promise.all(promises).then(function (attachments) {
                        robot.emit('attachment', {
                            channel: res.envelope.room,
                            username: robot.name,
                            attachments: [deliveryToAttachment(delivery, versions)]
                        });

                        var mapper = function (attachment) {
                            return formatLink(attachment, config);
                        };

                        while (attachments.length > 0) {
                            robot.emit('attachment', {
                                channel: res.envelope.room,
                                username: robot.name,
                                attachments: attachments.splice(0, 10).map(mapper)
                            });
                        }
                    });
                });
            });
        });

        robot.respond(/release (lock|unlock) (.+)/i, function (res) {
            models.delivery.find({ version: res.match[2] }, function (err, result) {
                var delivery = result[0];
                delivery.locked = res.match[1] === 'lock';
                delivery.save();

                models.project_delivery.find({ delivery: delivery._id }, function (error, versions) {
                    robot.emit('attachment', {
                        channel: res.envelope.room,
                        username: robot.name,
                        attachments: [formatLink(deliveryToAttachment(delivery, versions), config)]
                    });
                });
            });
        });

        robot.respond(/project list/i, function (res) {
            models.project.find(function (err, result) {
                var mapper = function (project) {
                    return projectToAttachment(project);
                };

                var linker = function (attachment) {
                    return formatLink(attachment, config);
                };

                while (result.length > 0) {
                    robot.emit('attachment', {
                        channel: res.envelope.room,
                        username: robot.name,
                        attachments: result.splice(0, 10).map(mapper).map(linker)
                    });
                }
            });
        });

        robot.respond(/project describe (.+)/i, function (res) {
            models.project.find({ name: res.match[1] }, function (err, projects) {
                var project = projects[0];

                models.project_delivery.find({ project: project._id }, function (error, versions) {
                    robot.emit('attachment', {
                        channel: res.envelope.room,
                        username: robot.name,
                        attachments: [projectToAttachment(project)]
                    });

                    versions = versions
                        .map(function (version) { return projectVersionToAttachment(version); })
                        .sort(function (a, b) {
                            if (semver.gt(a.title, b.title)) {
                                return -1;
                            }

                            if (semver.lt(a.title, b.title)) {
                                return 1;
                            }

                            return 0;
                        });

                    var mapper = function (attachment) {
                        return formatLink(attachment, config);
                    };

                    while (versions.length > 0) {
                        robot.emit('attachment', {
                            channel: res.envelope.room,
                            username: robot.name,
                            attachments: versions.splice(0, 10).map(mapper)
                        });
                    }
                });
            });
        });

        robot.respond(/project (plan|start|block|deliver) (.+) (.+)/i, function (res) {
            var statuses = {
                plan: 'planned',
                start: 'current',
                block: 'blocked',
                deliver: 'delivered'
            };

            models.project.find({ name: res.match[2] }, function (err, projects) {
                var project = projects[0];

                models.project_delivery.find({ version: res.match[3] }, function (error, versions) {
                    var version = versions[0];

                    if (version.status !== statuses[res.match[1]]) {
                        version.status = statuses[res.match[1]];

                        if (res.match[1] === 'deliver') {
                            version.end_date = new Date();
                        } else {
                            version.end_date = '';
                        }

                        version.save();
                    }

                    robot.emit('attachment', {
                        channel: res.envelope.room,
                        username: robot.name,
                        attachments: [formatLink(projectVersionToAttachment(version, project), config)]
                    });
                });
            });
        });

        return robot;
    };

    var stop = function () {
        if (robot) {
            var exit = process.exit;
            process.exit = function () {};

            robot.shutdown();

            process.exit = exit;
        }
    };

    var restart = function () {
        stop();

        return start();
    };

    app.use(function (req, res, next) {
        next();

        var isService = req.params && req.params.name === 'service';
        var isSlackBot = req.body && req.body.name === 'slackbot';

        if (req.method === 'PUT' && isService && isSlackBot) {
            console.log('Updating slackbot configuration');

            if (!req.body.enabled) {
                stop();
            } else {
                config = req.body.config;

                restart();
            }
        }
    });

    if (enabled) {
        start();
    }
};
