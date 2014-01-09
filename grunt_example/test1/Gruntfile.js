module.exports = function(grunt) {
       // 配置
       grunt.initConfig({
              pkg : grunt.file.readJSON('package.json'),
              transport: {
                 options : {
                // format : 'application/dist/{{filename}}'  //生成的id的格式
               },
     //           application : {
     //                files : {
     //                     '.build' : [
           //                     'src/base.js',
                                   //          'src/class.js',
                                   //          'src/event.js',
                                   //          'src/plugin.js',
                                   //          'src/player.js',
                                   //          'src/main.js',
                                   //          'src/listmain.js'
                                   // ]   //将application.js、util.js合并且提取依赖，生成id，之后放在.build目录下
     //                }
     //           }


               target_name: {
                          files: [{
                              cwd: 'src',
                              src: '**/*',
                              dest: 'dist'
                          }]
                      }


              },
              // concat : {
              //   main : {
              //          options : {
  //                       include : "relative"
  //                   },
              //          src: [
              //                 'dist/main.js'

              //          ],
              //          dest: 'dest/js/<%= pkg.version %>/main-debug.js'
              //   },
              //   kplayer : {
              //          options : {
  //                       include : "relative"
  //                   },
              //          src: [
              //                 'dist/kplayer.js'

              //          ],
              //          dest: 'dest/js/<%= pkg.version %>/kplayer-debug.js'
              //   }
              // },
              concat : {
                     main : {
                            options : {
                      //  include : "relative"
                    },
                            src: ['dist/a.js','dist/b.js'],
                            dest: 'dest/md.js'
                     }
              },
              uglify : {
                     options : {
                            banner : '/*! <%= pkg.name %>*/\n/*! <%= pkg.version %>*/\n/*! <%= pkg.author %>*/\n/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                     },
                     target:{
                            files: {
                                   'dest/js/<%= pkg.version %>/main.js': 'dest/js/<%= pkg.version %>/main-debug.js',
                                   'dest/js/<%= pkg.version %>/kplayer.js': 'dest/js/<%= pkg.version %>/kplayer-debug.js'
                            }
                     }
                     
              }
       });
       // 载入concat和uglify插件，分别对于合并和压缩
       grunt.loadNpmTasks('grunt-cmd-transport');
       grunt.loadNpmTasks('grunt-cmd-concat');
       grunt.loadNpmTasks('grunt-contrib-uglify');
       //grunt.loadNpmTasks('grunt-contrib-cssmin');
       // 注册任务
       grunt.registerTask('default', ['transport', 'concat']);
};
