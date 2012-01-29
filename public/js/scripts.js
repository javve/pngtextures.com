$(function() {
    var $container = $('body'),
        $textures = [],
        $currentTexture = null,
        currentColor = "#fff",
        canvas = {
            preview: null,
            transparent: null,
            filled: null,
			inverter: null
        },
        ctx = {
            preview: null,
            transparent: null,
            filled: null
        },
        opacity = 1,
		inverter = false;
        
    var init = {
        start: function() {
            this.canvas();
            this.textures();
			this.callbacks();
            resize();
            draw.all();
        },
        canvas: function() {
            canvas.preview = document.getElementById('canvas-preview');
            ctx.preview = canvas.preview.getContext('2d');
            
            canvas.transparent = document.getElementById('canvas-transparent');
            ctx.transparent = canvas.transparent.getContext('2d');
            
            canvas.filled = document.getElementById('canvas-filled');
            ctx.filled = canvas.filled.getContext('2d');
            
            canvas.inverter = document.getElementById('image-inverter');
            ctx.inverter = canvas.inverter.getContext('2d');
        },
        callbacks: function() {
            $('#color-picker').change(function(){
                currentColor = '#'+$(this).val()
                draw.all();
            });
			$('#invert').click(invert.start);
        },
        textures: function() {
            $textures = $('#textures img');
            $textures.hide();
            helpers.updateTextures();
            $currentTexture = $textures.first();
            $('#textures li').click(function() {
                $currentTexture = $(this).find('img');
                draw.all();
            });
        }
    };
	
    var resize = function() {
        var newWidth = $(window).width(),
        newHeight = $(window).height();
        
        canvas.preview.width = newWidth;
        canvas.preview.height = newHeight;
    };
	
    var draw = {
        all: function() {
            var tWidth = $currentTexture.width(),
                tHeight =  $currentTexture.height(),
                img = $currentTexture.get(0);

			this.transparent(img, tWidth, tHeight);
			
			//imageData = ctx.transparent.getImageData(0, 0, canvas.transparent.width, canvas.transparent.height),
			
	        this.filled(img, tWidth, tHeight);   
            this.preview(img, tWidth, tHeight);
            
            updateLinks();
        },
        preview: function(img, tWidth, tHeight) {
            ctx.preview.clearRect(0, 0, canvas.preview.width, canvas.preview.height);
            canvas.preview.style.backgroundColor = currentColor;
            this.pattern(img, ctx.preview, canvas.preview);
        },
        transparent: function(img, tWidth, tHeight) {
			helpers.adjustCanvasSize(canvas.transparent, tWidth, tHeight);
            this.pattern(img, ctx.transparent, canvas.transparent);
        },
        filled: function(img, tWidth, tHeight) {
			helpers.adjustCanvasSize(canvas.filled, tWidth, tHeight);
			
            ctx.filled.fillStyle = currentColor; 
            ctx.filled.fillRect(0,0,canvas.filled.width,canvas.filled.height);
            
            this.pattern(img, ctx.filled, canvas.filled);
        },
        pattern: function(img, ctxO, canvasO) {
            var pattern = ctxO.createPattern(img, "repeat");
            ctxO.rect(0,0,canvasO.width,canvasO.height);
            ctxO.fillStyle = pattern;
            ctxO.globalAlpha = opacity;
            ctxO.fill();
        }
    };
	
	var invert = {
		start: function() {
			$textures.each(function() {
				var $that = $(this);
				invert.canvas($that);
				invert.image($that);
				ctx.inverter.rect(0,0,canvas.inverter.width,canvas.inverter.height);
			});
            helpers.updateTextures();
		},
		canvas: function($that) {
            var tWidth = $that.width(),
                tHeight =  $that.height(),
                img = $that.get(0);
				
			helpers.adjustCanvasSize(canvas.inverter, tWidth, tHeight);
			draw.pattern(img, ctx.inverter, canvas.inverter);
		},
		image: function($that) {
			var imageData = ctx.inverter.getImageData(0, 0, canvas.inverter.width, canvas.inverter.height),
			    data = imageData.data;
 
		    for (var i = 0; i < data.length; i += 4) {
		        data[i] = 255 - data[i]; // red
		        data[i + 1] = 255 - data[i + 1]; // green
		        data[i + 2] = 255 - data[i + 2]; // blue
		        // i+3 is alpha (the fourth element)
		    }
			imageData.data = data;
			ctx.inverter.putImageData(imageData, 0, 0);				
			
			$that.attr('src', canvas.inverter.toDataURL());
		}
	};
	
	var helpers = {
		adjustCanvasSize: function(canvas, tWidth, tHeight) {
            var xTimes = Math.ceil(30 / tWidth);
            var yTimes = Math.ceil(30 / tHeight);
            
            canvas.width = tWidth*xTimes;
            canvas.height = tHeight*yTimes;
		},
		updateTextures: function() {
            $textures.each(function() {
                var img = $(this);
                img.parent().css({
                   'background-image': 'url('+img.attr('src')+')'
                });
            });
		}
	};
    
    var updateLinks = function() {
        $('#save-canvas-transparent').attr('href', canvas.transparent.toDataURL());
        $('#save-canvas-filled').attr('href', canvas.filled.toDataURL());
    };
    
    init.start();
});