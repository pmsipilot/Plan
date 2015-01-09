// Loading Config
var config = require("../config/config"),
    Bedoon = require('bedoon'),
    express = require('express'),
    passport = require('passport'),
    bedoon = new Bedoon(config),
    port = 3700
;
bedoon.app.use(express.static(__dirname + '/../../public'));
bedoon.run(3700);
console.log("Listening on port " + 3700);


var LdapStrategy = require('passport-ldapauth').Strategy;

passport.use(new LdapStrategy({ server: config.ldap }, function(ldapUser, done) {
        bedoon.models.user.findOne({ username: ldapUser.sAMAccountName }, function (err, user) {
            if (!user) {
                user = new bedoon.models.user();
                user.username = ldapUser.sAMAccountName;
                user.name = ldapUser.name;
                user.save();
            }
            
            return done(null, user);
        });
  }));

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
                progress: 0
            };

            bedoon.models.project_delivery.find({delivery: delivery.id}, function(err, project_deliveries) {
                project_deliveries.forEach(function(project_delivery) {
                    if (project_delivery.status !== 'delivered') {
                        delivery.ready = false;
                    } else {
                        delivery.progress++;
                    }
                });

                delivery.progress = (delivery.progress / project_deliveries.length) * 100;
                statuses.push(delivery);

                if (statuses.length === deliveries.length) {
                    res.json(statuses);
                }
            });
        });
    });
});
