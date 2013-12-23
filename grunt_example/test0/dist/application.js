/*! test0*/
/*! 0.1.0*/
/*! */
/*! 2013-12-16 */
define("application/dist/application",["./util"],function(a){var b=a("./util"),c=document.getElementById("hello-seajs");c.style.color=b.randomColor(),window.setInterval(function(){c.style.color=b.randomColor()},1500)});