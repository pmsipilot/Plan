module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // validate js files
        jshint: {
            all: ['app/**/*.js']
        },

        // Less build
        less: {
            all: {
                options: {
                    yuicompress: true
                },
                files: {
                    "../public/css/main.css": "app/less/main.less"
                }
            }
        },

        // Copy assets
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'app', src: ['index.html'], dest: '../public'},
                    {expand: true, cwd: 'app/partials', src: ['**'], dest: '../public/partials'},
                    {expand: true, cwd: 'bower_components/authenticateJS/build/partials', src: ['**'], dest: '../public/partials/authenticateJS'},
                    {expand: true, src: ['bower_components/fontawesome/font/*'], dest: '../public/font/', flatten: true},
                    {expand: true, src: ['bower_components/pmsipilot-ui/font/*'], dest: '../public/font/', flatten: true},
                    {expand: true, cwd: 'bower_components/pmsipilot-ui/images/', src: ['**'], dest: '../public/images'}
                ]
            }
        },

        // Concat Files
        concat: {

            application: {
                src: ['app/**/*.js'],
                dest: '../public/js/app.js'
            },

            vendors: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-route/angular-route.min.js',
                    'bower_components/angular-sanitize/angular-sanitize.min.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'bower_components/ng-table/ng-table.js',
                    'bower_components/spectrum/spectrum.js',
                    'bower_components/lodash/dist/lodash.min.js',
                    'bower_components/d3/d3.js',
                    'bower_components/socket.io-client/socket.io.js',
                    'bower_components/authenticateJS/build/authenticate.js',

                    // Angular Data
                    'bower_components/angular-datastore/src/module.js',
                    'bower_components/angular-datastore/src/**/*.js'
                ],
                dest: '../public/js/vendor.js'
            },

            vendors_stylesheets: {
                src: [
                    'bower_components/ng-table/ng-table.css',
                    'bower_components/spectrum/spectrum.css'
                ],
                dest: '../public/css/vendor.css'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['less', 'copy', 'concat', 'jshint']);
    grunt.registerTask('dev', ['less', 'copy', 'concat']);
};
