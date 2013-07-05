/*global module, require*/
module.exports = function (grunt) {
    'use strict';

    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json')
    };

    // convenience
    grunt.registerTask('default', ['lint', 'test']);
    grunt.registerTask('commit', ['lint', 'test']);
    grunt.registerTask('all', ['clean', 'lint', 'test', 'cover']);

    // continuous integration
    grunt.registerTask('ci', ['lint', 'test']);


    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    gruntConfig.clean = {
        output: ['output']
    };


    // lint
    grunt.loadNpmTasks('grunt-contrib-jshint');
    gruntConfig.jshint = {
        options: { bitwise: true, camelcase: true, curly: true, eqeqeq: true, forin: true, immed: true,
            indent: 4, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, plusplus: true,
            quotmark: true, regexp: true, undef: false, unused: true, strict: false, trailing: true,
            maxparams: 3, maxdepth: 2, maxstatements: 50},
        all: [
            'Gruntfile.js',
            'src/js/**/*.js'
        ]
    };
    grunt.registerTask('lint', 'jshint');


    // connect
    grunt.loadNpmTasks('grunt-contrib-connect');
    gruntConfig.connect = {
        root: {
            options: {
                port: 8082,
                base: '.'
            }
        }
    };


    // test
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    gruntConfig.jasmine = {
        src: {
            src: [
                'src/js/**/*.js',
                '!src/js/**/*.test.js'
            ],
            options: {
                specs: 'src/js/**/*.test.js',
                vendor: [
                    'src/lib/jquery.js',
                    'src/lib/can.custom.js',
                    'src/lib/jasmine-jquery.js',
                    'src/JasmineConfigure.js'
                ],
                junit: {
                    path: 'output/testresults'
                },
                keepRunner: true
            }
        }
    };
    grunt.registerTask('test', 'jasmine:src');
    grunt.registerTask('serve', ['jasmine:src:build', 'connect:root:keepalive']);


    // coverage
    gruntConfig.jasmine.istanbul = grunt.util._.merge({}, gruntConfig.jasmine.src, {
        options: {
            template: require('grunt-template-jasmine-istanbul'),
            templateOptions: {
                coverage: 'output/coverage/coverage.json',
                report: [
                    {type: 'text-summary'},
                    {type: 'html', options: {dir: 'output/coverage'}},
                    {type: 'cobertura', options: {dir: 'output/cobertura'}}
                ]
            }
        }
    });
    grunt.registerTask('cover', 'jasmine:istanbul');


    // grunt
    grunt.initConfig(gruntConfig);
};