load("sbbsdefs.js"); // load helper functions
var settingsFile = system.text_dir + 'menu\\' + user.command_shell + '\\settings.js';
var langFile = system.text_dir + 'menu\\' + user.command_shell + '\\lang.js';
var DDconfig = "";
	if (file_exists('../xtrn/DDMsgReader/' + user.command_shell + '-DDMsgReader.cfg'))
	DDconfig = " -configFilename=" + user.command_shell + "-DDMsgReader.cfg";

// SET DEFAULT VALUES
// set up default colors; in case no theme settings.js file is found.
var color = [];
                            // MENU STRING COLORS
    color.t_menu  = '\1h\1b'; // menu name
    color.t_user  = '\1h\1c'; // username in menus 
    color.t_sym   = '\1h\1k'; // symbols color @; [ ]; ( );etc..
    color.t_sym2  = '\1h\1c'; // symbol highlght (numbers in [1]; menu options [A]; etc..)
    color.t_txt   = '\1h\1b'; // color for most text
    color.t_txt2  = '\1n\1c'; // aux color for text; bold words; values; etc...
    color.t_ques  = '\1h\1r'; // color for question prompts
    color.t_alert     = '\1h\1r'; // color for alert text
    color.t_yes   = '\12\1n\1k'; // color for success text
    color.t_info  = '\1n\1c'; // color for info text
                            // DEFAULTS PAGE COLORS
    color.d_txt  = '\1h\1b'; // defaults option text
    color.d_value     = '\1h\1w'; // defaults current value
    color.d_on        = '\1n\1c'; // defaults 'on' color
    color.d_off   = '\1h\1k'; // defaults 'off' color
    color.d_head  = '\1h\1w';  // defaults header


// These are the default user configurable options (from settings.js in theme directory)
var conf = []
    conf.fontcode    = '437';
	conf.rumorsNum	= 10;
    conf.useDefDoors = 1;
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
    
if (user.screen_rows) {
    screenRows = user.screen_rows;
    }



// Get options and colors from settings.js in theme directory. Overwrite defaults if found.

bbs.revert_text();


if (file_exists(settingsFile)) {
    load(settingsFile);
}

var quesBox = color.t_sym + "[" + color.t_sym2 + "?" + color.t_sym + "]";
var warnBox = color.t_sym + "[" + color.t_alert + "!" + color.t_sym + "]";
bbs.replace_text(94,color.t_txt + "Search all groups for new messages");
bbs.replace_text(95,color.t_txt + "Search all groups for un-read messages to you");
bbs.replace_text(96,color.t_ques + "Are you sure");
bbs.replace_text(119,color.t_info + "Log off");
bbs.replace_text(156,color.t_ques + "I'm sorry, did you forget something?\r\n");
bbs.replace_text(369,color.t_ques + "Does your terminal support IBM extended ASCII");
bbs.replace_text(338,"@CLS@@MENU:newuser@@GOTOXY:3,18@" + color.t_txt + "Enter your alias or full name" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(370,"@GOTOXY:3,23@" + color.t_txt + "You can't use that name (duplicate or invalid).");
bbs.replace_text(346,"@GOTOXY:3,19@" + color.t_txt + "Enter your location, afiliation, or public note" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(345,"@GOTOXY:3,20@" + color.t_txt + "Enter your birthday (@DATEFMT@)" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(500,"@GOTOXY:3,21@" + color.t_txt + "Network mail address" + color.t_sym + " (Example: user@domain)" + color.t_sym2 + ": " + "\r\n" + color.t_info + "  This may be used for password recovery" + color.d_value + "\r\n  ");
bbs.replace_text(499,color.t_txt2 + "Forward personal e-mail to network mail address");
bbs.replace_text(350,color.t_ques + "Is the above information correct");
bbs.replace_text(331,color.t_ques + " Enter a different password");
bbs.replace_text(332,warnBox + color.t_txt + " New password (4-8 chars)" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(333,color.t_txt2 + " Verify (enter again)" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(334,warnBox + color.t_alert + " Wrong!");
bbs.replace_text(335,warnBox + color.t_yes + " Password changed.\r\n");
bbs.replace_text(367,""); //Do you have a color terminal
bbs.replace_text(366,""); //Does your terminal support ANSI
bbs.replace_text(369,""); //Does your terminal support IBM extended ASCII
bbs.replace_text(371,color.t_txt + "Your password is" + color.t_info + "%s\r\n");
bbs.replace_text(372,warnBox + color.t_txt2 + "Write down your password and keep it confidential.\r\n\r\n" + warnBox + color.t_ques + " Enter this password for verification" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(764,"@EXEC:findansi newuser@"); // replace with ansi
	
bbs.replace_text(339,quesBox + color.t_txt + " Enter your full real name= \1w");
bbs.replace_text(340,quesBox + color.t_txt + " Enter your group affiliation" + color.t_sym2 + ": " + color.d_value);
bbs.replace_text(341,quesBox + color.t_txt + " Enter your handle or call-sign= \1w");
bbs.replace_text(342,quesBox + color.t_txt + " Enter your sex (M/F)= \1w");
bbs.replace_text(343,quesBox + color.t_txt + " Enter your street address= \1w");
bbs.replace_text(344,quesBox + color.t_txt + " Enter your voice phone number= \1w");
bbs.replace_text(347,quesBox + color.t_txt + " Enter your zip (or postal) code= \1w");
bbs.replace_text(362,color.t_txt + "Read your mail now");
bbs.replace_text(563,color.t_sym + "@GOTOXY:1,25@[" + color.t_txt + "pause" + color.t_sym2 + "/" + color.t_txt2 + "press any key" + color.t_sym + "]");

bbs.replace_text(497,quesBox + color.t_txt + "How many rows on your monitor [\1wAuto Detect\1y]= ");
//bbs.replace_text(563,color.t_sym + " [" + color.t_sym2 + "p" + color.t_txt2 + "ause" + color.t_sym + "/" + color.t_menu + "press any key" + color.t_sym + "]");

bbs.replace_text(570,"\r\n " + color.t_user + user.alias + color.t_sym + '@' + color.t_menu + "QWK" + color.t_sym + ": \1n");
bbs.replace_text(660,"@EXEC:DDFLIST@");
bbs.replace_text(661,"@EXEC:DDFL_HDR@");
bbs.replace_text(694," Node Status:\r\n --- ---------------------------------------------------\r\n\1n");
bbs.replace_text(811,quesBox + color.t_txt + " HIT your " + color.t_sym2 + "BACKSPACE" + color.t_txt +" or " + color.t_sym2 + "DELETE-LEFT" +color.t_txt + " key: "); 
bbs.replace_text(826,"\15\1n\1hLogging on to @BBS@ as @ALIAS@ @ELLIPSIS@\1n\r\n @RESETPAUSE@");
if (file_exists(langFile)) {
    load(langFile);
}