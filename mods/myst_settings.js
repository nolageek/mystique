load("sbbsdefs.js");
load("myst_colors.js");

var mystSettings 	= system.text_dir + 'menu/' + user.command_shell + '/myst_settings.js';

var DDconfig 		= "";
	if (file_exists('/sbbs/xtrn/DDMsgReader/' + user.command_shell + '-DDMsgReader.cfg'))
	DDconfig 		= " -configFilename=" + user.command_shell + "-DDMsgReader.cfg";

// SET DEFAULT VALUES
// set up default colors; in case no theme settings.js file is found.

var color = [];
	color.dark		= 	DARKGRAY;
	color.normal	= 	LIGHTGRAY;
	color.bright	=	WHITE;
	color.reset		=	RESETCOLOR;
	color.alert		=	BG_RED+WHITE;
	color.yes		=	BG_GREEN+WHITE;
	color.info		=	BG_LIGHTGRAY+color.bright;
	color.select	=	BG_BLUE+color.bright;

var quesBox = color.dark + "[\1n" + color.bright + "?\1n" + color.dark + "]\1n";
var warnBox = color.dark + "[\1n" + color.bright + "!\1n" + color.dark + "]\1n";
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

bbs.revert_text();
		
if (file_exists(mystSettings)) 
   load(mystSettings);

bbs.replace_text(94,color.normal + "Search all groups for new messages\1n");
bbs.replace_text(95,color.normal + "Search all groups for un-read messages to you\1n");
bbs.replace_text(96,color.bright + "Are you sure\1n");

