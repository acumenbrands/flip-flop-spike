module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-img');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON("config/aws-config.json"),

    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js']
    },

    mochaTest: {
      all: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            './tests/helpers/chai.js',
            './tests/helpers/sinon.js',
            './tests/helpers/integration.js'
          ]
        },
        src: ['tests/integration/tests.js']
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    browserify: {
      vendor: {
        src: ['lib/**/*.js'],
        dest: 'build/flip-flop-spike.js'
      },
      client: {
        src: ['lib/**/*.js'],
        dest: 'tmp/flip-flop-spike.js'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        compress: {
          global_defs: {
            "DEBUG": false
          },
          dead_code: true
        }
      },
      build: {
        files: {
          'build/flip-flop-spike.min.js': ['build/flip-flop-spike.js']
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'assets/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },

    img: {
      compress: {
        src: ['assets/images/*.png', 'assets/images/*.jpg'],
        dest: 'build/images'
      },
    },

    s3: {
      options: {
        // dryRun: true,
        accessKeyId: "<%= aws.AWSAccessKeyId %>",
        secretAccessKey: "<%= aws.AWSSecretKey %>",
        bucket: "<%= aws.S3Bucket %>",
        access: "<%= aws.access %>"
      },
      build: {
        cwd: "build/",
        src: "**",
        dest: "libs/flip-flop-spike/<%= pkg.version %>/"
      }
    },

    cloudfront: {
      options: {
        accessKeyId: "<%= aws.AWSAccessKeyId %>",
        secretAccessKey: "<%= aws.AWSSecretKey %>",
        distributionId: "<%= aws.CloudFrontId %>"
      },
      html: {
        options: {
          invalidations: [
            "/libs/flip-flop-spike/<%= pkg.version %>/*"
          ]
        }
      }
    },

    watch: {
      js: {
        files: ['lib/**/*.js', 'tests/**/*.js'],
        tasks: ['test', 'uglify'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['assets/**/*.css'],
        tasks: ['cssmin'],
        options: {
          spawn: false,
        },
      },
      images: {
        files: ['assets/**/*.svg', 'assets/**/*.jpg', 'assets/**/*.png', 'assets/**/*.gif'],
        tasks: ['img'],
        options: {
          spawn: false,
        },
      },
      configFiles: {
        files: [ 'Gruntfile.js', 'config/*.json' ],
        options: {
          reload: true
        }
      }
    }

  });

  grunt.registerTask('build', ['jshint', 'browserify']);
  grunt.registerTask('test', ['build', 'mochaTest']);
  grunt.registerTask('export', ['uglify', 'cssmin', 'img']);

  grunt.registerTask('default', ['test', 'export']);
  grunt.registerTask('production:deploy', ['default', 's3']);
  grunt.registerTask('production:cache:destroy', ['cloudfront']);
};
