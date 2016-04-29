Mystique Synchronet 3.16+ Command Shell

This is still very much in development. You can see it in action on my BBS, capitolshrill.com.


I'm writing this synchronet shell since I couldn't find a simple one that was written in js - they're mostly in BAJA and that prevented a lot of what I wanted to do. I'm pulling a lot of inspiration from various other BBS software.

NOTE: At this time I am *not supporting* this shell in any way and I would not recommend using this on your board.

I am working on making it more generic so others can use it.



Features: 

* Simple to create child themes. Just rename mystique.bin to the shell code used in scfg and put new theme ANSIs in a matching directory in text/menu/ --- If menu file is not found in this directory, it will use the default in text/menu/mystique/
* Built in rumors mod
* Built in automessage mod
* Improved 'last 10 callers' page, based on ami-x style boards (with usage flags for entries)
