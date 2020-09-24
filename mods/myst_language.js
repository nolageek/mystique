load("sbbsdefs.js");
load("myst_colors.js");
load("myst_settings.js");
load("myst_functions.js");

bbs.revert_text();

var quesBox = color.dark + "[\1n" + color.bright + "?\1n" + color.dark + "]\1n";
var warnBox = color.dark + "[\1n" + color.bright + "!\1n" + color.dark + "]\1n";

bbs.replace_text(94,color.normal + "Search all groups for new messages\1n");
bbs.replace_text(95,color.normal + "Search all groups for un-read messages to you\1n");
bbs.replace_text(96,color.bright + "Are you sure\1n");
bbs.replace_text(119,"Log Off\1n");
bbs.replace_text(156,color.bright + "I'm sorry, did you forget something?\1n\r\n");
bbs.replace_text(369,color.bright + "Does your terminal support IBM extended ASCII\1n");
bbs.replace_text(338,"@CLS@@MENU:newuser@@GOTOXY:3,18@" + color.normal + "Enter your alias or full name\1n" + color.dark + ":\1n " + color.normal);
bbs.replace_text(370,"@GOTOXY:3,23@" + color.normal + "You can't use that name (duplicate or invalid).\1n");
bbs.replace_text(346,"@GOTOXY:3,19@" + color.normal + "Enter your location, afiliation, or public note\1n" + color.dark + ":\1n " + color.normal);
bbs.replace_text(345,"@GOTOXY:3,20@" + color.normal + "Enter your birthday (@DATEFMT@)\1n" + color.dark + ":\1n " + color.normal);
bbs.replace_text(500,"@GOTOXY:3,21@" + color.normal + "Network mail address" + color.bright + " (Example: user@domain)" + color.dark + ":\1n " + "\1n\r\n" + color.info + "  This may be used for password recovery\1n" + color.bright + "\r\n  ");
bbs.replace_text(499,color.bright + "Forward personal e-mail to network mail address\1n");
bbs.replace_text(350,color.bright + "Is the above information correct\1n");
bbs.replace_text(331,color.bright + " Enter a different password\1n");
bbs.replace_text(332,warnBox + color.normal + " New password (4-8 chars)\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(333,color.bright + " Verify (enter again)\1n" + color.dark + ":\1n " + color.on);
bbs.replace_text(334,warnBox + color.alert + " Wrong!\1n");
bbs.replace_text(335,warnBox + color.yes + " Password changed.\1n\r\n");
bbs.replace_text(367,""); //Do you have a color terminal
bbs.replace_text(366,""); //Does your terminal support ANSI
bbs.replace_text(369,""); //Does your terminal support IBM extended ASCII
bbs.replace_text(371,color.normal + "Your password is" + color.info + "%s\1n\r\n");
bbs.replace_text(372,warnBox + color.bright + "Write down your password and keep it confidential.\1n\r\n\r\n" + warnBox + color.bright + " Enter this password for verification\1n" + color.dark + ":\1n " + color.normal);
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
bbs.replace_text(563,color.dark + "[\1n" + mystText(color.normal + "pause\1n" + color.dark + "/\1n" + color.bright + "press any key") + "\1n" + color.dark + "]\1n");
bbs.replace_text(497,quesBox + color.normal + "How many rows on your monitor [\1wAuto Detect\1y]= ");
bbs.replace_text(497,quesBox + color.normal +"Select \1h%s\1n\1g:\1n\r\n\r\n" );
bbs.replace_text(570,"\r\n " + color.bright + user.normal + color.dark + '@\1n' + color.normal + "QWK\1n" + color.dark + ": \1n");
bbs.replace_text(660,"@EXEC:DDFLIST@");
bbs.replace_text(661,"@EXEC:DDFL_HDR@");
bbs.replace_text(811,quesBox + mystText(color.normal + " HIT your \1n" + color.dark + "BACKSPACE\1n" + color.normal +" or \1n" + color.dark + "DELETE-LEFT\1n" + color.normal + " key:") + "\1n "); 
bbs.replace_text(826,"\15\1n\1hLogging on to @BBS@ as @ALIAS@ @ELLIPSIS@\1n\r\n @RESETPAUSE@");


if(conf.fontcode !="437") {

	bbs.replace_text(381,"\1h\1wNum" + color.normal + " | " + color.normal + "Name                           ");
	bbs.replace_text(382,color.normal + "-------------------------------      ");
	bbs.replace_text(383,"\1h\1w%3u" + color.normal + " | " + color.normal + "%-25.25s\1h      ");
	bbs.replace_text(638,"\1h--- -------------------------    ----");
	bbs.replace_text(694," Node Status:\r\n --- --------------------------------------------------------------------------\r\n\1n");
}
