/*----------------------------------------------------
 * livereload Default Setting
 *-----------------------------------------------------*/
'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

/*----------------------------------------------------
 * Module Setting
 *-----------------------------------------------------*/
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		// Task htmlmin
		htmlmin: { 		
			dist: {
				options: {
					removeComments: true,		//去注析
					collapseWhitespace: true	//去换行
				},
				files: { // Dictionary of files
					'dist/html/index.html': ['src/html/index.html']
				}
			}
		},

		// Task jsmin
		uglify: {
			options: {
				mangle: false
			},
			build: {
				files: {
					'dist/js/comm.js': ['src/js/comm.js']
				}
			}
		},

		// Task cssmin
		cssmin: {
			/*
			compress: {
				files: {
				  'assets/all.min.css': ['css/a.css', 'css/b.css']
				}
			}, */
			
			/*
			smeite: {
				files: {
					'assets/smeite.all.css': ['/play21/smeite.com/public/assets/css/**.css']
				}
			},*/
			with_banner: {
				options: {
					banner: '/* projA Css files by Sonic */'
				},
				files: {
					'dist/css/combo.css': ['src/css/base.css','src/css/index.css']
				}
			}
		},

		 // Task imagemin
		 imagemin: {
			dist: { // Target
				options: { // Target options
					optimizationLevel: 3
				},
				files: { // Dictionary of files
					'dist/images/photo.png': 'src/images/photo.png', // 'destination': 'source'
					'dist/images/badge.jpg': 'src/images/badge.jpg'
				}
			}
		},

		/* S [Task liverload] --------------------------------------------------------------------------*/
		livereload: {
			port: 35729 // Default livereload listening port.
		},
		connect: {
			livereload: {
				options: {
					port: 9001,
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, options.base)]
					}
				}
			}
		},
		// Configuration to be run (and then tested)
		regarde: {
			html: {
				files: 'src/**/*.html',
				tasks: ['livereload']
			},
			css:{
				files: 'src/css/*.css',
				tasks: ['livereload']
			},
			js:{
				files: 'src/js/*.js',
				tasks: ['livereload']
			}
		}
		/* E--------------------------------------------------------------------------*/

	});

	// Load the plugin HTML/CSS/JS/IMG min
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	// Build task(s).
	grunt.registerTask('build', ['htmlmin', 'uglify', 'cssmin', 'imagemin']);

	/* [liverload plugin & task ] ---------------*/
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.registerTask('live', ['livereload-start', 'connect', 'regarde']);
};