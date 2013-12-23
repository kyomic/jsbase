module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    transport : {
        /*options : {
          format : 'application/dist/{{filename}}'  //生成的id的格式
         },
        application : {
          files : {
            'dist' : ['application.js','util.js']   //将application.js、util.js合并且提取依赖，生成id，之后放在.build目录下
          }
        }*/
        options : {
          format : 'application/dist/{{filename}}'  //生成的id的格式
        },
        target_name: {
            files: [{
                cwd: 'src',
                src: '**/*',
                dest: 'dist'
            }]
        }
    },

    concat:{
      options: {
                separator: ';', //separates scripts
                include: 'relative'
            },
      aaaa: {
        src: ['src/application.js','src/util.js'],
         dest: 'dist/wocao.js'
      }
      /*files:{
        'dist/application.js':['src/application.js','src/util.js']
      }*/
    },

    uglify : {
        options : {
        banner : '/*! <%= pkg.name %>*/\n/*! <%= pkg.version %>*/\n/*! <%= pkg.author %>*/\n/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
               main : {
                    files : {
                         'dist/application.js' : ['dist/application.js'] //对dist/application.js进行压缩，之后存入dist/application.js文件
                    }
               }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-cmd-transport');
     grunt.loadNpmTasks('grunt-cmd-concat');
     grunt.loadNpmTasks('grunt-contrib-uglify');
     grunt.loadNpmTasks('grunt-contrib-clean');
  // Default task(s).
  grunt.registerTask('default', ['transport','concat']);

};