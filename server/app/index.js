// Loading Config
var config = require("../config/config"),
    Bedoon = require('bedoon'),
    express = require('express'),
    passport = require('passport'),
    crypto = require('crypto'),
    bedoon = new Bedoon(config),
    port = 3700,
    LdapStrategy = require('passport-ldapauth').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BearerStrategy(
    { passReqToCallback: true },
    function(req, token, done) {
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
    function(ldapUser, done) {
        bedoon.models.user.findOne({ username: ldapUser.sAMAccountName }, function (err, user) {
            if (!user) {
                user = new bedoon.models.user();
                user.username = ldapUser.sAMAccountName;
                user.name = ldapUser.name;
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

bedoon.app.use(express.static(__dirname + '/../../public'));

var auth = passport.authenticate(['bearer'], { session: false });
bedoon.app.use('/api/*', function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return auth(req, res, next);
    }
});

bedoon.run(3700);
console.log("Listening on port " + 3700);

bedoon.app.post('/ldap/auth/login', passport.authenticate('ldapauth', { successRedirect: '/api/auth/loggedin',
    failureRedirect: '/api/auth/failed' }));

bedoon.app.get('/dashboard', function(req, res) {
    bedoon.models.delivery.find(function(err, deliveries) {
        var statuses = [];

        deliveries.forEach(function(delivery) {
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

            bedoon.models.project_delivery.find({delivery: delivery.id}, function(err, project_deliveries) {
                project_deliveries.forEach(function(project_delivery) {
                    if (project_delivery.status !== 'delivered') {
                        delivery.ready = false;
                    }

                    switch (project_delivery.status) {
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

                delivery.progress = (delivery.progress / project_deliveries.length) * 100;
                delivery.progressPlanned = (delivery.progressPlanned / project_deliveries.length) * 100;
                delivery.progressCurrent = (delivery.progressCurrent / project_deliveries.length) * 100;
                delivery.progressBlocked = (delivery.progressBlocked / project_deliveries.length) * 100;
                statuses.push(delivery);

                if (statuses.length === deliveries.length) {
                    res.json(statuses);
                }
            });
        });
    });
});
