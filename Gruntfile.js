module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-aws');

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
          require: './tests/helpers/chai'
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

    s3: {
      options: {
        //dryRun: true,
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
    }

  });

  grunt.registerTask('build', ['jshint', 'browserify']);
  grunt.registerTask('test', ['build', 'mochaTest']);
  grunt.registerTask('export', ['uglify']);

  grunt.registerTask('default', ['test', 'export']);
  grunt.registerTask('aws', ['s3', 'cloudfront']);
  grunt.registerTask('deploy:production', ['default', 'aws']);
};
