load("sbbsdefs.js"); // load helper functions

// SET DEFAULT VALUES
// set up default colors, in case no theme settings.js file is found.
var color = {
                            // MENU STRING COLORS
    t_menu  : '\1h\1b', // menu name
    t_user  : '\1h\1c', // username in menus 
    t_sym   : '\1n\1b', // symbols color @, [ ], ( ),etc..
    t_sym2  : '\1h\1c', // symbol highlght (numbers in [1], menu options [A], etc..)
    t_txt   : '\1h\1b', // color for most text
    t_txt2  : '\1h\1m', // aux color for text, bold words, values, etc...
    t_ques  : '\1h\1y', // color for question prompts
    t_alert     : '\1h\1r', // color for alert text
    t_yes   : '\1h\1g', // color for success text
    t_info  : '\1h\1c', // color for info text
                            // DEFAULTS PAGE COLORS
    d_text  : '\1h\1b', // defaults option text
    d_value     : '\1h\1c', // defaults current value
    d_on        : '\1n\1c', // defaults 'on' color
    d_off   : '\1n\1c', // defaults 'off' color
    d_head  : '\1h\1w'  // defaults header
}

// These are the default user configurable options (from settings.js in theme directory)
var conf = {
    fontcode    : '437',
    useDefDoors : 1,
    ircChannels : [{    
        channel:"#bbs",
        name:"#bbs",
        server:"irc.synchro.net",
        port:6667
        },{ 
        channel:"#synchronet",
        name:"#synchronet",
        server:"irc.synchro.net",
        port:6667
        },{ 
        channel:"#bbs",
        name:"#/r/bbs",
        server:"irc.snoonet.org",
        port:6667
        }]
    }


//  Default screenRows to console.screen_rows, overwrite if user has set this option in defaults.
var screenRows = console.screen_rows;
    
if (user.screen_rows) {
    screenRows = user.screen_rows;
    }

// Set up Activity Flags.
var activity = {
    posted      : '-',
    gfiles      : '-',
    fsysop      : '-',
    readmg      : '-',
    hungup      : 'H', // setting to H now, if user logs out using menu, will change to '-'
    isnewu      : '-',
    doors       : '-',
}


// Get options and colors from settings.js in theme directory. Overwrite defaults if found.

bbs.revert_text();

var settingsFile = system.text_dir + 'menu\\' + user.command_shell + '\\settings.js';
if (file_exists(settingsFile)) {
    load(settingsFile);
}

bbs.replace_text(338,"\1_\1b\1h[\1c?\1b] \1yEnter your full name or alias: \1w");
bbs.replace_text(339,"\1_\1b\1h[\1c?\1b] \1yEnter your full real name: \1w");
bbs.replace_text(340,"\1_\1b\1h[\1c?\1b] \1yEnter your company name: \1w");
bbs.replace_text(341,"\1_\1b\1h[\1c?\1b] \1yEnter your handle or call-sign: \1w");
bbs.replace_text(342,"\1_\1b\1h[\1c?\1b] \1yEnter your sex (M/F): \1w");
bbs.replace_text(343,"\1_\1b\1h[\1c?\1b] \1yEnter your street address: \1w");
bbs.replace_text(344,"\1_\1b\1h[\1c?\1b] \1yEnter your voice phone number: \1w");
bbs.replace_text(345,"\1_\1b\1h[\1c?\1b] \1yEnter your birthday (%s): \1w");
bbs.replace_text(346,"\1_\1b\1h[\1c?\1b] \1yEnter your location or group affiliation): \1w");
bbs.replace_text(347,"\1_\1b\1h[\1c?\1b] \1yEnter your zip (or postal) code: \1w");
bbs.replace_text(497,"\r\n\1_\1b\1h[\1c?\1b] \1yHow many rows on your monitor [\1wAuto Detect\1y]: ");
bbs.replace_text(500,"\1_\1b\1h[\1c?\1b] \1yNetwork mail address (Example: user@domain)\r\n: ");