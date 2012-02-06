# PNGTextures.com

[PNGTextures.com](http://pngtextures.com) is a site where you can 
create your own textures. This Github project is here so that 
you can add you own default textures.

If you have any questions, make a issue report or ping
me at Twitter by the name [@javve](http://twitter.com/javve).

Btw, why don't you checkout my website [JonnyStromberg.com](http://jonnystromberg.com) 
or some of my projects [List.js](http://listjs.com), 
[StartupLoction.com](http://startuplocation.com), [SilarApp.com](http://silarapp.com) & [Hash.js](http://github.com/javve/hash.js)

## How to add a texture

1. Fork this project

2. Put the `.png` file in `/textures` and preferably the `.psd` 
(if its available) in `/textures/psd`

3. Add the texture to the `<ul id="textures">` at line ~80 in `index.html`.
See syntax here:

	    <li 
	        data-name="Texture name" 
	        data-author-name="Your Name" 
	        data-author-url="http://youwebsite.com" 
	        data-author-twitter="yourtwittername"
	    >
		    <img src="textures/linen.png" />
	    </li>	    
Note that only `data-name` is **required**.

4. Commit and make pull request.

## READ BEFORE YOU ADD A TEXTURE
1. **Black is king:** Textures may **only** consist of black color in with optional
alpha transparency. This is for making the textures as flexible as possible.
2. **High contrast**. Remember that the site have opacity control with means that
the users themselves have the power to choose how strong they want your texture
to be.
3. **Copyright?**. By adding textures you allow anyone to use, modify or sell you work,
commercially or personally.
_And rememeber: Only post textures created by yourself or 
ones that you have solid premission to post._