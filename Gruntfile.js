module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // validate js files
        jshint: {
            all: ['client/**/*.js']
        },

        // Less build
        less: {
            all: {
                options: {
                    yuicompress: true
                },
                files: {
                    "server/public/css/main.css": "client/less/main.less"
                }
            }
        },

        // Copy assets
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'client', src: ['index.html'], dest: 'server/public'},
                    {expand: true, cwd: 'client/partials', src: ['**'], dest: 'server/public/partials'},
                    {expand: true, cwd: 'node_modules/authenticatejs/build/partials', src: ['**'], dest: 'server/public/partials/authenticateJS'},
                    {expand: true, src: ['node_modules/font-awesome/fonts/*'], dest: 'server/public/font/', flatten: true},
                    {expand: true, src: ['node_modules/pmsipilot-ui/font/*'], dest: 'server/public/font/', flatten: true},
                    {expand: true, cwd: 'node_modules/pmsipilot-ui/images/', src: ['**'], dest: 'server/public/images'}
                ]
            }
        },

        // Concat Files
        concat: {
            application: {
                src: ['client/**/*.js'],
                dest: 'server/public/js/app.js'
            },

            vendors: {
                src: [
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-route/angular-route.min.js',
                    'node_modules/angular-sanitize/angular-sanitize.min.js',
                    'node_modules/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/ng-table/bundles/ng-table.min.js',
                    'node_modules/spectrum/lib/spectrum.js',
                    'node_modules/lodash/lodash.min.js',
                    'node_modules/d3/d3.min.js',
                    'node_modules/authenticatejs/src/js/module.js',
                    'node_modules/authenticatejs/src/js/**/*.js',
                    'node_modules/angular-datastore/src/module.js',
                    'node_modules/angular-datastore/src/**/*.js',
                    'node_modules/marked/marked.min.js',
                    'node_modules/angular-marked/dist/angular-marked.min.js',
                    'node_modules/moment/moment.js',
                    'node_modules/angular-gravatar/build/angular-gravatar.min.js'
                ],
                dest: 'server/public/js/vendor.js'
            },

            vendors_stylesheets: {
                src: [
                    'node_modules/ng-table/bundles/ng-table.min.css'
                ],
                dest: 'server/public/css/vendor.css'
            }
        },

        uglify: {
            application: {
                options: {
                    compress: true,
                    mangle: false,
                    output: {
                        comments: false
                    }
                },
                files: {
                    'server/public/js/app.js': ['server/public/js/app.js'],
                    'server/public/js/vendor.js': ['server/public/js/vendor.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['less', 'copy', 'concat', 'uglify', 'jshint']);
};