bbs.replace_text(119,"Log Off\1n");
bbs.replace_text(156,color.bright + "I'm sorry, did you forget something?\1n\r\n");
bbs.replace_text(369,color.bright + "Does your terminal support IBM extended ASCII\1n");
bbs.replace_text(338,"@CLS@@MENU:newuser@@GOTOXY:3,18@" + color.normal + "Enter your alias or full name\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(370,"@GOTOXY:3,23@" + color.normal + "You can't use that name (duplicate or invalid).\1n");
bbs.replace_text(346,"@GOTOXY:3,19@" + color.normal + "Enter your location, afiliation, or public note\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(345,"@GOTOXY:3,20@" + color.normal + "Enter your birthday (@DATEFMT@)\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(500,"@GOTOXY:3,21@" + color.normal + "Network mail address" + color.t_sym + " (Example: user@domain)" + color.dark + ":\1n " + "\1n\r\n" + color.info + "  This may be used for password recovery\1n" + color.d_value + "\r\n  ");
bbs.replace_text(499,color.bright + "Forward personal e-mail to network mail address\1n");
bbs.replace_text(350,color.bright + "Is the above information correct\1n");
bbs.replace_text(331,color.bright + " Enter a different password\1n");
bbs.replace_text(332,warnBox + color.normal + " New password (4-8 chars)\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(333,color.bright + " Verify (enter again)\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(334,warnBox + color.t_alert + " Wrong!\1n");
bbs.replace_text(335,warnBox + color.t_yes + " Password changed.\1n\r\n");
bbs.replace_text(367,""); //Do you have a color terminal
bbs.replace_text(366,""); //Does your terminal support ANSI
bbs.replace_text(369,""); //Does your terminal support IBM extended ASCII
bbs.replace_text(371,color.normal + "Your password is" + color.info + "%s\1n\r\n");
bbs.replace_text(372,warnBox + color.bright + "Write down your password and keep it confidential.\1n\r\n\r\n" + warnBox + color.bright + " Enter this password for verification\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(764,"@EXEC:findansi newuser@"); // replace with ansi
bbs.replace_text(339,quesBox + color.normal + " Enter your full real name= \1w");
bbs.replace_text(340,quesBox + color.normal + " Enter your group affiliation\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(341,quesBox + color.normal + " Enter your handle or call-sign= \1n\1w");
bbs.replace_text(342,quesBox + color.normal + " Enter your sex (M/F)= \1n\1w");
bbs.replace_text(343,quesBox + color.normal + " Enter your street address= \1n\1w");
bbs.replace_text(344,quesBox + color.normal + " Enter your voice phone number= \1n\1w");
bbs.replace_text(347,quesBox + color.normal + " Enter your zip (or postal) code= \1n\1w");
bbs.replace_text(362,color.normal + "Read your mail now\1n");
bbs.replace_text(383,"\1h\1w%3u" + color.bright + " \xb3 " + color.normal + "%-25.25s\1h      ");
bbs.replace_text(381,"\1h\1wNum" + color.bright + " \xb3 " + color.normal + "Name                           ");
bbs.replace_text(382,color.bright + "\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4\xc4      ");
bbs.replace_text(384,"@GOTOXY:2,24@" + color.normal + "Which or \1n" + color.bright + "~Q" + color.normal + "uit: \1h");
bbs.replace_text(563,color.dark + "[\1n" + color.normal + "pause\1n" + color.dark + "/\1n" + color.bright + "press any key\1n" + color.dark + "]\1n");
bbs.replace_text(497,quesBox + color.normal + "How many rows on your monitor [\1wAuto Detect\1y]= ");
bbs.replace_text(497,quesBox + color.normal +"Select \1h%s\1n\1g:\1n\r\n\r\n" );
bbs.replace_text(570,"\r\n " + color.bright + user.alias + color.dark + '@\1n' + color.t_menu + "QWK\1n" + color.dark + ": \1n");
bbs.replace_text(660,"@EXEC:DDFLIST@");
bbs.replace_text(661,"@EXEC:DDFL_HDR@");
bbs.replace_text(811,quesBox + color.normal + " HIT your \1n" + color.dark + "BACKSPACE\1n" + color.normal +" or \1n" + color.dark + "DELETE-LEFT\1n" +color.normal + " key:\1n "); 
bbs.replace_text(826,"\15\1n\1hLogging on to @BBS@ as @ALIAS@ @ELLIPSIS@\1n\r\n @RESETPAUSE@");


if(conf.fontcode !="437") {

	bbs.replace_text(381,"\1h\1wNum" + color.normal + " | " + color.normal + "Name                           ");
	bbs.replace_text(382,color.normal + "-------------------------------      ");
	bbs.replace_text(383,"\1h\1w%3u" + color.normal + " | " + color.normal + "%-25.25s\1h      ");
	bbs.replace_text(638,"\1h--- -------------------------    ----");
	bbs.replace_text(694," Node Status:\r\n --- --------------------------------------------------------------------------\r\n\1n");
}

    // MENU STRING COLORS
    color.t_menu	= 	color.normal; // menu name
    color.t_user	= 	color.bright; // username in menus 
    color.t_sym		= 	color.dark; // symbols color @; [ ]; ( );etc..
    color.t_sym2	= 	color.dark; // symbol highlght (numbers in [1]; menu options [A]; etc..)
    color.t_txt		= 	color.normal; // color for most text
    color.t_txt2	= 	color.bright; // aux color for text; bold words; values; etc...
    color.t_ques	= 	color.normal; // color for question prompts
    color.t_alert	= 	color.alert; // color for alert text
    color.t_yes		= 	color.yes; // color for success text
	color.t_success	= 	color.yes; // color for success text
    color.t_info	= 	color.info; // color for info text
	// PROMPT COLORS
	color.p_bracket1 = color.t_sym; // Color for Prompt brackets L
	color.p_bracket2 = color.t_sym; // Color for Prompt brackets R
	color.p_string	= color.dark; // Color for string inside bracket
	color.p_group	= color.bright; //Color for message group
	color.p_area	= color.t_menu; //Color for message sub
	color.p_xpert	= color.t_sym; // Color for .xpert label
	color.p_menu	= color.t_menu; // Color for menu name
	color.p_menu2	= color.t_menu; // Color for menu name
	color.p_menu3	= color.t_menu; // Color for menu name
	color.p_user	= color.bright; // Color for username
	color.p_at		= color.t_sym; // Color for @
	// LAST CALLER COLORS
	color.lc_prompt = ''; // color for last caller prompt
	color.lc_user	= ''; // color for last caller username
	color.lc_location = ''; // color for last caller location
	color.lc_shell	= ''; // color for last caller shell
	color.lc_seen	= ''; // color for last caller seen
	color.lc_on		= ''; // color for last caller time on
	color.lc_bracket = ''; // color for last caller bracket
	color.lc_what	= ''; // color for last caller what they did
	color.lc_calls	= ''; // color for last caller calls
    // DEFAULTS PAGE COLORS
    color.d_txt		= color.normal; // defaults option text
    color.d_value	= color.bright; // defaults current value
    color.d_on		= color.bright; // defaults 'on' color
    color.d_off		= color.dark; // defaults 'off' color
    color.d_head	= color.normal;  // defaults header

// These are the default user configurable options (from settings.js in theme directory)

   


//  Default screenRows to console.screen_rows; overwrite if user has set this option in defaults.
var screenRows = console.screen_rows;
    
if (user.screen_rows) 
    screenRows = user.screen_rows;
    

// Get options and colors from settings.js in theme directory. Overwrite defaults if found.
