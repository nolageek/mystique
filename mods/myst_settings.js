load("sbbsdefs.js");
load("myst_colors.js");

var mystSettings 	= system.text_dir + 'menu/' + user.command_shell + '/myst_settings.js';

var DDconfig 		= "";
	if (file_exists('/sbbs/xtrn/DDMsgReader/' + user.command_shell + '-DDMsgReader.cfg'))
	DDconfig 		= " -configFilename=" + user.command_shell + "-DDMsgReader.cfg";

// SET DEFAULT VALUES
// set up default colors; in case no theme settings.js file is found.

var conf = []
    conf.fontcode    = '437';
	conf.rumorsNum	= 10;
	conf.LastCallersNum = 6;
    conf.useDefDoors = 1;
	conf.DDReader = '/sbbs/xtrn/DDMsgReader/DDMsgReader.js';
	conf.spacer = "";
    conf.ircChannels = [{    
        channel:"#bbs",
        name:"#bbs",
        server:"irc.synchro.net",
        port:6667
        },{ 
        channel:"#capitolshrill",
        name:"#capitolshrill",
        server:"irc.synchro.net",
        port:6667
        },{ 
        channel:"#bbs",
        name:"#/r/bbs",
        server:"irc.snoonet.org",
        port:6667
        }]


//  Default screenRows to console.screen_rows; overwrite if user has set this option in defaults.
var screenRows = console.screen_rows;
    
if (user.screen_rows) 
    screenRows = user.screen_rows;
    

// Get options and colors from settings.js in theme directory. Overwrite defaults if found.

if (file_exists(mystSettings))
	load(mystSettings);