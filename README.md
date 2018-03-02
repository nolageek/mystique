Mystique Synchronet 3.16+ Command Shell

This is still very much in development. You can see it in use on my BBS, capitolshrill.com.

I'm writing this synchronet shell since I couldn't find a simple one that was written in js - they're mostly in BAJA and that prevented a lot of what I wanted to do. I'm pulling a lot of inspiration from various other BBS software.

NOTE: At this time I am *not supporting* this shell in any way and I would not recommend using this on your board unless you wanted to mess with it. It shouldn't break anthing in particular though.

I am working on making it more generic so others can use it.

Features: 

* Simple to create child themes. Just rename mystique.bin to the shell code used in scfg and put new theme ANSIs in a matching directory in text/menu/ --- If menu file is not found in this directory, it will use the default in text/menu/mystique/
* Improved 'last 10 callers' page, based on ami-x style boards (with user activity flags for entries)
* Random ansis for everything. ex: main.ans,main2.ans,main-new.ans,mainfive.ans should all rotate for main menus.
* setting overrides for sub themes (default font, colors, etc)

Recent changes:
2/28/2018
* JSON database for last 10 callers, automsg and rumors no longer an option. I didn't feel it was really needed.
* rumors and automessage mods are no longer built in and will soon be released separately.
* Cleaned up my Incredibly Terrible code a bit - is now merely Really Terrible.
* Streamlined menu options - it's very likely some options are missing on the menus or vice versa.
