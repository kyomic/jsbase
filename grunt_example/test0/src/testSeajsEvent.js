define( function(require,exports,module){
	seajs.on("resolve", function(data) {
		console.log("onresole:", data );
	});
	seajs.on("request", function(data) {
		console.log("onrequest:", data );
	});
});