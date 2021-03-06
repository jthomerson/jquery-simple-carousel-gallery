module.exports = function(grunt) {

   grunt.initConfig({

      // Import package manifest
      pkg: grunt.file.readJSON('package.json'),

      // Banner definitions
      meta: {
         banner: '/*\n' +
            ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
            ' *  <%= pkg.description %>\n' +
            ' *  <%= pkg.homepage %>\n' +
            ' *\n' +
            ' *  Made by <%= pkg.author %>\n' +
            ' *  Under <%= pkg.license %> License\n' +
            ' */\n'
      },

      // Concat definitions
      concat: {
         options: {
            banner: '<%= meta.banner %>'
         },
         dist: {
            src: [ 'src/jquery.simple-carousel-gallery.js' ],
            dest: 'dist/jquery.simple-carousel-gallery.js'
         }
      },

      // Lint definitions
      jshint: {
         files: [ 'src/jquery.simple-carousel-gallery.js' ],
         options: {
            jshintrc: '.jshintrc'
         }
      },

      // Minify definitions
      uglify: {
         my_target: {
            src: [ 'dist/jquery.simple-carousel-gallery.js' ],
            dest: 'dist/jquery.simple-carousel-gallery.min.js'
         },
         options: {
            banner: '<%= meta.banner %>'
         }
      },

      // watch for changes to source
      // Better than calling grunt a million times
      // (call 'grunt watch')
      watch: {
          files: [ 'src/*' ],
          tasks: [ 'default' ]
      }

   });

   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-watch');

   grunt.registerTask('build', [ 'concat', 'uglify' ]);
   grunt.registerTask('default', [ 'jshint', 'build' ]);
   grunt.registerTask('travis', [ 'default' ]);

};
