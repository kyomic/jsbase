define(function(require) {

  

  var aaa = require("store");
  

  require("jquery");
  var ccc = require("./test");
  console.log("test.value=");
  console.log(ccc);

  var str = require("./loadtest");
  console.log("require loadtest.");
  console.log(str);
  //str.test();


  setTimeout( function(){
  		console.log("after 2 second.");
  		console.log(ccc);
  }, 2000);

 
});
