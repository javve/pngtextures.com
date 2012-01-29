$(function() {
    var $container = $('body'),
        $textures = [],
        $currentTexture = null,
        currentColor = "#fff",
        canvas = {
            preview: null,
            transparent: null,
            filled: null
        },
        ctx = {
            preview: null,
            transparent: null,
            filled: null
        },
        opacity = 1;
        
    var init = {
        start: function() {
            this.canvas();
			this.colorPicker();
            this.textures();
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
        },
        colorPicker: function() {
            $('#color-picker').change(function(){
                currentColor = '#'+$(this).val()
                draw.all();
            });
        },
        textures: function() {
            $textures = $('#textures img');
            $textures.hide();
            $textures.each(function() {
                var img = $(this);
                img.parent().css({
                   'background-image': 'url('+img.attr('src')+')'
                });
            })
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
                
            this.preview(img, tWidth, tHeight);
            this.transparent(img, tWidth, tHeight);
            this.filled(img, tWidth, tHeight);
            
            updateLinks();
        },
        preview: function(img, tWidth, tHeight) {
            ctx.preview.clearRect(0, 0, canvas.preview.width, canvas.preview.height);
            canvas.preview.style.backgroundColor = currentColor;
            this.pattern(img, ctx.preview, canvas.preview);
        },
        transparent: function(img, tWidth, tHeight) {
            var xTimes = Math.ceil(30 / tWidth);
            var yTimes = Math.ceil(30 / tHeight);
            canvas.transparent.width = tWidth*xTimes;
            canvas.transparent.height = tHeight*yTimes;
            this.pattern(img, ctx.transparent, canvas.transparent);
        },
        filled: function(img, tWidth, tHeight) {
            var xTimes = Math.ceil(30 / tWidth);
            var yTimes = Math.ceil(30 / tHeight);
            
            canvas.filled.width = tWidth*xTimes;
            canvas.filled.height = tHeight*yTimes;

            ctx.filled.fillStyle = currentColor; 
            ctx.filled.fillRect(0,0,tWidth*xTimes,tHeight*yTimes);
            
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
    
    var updateLinks = function() {
        $('#save-canvas-transparent').attr('href', canvas.transparent.toDataURL());
        $('#save-canvas-filled').attr('href', canvas.filled.toDataURL());
    };
    
    init.start();
});