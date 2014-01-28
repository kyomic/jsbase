define( function(require, module, exports){
	var Log = require("./log/Log");
	module.init = function( url ){
		var source = 0;
		var context;
		var jsProcessor = 0;

		
		var initAudio = function(){

			//
			if( window.AudioContext ){
				context = new AudioContext();
			}else{
				context = new webkitAudioContext();
			}
    		source = context.createBufferSource();
    		Log.log("initAudio", context, source);


    		// This AudioNode will do the amplitude modulation effect directly in JavaScript
		    jsProcessor = context.createJavaScriptNode(2048);
		    jsProcessor.onaudioprocess = audioAvailable;			// run jsfft audio frame event
		    
		    // Connect the processing graph: source -> jsProcessor -> analyser -> destination
		    source.connect(jsProcessor);
		    jsProcessor.connect(context.destination);

		    // Load the sample buffer for the audio source
		    loadSample("BY2 - 这叫爱.mp3");
		};

		

		var theme = ["rgba(255, 255, 255,","rgba(240, 240, 240,","rgba(210, 210, 210,","rgba(180, 180, 180,","rgba(150, 150, 150,","rgba(120, 120, 150,","rgba(90, 90, 150,","rgba(60, 60, 180,","rgba(30, 30, 180,","rgba(0, 0, 200,","rgba(0, 0, 210,","rgba(0, 0, 220,","rgba(0, 0, 230,","rgba(0, 0, 240,","rgba(0, 0, 255,","rgba(0, 30, 255,","rgba(0, 60, 255,","rgba(0, 90, 255,","rgba(0, 120, 255,","rgba(0, 150, 255,"];
		
		var histoindex = 0;
		var histomax = 500;
		
		histobuffer_x = new Array();
		histobuffer_y = new Array();
		histobuffer_t = new Array();
		for (a=0;a<histomax;a++) {
			histobuffer_t[a] = 0;
		}
		
		maxvalue = new Array();
		for (a=0;a<1024;a++) {
			maxvalue[a] = 0;
		}
		
		currentvalue = new Array();
		
		var frameBufferSize = 4096;
		var bufferSize = frameBufferSize/4;
		
		var signal = new Float32Array(bufferSize);
		var peak = new Float32Array(bufferSize);
		
		var fft = new FFT(bufferSize, 44100);
		
		
		var canvas = document.getElementById('fft');
		var ctx = canvas.getContext('2d');
		var audioAvailable = function(event) {
			//Log.log("audioAvailable", event);
			// Copy input arrays to output arrays to play sound
			var inputArrayL = event.inputBuffer.getChannelData(0);
			var inputArrayR = event.inputBuffer.getChannelData(1);
			var outputArrayL = event.outputBuffer.getChannelData(0);
			var outputArrayR = event.outputBuffer.getChannelData(1);
			
			var n = inputArrayL.length;

			//Log.log("n="+n, "bufferSize="+bufferSize);
			for (var i = 0; i < n; ++i) {
				outputArrayL[i] = inputArrayL[i];
				outputArrayR[i] = inputArrayR[i];
				signal[i] = (inputArrayL[i] + inputArrayR[i]) / 2;		// create data frame for fft - deinterleave and mix down to mono
			}
			
			// perform forward transform
			fft.forward(signal);
			
			for ( var i = 0; i < bufferSize/8; i++ ) {
				magnitude = fft.spectrum[i] * 8000; 					// multiply spectrum by a zoom value
				
				currentvalue[i] = magnitude;
				
				if (magnitude > maxvalue[i]) {
					maxvalue[i] = magnitude;
					new_pos(canvas.width/2 + i*4 + 4,(canvas.height/2)-magnitude-20);
					new_pos(canvas.width/2 + i*4 + 4,(canvas.height/2)+magnitude+20);
					new_pos(canvas.width/2 - i*4 + 4,(canvas.height/2)-magnitude-20);
					new_pos(canvas.width/2 - i*4 + 4,(canvas.height/2)+magnitude+20);
				} else {
					if (maxvalue[i] > 10) {
						maxvalue[i]--;
					}
				}
			
			}
		}

		var new_pos = function(x,y) {
			x = Math.floor(x);
			y = Math.floor(y);
			
			histobuffer_t[histoindex] = 19;
			histobuffer_x[histoindex] = x;
			histobuffer_y[histoindex++] = y;
			
			if (histoindex > histomax) {
				histoindex = 0;
			}
		}
		var spectrum_on = true;
		
		var visualizer = function() {
	
			ctx.clearRect(0,0, canvas.width, canvas.height);
	
			if (spectrum_on) {
				ctx.fillStyle = '#000044';
				for (var i=0; i<currentvalue.length; i++) {
					// Draw rectangle bars for each frequency bin
					ctx.fillRect(i * 8, canvas.height, 7, -currentvalue[i]*3);
				}
			}
	
			for (h=0;h<histomax;h++) {
				if (histobuffer_t[h] > 0) {
					var size = histobuffer_t[h] * 4;
					ctx.fillStyle = theme[ (histobuffer_t[h])] + (0.5 - (0.5 - histobuffer_t[h]/40))+')';
					ctx.beginPath();
					ctx.arc(histobuffer_x[h], histobuffer_y[h], size * .5, 0, Math.PI*2, true); 
					ctx.closePath();
					ctx.fill();
	
					histobuffer_t[h] = histobuffer_t[h] - 1;
					histobuffer_y[h] = histobuffer_y[h] - 3 + Math.random() * 6;
					histobuffer_x[h] = histobuffer_x[h] - 3 + Math.random() * 6;
				}
			}
			t = setTimeout(visualizer,50);
		}


		var loadSample = function( url ){
			var request = new XMLHttpRequest();
		    request.open("GET", url, true);
		    request.responseType = "arraybuffer";

		    request.onload = function() { 
		    	Log.log("onMp3 Loaded.")
		        source.buffer = context.createBuffer(request.response, false);
		        source.looping = true;
		        source.noteOn(0);

		        Log.log("onMp3 Loaded.")
				visualizer();				// run jsfft visualizer
		    }

		    request.send();
		}
		initAudio();
		return;

		
	}



	module.init2 = function(){
		if (! window.AudioContext) {
	        if (! window.webkitAudioContext) {
	            alert('no audiocontext found');
	        }
	        window.AudioContext = window.webkitAudioContext;
	    }

	    var context = new AudioContext();
	    var audioBuffer;
	    var sourceNode;

	    var analyser;
    	var javascriptNode;


	    var setupAudioNodes = function(){
	    	// create a buffer source node
	        sourceNode = context.createBufferSource();
	        // and connect to destination
	        sourceNode.connect(context.destination);

	        // setup a analyzer
	        analyser = context.createAnalyser();
	        analyser.smoothingTimeConstant = 0;
	        analyser.fftSize = 1024;
	    }
	    var onError = function(e){
	    	Log.log("onMp3 load error:", e);
	    }
	    var playSound = function (buffer) {
	    	Log.log( buffer );
	        sourceNode.buffer = buffer;
	        sourceNode.start(0);
	    }
	    var loadSound = function( url ){
	    	var request = new XMLHttpRequest();
	        request.open('GET', url, true);
	        request.responseType = 'arraybuffer';

	        // When loaded decode the data
	        request.onload = function() {
	        	Log.log("onMp3 Loaded.")
	            // decode the data
	            context.decodeAudioData(request.response, function(buffer) {
	                // when the audio is decoded play the sound
	                Log.log("onDecodeAudioData,buffer=", buffer);
	                playSound(buffer);
	            }, onError);
	        }
	        request.send();
	    }

	    function drawSpectrogram(array) {
	        // copy the current canvas onto the temp canvas
	        var canvas = document.getElementById("canvas");

	        tempCtx.drawImage(canvas, 0, 0, 800, 512);

	        // iterate over the elements from the array
	        for (var i = 0; i < array.length; i++) {
	            // draw each pixel with the specific color
	            var value = array[i];
	            ctx.fillStyle = hot.getColor(value).hex();

	            // draw the line at the right side of the canvas
	            ctx.fillRect(800 - 1, 512 - i, 1, 1);
	        }

	        // set translate on the canvas
	        ctx.translate(-1, 0);
	        // draw the copied image
	        ctx.drawImage(tempCanvas, 0, 0, 800, 512, 0, 0, 800, 512);

	        // reset the transformation matrix
	        ctx.setTransform(1, 0, 0, 1, 0, 0);

	    }
	    setupAudioNodes();
    	loadSound("Heaven.ogg");
	}

	module.init3 = function(){

		var audio = new Audio();
		audio.setAttribute("onaudiowritten", "console.log(event)");
		audio.setAttribute("onplay", "console.log('play', event)");
		document.body.appendChild( audio );
		audio.setAttribute("src", "Heaven.ogg");
		audio.play();
	}
})