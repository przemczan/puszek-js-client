module.exports = function(grunt) {

    var cfg = {
        src: {
            lib: ['src/lib/**/*.js'],
            angular: ['src/angular/**/*.js']
        },
        test: {
            files: ['test/**/*.js']
        }
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            all: {
                src: cfg.src.lib,
                dest: 'dist/puszek-js-client.js'
            },
            angular: {
                src: cfg.src.angular,
                dest: 'dist/puszek-angular-client.js'
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/puszek-js-client.min.js': ['dist/puszek-js-client.js'],
                    'dist/puszek-angular-client.min.js': ['dist/puszek-angular-client.js']
                }
            }
        },
        jshint: {
            pre: ['Gruntfile.js', cfg.src.lib, cfg.src.angular, cfg.test.files],
            post: ['dist/puszek-js-client.js', 'dist/puszek-angular-client.js']
        },
        watch: {
            scripts: {
                files: [cfg.src.lib, cfg.src.angular],
                tasks: ['build-dev'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint:pre', 'concat', 'jshint:post', 'uglify']);
    grunt.registerTask('build-dev', ['jshint:pre', 'concat', 'jshint:post']);
};