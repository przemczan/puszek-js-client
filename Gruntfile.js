module.exports = function(grunt) {

    var cfg = {
        src: {
            files: ['src/**/*.js']
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
                src: cfg.src.files,
                dest: 'dist/puszek-js-client.js'
            }
        },
        uglify: {
            all: {
                files: {
                    'dist/puszek-js-client.min.js': ['dist/puszek-js-client.js']
                }
            }
        },
        jshint: {
            pre: ['Gruntfile.js', cfg.src.files, cfg.test.files],
            post: ['dist/puszek-js-client.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint:pre', 'concat', 'jshint:post', 'uglify']);
};