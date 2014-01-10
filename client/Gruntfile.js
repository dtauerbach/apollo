module.exports = function (grunt) {

  var assetsDir = 'source/assets/',
    shell = require('shelljs');;

  function readBuildConfig () {
    var configBuild = {
      "wrap"                  : true,
      "name"                  : "main",
      "optimize"              : "none",
      "baseUrl"               : "source/js",
      "mainConfigFile"        : "source/js/main.js",
      "out"                   : "build/js/main-src.js",
      "disabled/exclude"      : ["main.js"],
      "disabled/insertRequire": ["./main"]
    };

    var configRequire = require('./source/js/config-require.js');

    configBuild.shim = configRequire.shim;
    configBuild.paths = configRequire.paths;

    return configBuild;
  }

  // Project configuration.
  grunt.initConfig({
    pkg      : grunt.file.readJSON('package.json'),
    autoprefixer: {
      options    : {
        browsers: ['> 1%']
      },
      single_file: {
        options: {
          // Target-specific options go here.
        },
        src    : assetsDir + 'css/main.css',
        dest   : assetsDir + 'css/main.css'
      }
    },
    sass: {
      main: {
        options: {
          bundleExec: true,
          require: [
            './source/sass/sass_extensions.rb',
            'sass-globbing'
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'source/sass/',
            src: ['*.scss', '!_*.scss'],
            dest: assetsDir + 'css/',
            ext: '.css'
          }
        ]
      }
    },
    copy     : {
      main: {
        files: [
          {
            expand: true,
            cwd   : 'source/',
            src   : ['index.html'],
            dest  : 'build/'
          },
          {
            expand: true,
            cwd   : 'source/js',
            src   : ['config-require.js'],
            dest  : 'build/js'
          },
          {
            expand: true,
            cwd   : assetsDir,
            src   : ['**/*'],
            dest  : 'build/assets/'
          },
          {
            expand: true,
            cwd   : 'source/vendor/',
            src   : ['**/*'],
            dest  : 'build/vendor/'
          }
        ]
      }
    },
    csso: {
      compress: {
        options: {
          report: 'min'
        },
        files: {
          'source/assets/css/main.css': [assetsDir + 'css/main.css']
        }
      }
    },
    karma    : {
      ci  : { // runs tests one time in PhantomJS, good for continuous integration
        autoWatch : false,
        configFile: 'karma-compiled.conf.js',
        browsers  : ['PhantomJS']
      },
      unit: { // start testing server that listens for code updates
        autoWatch : true,
        configFile: 'karma.conf.js',
        singleRun : false,
        browsers  : ['PhantomJS']
      },
      unitSingleRun: {
        autoWatch : false,
        configFile: 'karma.conf.js',
        singleRun : true,
        browsers  : ['PhantomJS']
      },
      watch: { // used in grunt watch context
        background: true,
        configFile: 'karma.conf.js',
        singleRun : false,
        browsers  : ['PhantomJS']
      }
    },
    protractor: {
      options: {
        configFile: 'p.conf.js',
        keepAlive: true, // If false, the grunt process stops when the test fails.
        args: {
          baseUrl: 'http://local.apollo.com', // Arguments passed to the command
          specs: ['source/js/**/*.e2e.js']
        }
      },
      source: {},
      build: {
        args: {
          baseUrl: 'http://local.apollo.com/build'
        }
      }
    },
    requirejs: {
      compile: {
        options: readBuildConfig()
      }
    },
    uglify   : {
      main: {
        options: {
          mangle          : false,
          report          : 'min',
          sourceMappingURL: './source-map.js',
          sourceMap       : 'build/js/source-map.js'
        },
        files  : {
          'build/js/main.js': ['build/js/main-src.js']
        }
      }
    },
    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: [
          assetsDir + 'css/*.css',
          'source/index.html',
          'source/js/**/*',
          '!source/js/**/*.spec.js'
        ]
      },
      scripts: {
        files: ['source/js/**/*.js'],
        tasks: ['karma:watch:run'],
        options: {
          interrupt: true
        }
      },
      sass: {
        files: ['source/sass/**/*'],
        tasks: ['css:compile'],
        options: {
          interrupt: true
        }
      }
    },
    css: {
      compile: ['sass', 'autoprefixer'],
      compress: ['csso']
    }
  });

  // Adds additional require(['main']) call to start built app
  grunt.registerTask('modifyBuildIndex', 'Adds js code required to start built app.', function () {
    shell.sed(
      '-i',
      "require(['./js/main'])",
      "require(['./js/main.js'], function () { require(['main']); })",
      'build/index.html'
    );
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-karma');

  // register css task to have option to separate styles compilation and build
  grunt.registerMultiTask('css', function () {
    grunt.task.run(this.data);
  });

  grunt.registerTask('build-js', ['copy', 'requirejs', 'uglify']);
  grunt.registerTask('build-css', ['css']);
  grunt.registerTask('build', ['build-js', 'build-css', 'modifyBuildIndex']);
  grunt.registerTask('test', ['karma:unitSingleRun', 'protractor:source', 'karma:ci', 'protractor:build']);

  grunt.registerTask('default', ['build', 'test']);

};
