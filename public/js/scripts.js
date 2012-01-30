$(window).load(function() {
    var $container = $('body'),
        $textures = [],
        $currentTexture = null,
        currentColor = undefined,
        canvas = {
            preview: null,
            transparent: null,
            filled: null,
			inverter: null
        },
        ctx = {
            preview: null,
            transparent: null,
            filled: null,
			inverter: null
        },
        opacity = undefined,
		inverted = undefined,
		prefix = "pngtextures";
        
    var init = {
        start: function() {
			this.loadSaved();
            this.canvas();
            this.textures();
			this.callbacks();
            resize();
            draw.all();
        },
		loadSaved: function() {
			storage.get.opacity(),
			storage.get.inverted();
			storage.get.color();
			storage.get.texture();
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
			console.log(currentColor, opacity, $currentTexture);
			$("#colorpicker").CanvasColorPicker({
				flat:true,
				showButtons: false,
				showPreview: false,
				showColor: false,
				color: helpers.hexToRgb(currentColor),
				onColorChange:function(rgb,hsv){
					currentColor = helpers.rgbToHex(rgb.r, rgb.g, rgb.b);
					storage.save.color();
					draw.all();
				}
			});
			$('#invert').click(invert.start);
			$('#opacity').change(function() {
				opacity = $(this).val() / 100;
				storage.save.opacity();
				draw.all();
			});
			$('#opacity').val(storage.get.opacity()*100);
        },
        textures: function() {
            $textures = $('#textures img');
            helpers.updateTextures();
            $('#textures li').click(function() {
				$('#textures li').removeClass('active');
				$(this).addClass('active');
                $currentTexture = $(this).find('img');
				storage.save.texture();
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
			
			$(document.body).css({
				'background-color': currentColor
			});	
			
			this.transparent(img, tWidth, tHeight);
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
			draw.all();
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
				data[i + 3] = 255 - data[i + 3]; // alpha
		    }
			imageData.data = data;
			ctx.inverter.putImageData(imageData, 0, 0);				
			
			$that.attr('src', canvas.inverter.toDataURL());
		}
	};
	
	var helpers = {
		adjustCanvasSize: function(canvas, tWidth, tHeight) {
            var xTimes = Math.ceil(50 / tWidth);
            var yTimes = Math.ceil(50 / tHeight);
            
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
		},
		rgbToHex: function(r, g, b) {
			function componentToHex(c) {
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}
		    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		},
		hexToRgb: function(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		}
	};
    
    var updateLinks = function() {
        //$('#save-canvas-transparent').attr('href', canvas.transparent.toDataURL());
        //$('#save-canvas-filled').attr('href', canvas.filled.toDataURL());
    };
	
	var storage = {
		save: {
			opacity: function() {
				return (localStorage) ? localStorage.setItem(prefix+'opacity', opacity) : null;
			},
			inverted: function() {
				return (localStorage) ? localStorage.setItem(prefix+'inverted', inverted) : null;
			},
			color: function() {
				return (localStorage) ? localStorage.setItem(prefix+'color', currentColor) : null;
			},
			texture: function() {
				return (localStorage) ? localStorage.setItem(prefix+'texture', $currentTexture.attr('src')) : null;
			}
		},
		get: {
			opacity: function() {
				opacity = (localStorage) ? localStorage.getItem(prefix+'opacity') || 0.5 : 0.5;
			},
			inverted: function() {
				inverted = (localStorage) ? localStorage.getItem(prefix+'inverted') || false : false;	
			},
			color: function() {
				currentColor = (localStorage) ? localStorage.getItem(prefix+'color') || "#ffffff" : "#ffffff";
			},
			texture: function() {
				var src = localStorage ? localStorage.getItem(prefix+'texture') || null : null;
				$currentTexture = $('#textures img').first();
				$('#textures img').each(function() {
					if (this.src.indexOf(src) != -1) {
						$currentTexture = $(this);
					}
				});
			}
		}
	};
    
    init.start();
});