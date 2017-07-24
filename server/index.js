var Bedoon = require('bedoon');
var express = require('express');
var passport = require('passport');
var crypto = require('crypto');
var config = require('./config/config');
var bot = require('./bot');
var bedoon = new Bedoon(config);
var port = 3700;
var LdapStrategy = require('passport-ldapauth').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BearerStrategy(
    { passReqToCallback: true },
    function (req, token, done) {
        bedoon.models.user.findOne({ token: token }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

passport.use(new LdapStrategy(
    { server: config.ldap },
    function (ldapUser, done) {
        bedoon.models.user.findOne({ username: ldapUser.sAMAccountName }, function (err, user) {
            if (!user) {
                user = new bedoon.models.user();
                user.username = ldapUser.sAMAccountName;
                user.name = ldapUser.name;
                user.email = ldapUser.mail;
                user.save();
            }

            if (!user.token) {
                user.token = crypto.randomBytes(32).toString('hex');
                user.save();
            }

            return done(null, user);
        });
    }
));

bedoon.app.use(express.static(__dirname + '/public'));

var auth = passport.authenticate(['bearer'], { session: false });
bedoon.app.use('/api/*', function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return auth(req, res, next);
});

bedoon.models.service.findOne({ name: 'slackbot' }, function (err, result) {
    if (result) {
        bot(result.enabled, result.config, bedoon.models, bedoon.app);
    }

    bedoon.run(port);
    console.log('Listening on port ' + port);
});

bedoon.app.post('/ldap/auth/login', passport.authenticate('ldapauth', {
    successRedirect: '/api/auth/loggedin',
    failureRedirect: '/api/auth/failed'
}));

bedoon.app.get('/dashboard', function (req, res) {
    bedoon.models.delivery.find(function (err, deliveries) {
        var statuses = [];

        deliveries.forEach(function (delivery) {
            delivery = {
                id: delivery._id.toString(),
                description: delivery.description,
                version: delivery.version,
                ready: true,
                progress: 0,
                progressPlanned: 0,
                progressCurrent: 0,
                progressBlocked: 0
            };

            bedoon.models.project_delivery.find({ delivery: delivery.id }, function (error, projectDeliveries) {
                projectDeliveries.forEach(function (projectDelivery) {
                    if (projectDelivery.status !== 'delivered') {
                        delivery.ready = false;
                    }

                    switch (projectDelivery.status) {
                        case 'planned':
                            delivery.progressPlanned++;
                            break;

                        case 'current':
                            delivery.progressCurrent++;
                            break;

                        case 'blocked':
                            delivery.progressBlocked++;
                            break;

                        default:
                            delivery.progress++;
                    }
                });

                delivery.progress = (delivery.progress / projectDeliveries.length) * 100;
                delivery.progressPlanned = (delivery.progressPlanned / projectDeliveries.length) * 100;
                delivery.progressCurrent = (delivery.progressCurrent / projectDeliveries.length) * 100;
                delivery.progressBlocked = (delivery.progressBlocked / projectDeliveries.length) * 100;
                statuses.push(delivery);

                if (statuses.length === deliveries.length) {
                    res.json(statuses);
                }
            });
        });
    });
});
