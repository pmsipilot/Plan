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