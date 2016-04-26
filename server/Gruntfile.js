module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    gittag: {
      addtag: {
        options: {
          tag: '<%= pkg.version %>',
          message: 'NO-JIRA: Added tag: <%= pkg.version %>'
        }
      }
    },
    gitadd: {
      task: {
        files: {
          src: ['package.json']
        }
      }
    },
    gitcommit: {
      task: {
        options: {
          message: 'NO-JIRA: Updated version to: <%= pkg.version %>'
        },
        files: {
          src: ['package.json']
        }
      }
    },
    gitpush: {
      pushtag: {
        options: {
          remote: 'origin',
          branch: 'master',
          tags: true
        }
      },
      pushchange: {
        options: {
          remote: 'origin',
          branch: 'master'
        }
      }
    },
    version: {
      project: {
        src: ['package.json']
      }
    },
    nexus: {
      options: {
        url: 'http://nookrepo.sjc1700.bnweb.user.bn:8081',
        repository: 'releases',
        username: 'deployment',
        password: 'deployment123'
      },
      client: {
        files: [
          { src: ['**/*', 'conf/.keepme', 'public/article/.keepme', '!node_modules/**', '!dist/**', '!certs/**', '!verify/**'] }
        ],
        options: {
          curl: false,
          publish: [{
              id: 'com.nook.nodejs:<%= pkg.name %>:zip',
              version: '<%= pkg.version %>',
              path: 'dist/'
          }],
          verify: [{ 
              id: 'com.nook.nodejs:<%= pkg.name %>:zip:',
              version: '<%= pkg.version %>',
              path: 'verify' 
          }]
        }
      }
    }
  });

  // Load the plugin that provides the "nexus" task.
  grunt.loadNpmTasks('grunt-nexus-artifact');

  // Load the plugin that provides the "version" task.
  grunt.loadNpmTasks('grunt-version');

  // Load the plugin that provides the "git" task.
  grunt.loadNpmTasks('grunt-git');

  // Default task(s).
  grunt.registerTask('default', ['nexus']);

};
