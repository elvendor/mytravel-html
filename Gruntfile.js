/*!
 *  Gruntfile
 */

module.exports = function( grunt ) {
	'use strict';

	// Force use of Unix newlines
	grunt.util.linefeed = '\n';

	// Project Configuration
	grunt.initConfig({

		//Metadata
		pkg: grunt.file.readJSON( 'package.json' ),

		//Setting folder templates
		dirs: {
			themeJS: 'src/assets/js',
			themeCSS: 'src/assets/css',
			themeSASS: 'src/assets/sass',
			distHTML: 'dist/HTML',
			distPHP: 'dist/PHP',
			newThemeCSS: '2.0/src/assets/css',
			newThemeSCSS: '2.0/src/assets/scss'
		},

		// JavaScript linting with JSHint.
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= dirs.themeJS %>/*.js',
				'!<%= dirs.themeJS %>/*.min.js'
			]
		},

		// Minify .js files.
		uglify: {
			options: {
				preserveComments: 'some'
			},
			main: {
				files: [{
					expand: true,
					cwd: '<%= dirs.themeJS %>',
					src: [
						'*.js',
						'!*.min.js'
					],
					dest: '<%= dirs.themeJS %>',
					ext: '.min.js'
				}]
			}
		},

		// Minify .css files.
		cssmin: {
			main: {
				files: [{
					expand: true,
					cwd: '<%= dirs.themeCSS %>/',
					src: [
						'*.css',
						'!*.min.css'
					],
					dest: '<%= dirs.themeCSS %>/',
					ext: '.min.css'
				}]
			}
		},

		// Compile all .scss files.
		sass: {
			dist: {
				files: [{
					'<%= dirs.newThemeCSS %>/style.css': '<%= dirs.newThemeSCSS %>/style.scss'
				}]
			}
		},

		// Watch changes for assets.
		watch: {
			css: {
				files: [
					'<%= dirs.themeSASS %>/*.scss'
				],
				tasks: [
					'sass',
					'css'
				]
			},
			js: {
				files: [
					// main js
					'<%= dirs.themeJS %>/*js',
					'!<%= dirs.themeJS %>/*.min.js'
				],
				tasks: ['uglify']
			}
		},

		version: {
			theme_sass: {
				options: {
					prefix: 'Version:\\s*\\s'
				},
				src: [
					'<%= dirs.themeSASS %>/style.scss',
					'<%= dirs.themeSASS %>/rtl.scss'
				]
			}
		},

		// Clean previous deployed files
		clean: {
			dist: [
				'<%= pkg.name %>*.zip'
			],
			files: '.grunt'
		},

		// make a zipfile
		compress: {
			main: {
				options: {
					archive: '<%= pkg.name %>-v<%= pkg.version %>.zip'
				},
				files: [ {
					expand: true,
					cwd: 'dist/',
					dest: '<%= pkg.name %>-v<%= pkg.version %>',
					src: [
						'**',
						'!.*',
						'!.*/**',
						'.htaccess',
						'!Gruntfile.js',
						'!README.md',
						'!package.json',
						'!node_modules/**',
						'!.DS_Store',
						'!npm-debug.log'
					]
				} ],
			}
		},

		// copy files to dest
		copy: {
			main: {
				files: [ {
					expand: true,
					cwd: 'src/',
					dest: '<%= dirs.distPHP %>/',
					src: [
						'**',
						'!.*',
						'!.*/**',
						'.htaccess',
						'!Gruntfile.js',
						'!README.md',
						'!package.json',
						'!node_modules/**',
						'!.DS_Store',
						'!npm-debug.log',
						'!switchstylesheet/**',
						'!assets/images/**'
					]
				} ]
			}
		},

		'gh-pages': {
			pages: {
				options: {
					base : 'gh-pages'
				},
				src: ['**']
			}
		}

	});

	// Load NPM tasks to be used here
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-version' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-gh-pages' );
	grunt.loadNpmTasks( 'grunt-php2html' );

	// Load NPM tasks to be used here
	grunt.loadNpmTasks( 'grunt-sass' );

	// Register tasks
	grunt.registerTask( 'default', [
		'css',
		'uglify'
	]);

	grunt.registerTask( 'css', [
		'sass',
		'cssmin'
	]);

	grunt.registerTask( 'deploy', [
		'copy:main'
	]);

	grunt.registerTask( 'publish', [
		'gh-pages:pages',
		'clean:files'
	]);

	grunt.registerTask( 'build', [
		'clean:dist', 'compress:main'
	]);

};
