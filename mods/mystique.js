/*****************************************************************************
                       Mystique Synchronet 3 Command Shell
					   requires DDMsgReader, DDAreaLister
					   
----------------------------------------------------------------------------*/
load("sbbsdefs.js"); //load helper functions

// SET DEFAULT VALUES FOR ERRATHANG 

// set up default colors, if no theme settings.js file is found.
var color = {
	txt_menu	: '\1h\1b', // Menu name
	txt_user 	: '\1h\1c', // username in menus 
	txt_sym 	: '\1n\1b', // symbols color @, [ ], ( ),etc..
	txt_sym2 	: '\1h\1c', // symbol highlght (numbers in [1], menu options [A], etc..)
	txt_text 	: '\1h\1b', // color for most text
	txt_text2 	: '\1h\1m', // aux color for text, bold words, values, etc...
	txt_ques 	: '\1h\1y', // color for question prompts
	txt_alert 	: '\1h\1r', // color for alert text
	txt_success	: '\1h\1g', // color for success text
	txt_info 	: '\1h\1c', // color for info text 
	def_text 	: '\1h\1b', // defaults option text
	def_value 	: '\1h\1c', // defaults current value
	def_on 		: '\1n\1c', // defaults 'on' color
	def_off 	: '\1n\1c', // defaults 'off' color
	def_head 	: '\1h\1w'  // defaults header
}

// These are the user configurable options (from settings.js in theme directory)
var conf = {
	rumorFile 	: system.mods_dir + '\\rumor.txt',
	rumorHeader	: 'rumors',
	rumorFooter	: 'footer',
	amsgFile	: system.mods_dir + '\\automsg.txt',
	amsgGreetz	: '@RIGHT:30@\1h\1mg \1n\1mr e e t z \1hf \1n\1mr o m\1w: \1h\1c-\1n\1c',
	amsgPrefix	: '@RIGHT:10@\1h\1b',
	amsgHeader	: 'automsg-h',
	amsgFooter	: 'automsg-f',
	fontcode	: '437'
}


//  Non-configurable options
var myst = {
	param		: argv[0]
	}

// Setting up Activity Flags.
var activity = {
	posted		: '-',
	gfiles		: '-',
	fsysop		: '-',
	readmg		: '-',
	hungup		: 'H', // setting to H now, if user logs out using menu, will change to '-'
	isnewu		: '-',
	doors		: '-'
}

// get settings colors from settings.js in theme directory. overwrite defaults if found.

var settingsFile = system.text_dir + 'menu\\' + user.command_shell + '\\settings.js';
if (file_exists(settingsFile)) {
	load(settingsFile);
}


// Load fontcode.ans from selected menu set directory, reset the font to 437 or amiga style.
mystMenu(conf.fontcode); // reset font type


// test for menu in user.command_shell directory, if not found use mystique version.
function mystMenu(file) {
	var menu_file = system.text_dir + '\menu\\' + user.command_shell + '\\' + file;
	if (!file_exists(menu_file + '.ans') && !file_exists(menu_file + '.asc')) {
		bbs.menu('mystique\\' + file);
	} else {
		bbs.menu(user.command_shell + '\\' + file);
	}
}

// if calling rumor or automsg mods, rum them and skedaddle. 
if (myst.param == 'addrumor') {
	addRumor();
	exit();
} else if (myst.param == 'automsg') {
	autoMsg();
	exit();
}


// Get current shell code, to check later in case of settings change.
var thisShell = user.command_shell;

js.on_exit('lastCaller()'); // generate last caller entry if disconnected


// activity will be posted to last caller list by default
var stealth = 'disabled';


console.putmsg(color.txt_info + 'Loading ' + system.name + ' Command Shell..' + color.txt_success + thisShell.toUpperCase() + ' Loaded!\r\n\r\n');
sleep(200);



// if user is sysop, allow them to enable stealth mode.
if (user.is_sysop) {
	if (console.yesno(color.txt_ques + 'Login in stealth mode')) {
		stealth = 'enabled';
		sleep(500);
	}
	console.putmsg(color.txt_success + 'Stealth mode ' + color.txt_alert + stealth.toUpperCase() + '\1n');
}


bbs.timeout_warn = 180; //180 second default timeout warning
bbs.timeout_hangup = 300; //300 second default timeout hangup


/*****************************************************************
                                                    MENU FUNCTIONS
*****************************************************************/

function doorsMenu() {
	while (bbs.online) {
		//bbs.node_action = // 'NODE_XTRN';  I dont think this is needed
		activity.doors = 'D';
		bbs.exec('*xtrn_sec_vanguard.js'); // XTERNALS
		return;
		//	bbs.xtrn_sec();
	}
}

// NO FILE MENU.
function filemenu() {
	console.crlf();
	console.putmsg(color.txt_alert + 'Womp womp. Transfer section is not available. \1c\1hTry \1b\1hG\1r\1ho\1y\1ho\1b\1hg\1g\1hl\1r\1he\1c?\1n');
	console.pause();
	return;
}

function mainMenu() {
	while (bbs.online) {
		//check to see if the user has changed command shell.
		if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) {
			return;
		}
		bbs.node_action = NODE_MAIN;
		bbs.nodesync();
		console.clear();
		mystMenu(conf.fontcode); // reset font type
		mystMenu('main');
		console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'Main Menu' + color.txt_sym + ':\1n');

		//options and commands to perform
		var key = console.getkey(K_NOECHO).toUpperCase();
		bbs.log_key(key);
		switch (key) {
			// MAIN OPTIONS
			case 'M':
				msgMenu();
				break;
			case 'E':
				emailMenu();
				break;
			case 'C':
				chatMenu();
				break;
			case 'T':
				gfiles = 'G';
				bbs.exec_xtrn('TEXTFILE');
				break;
			case 'S':
			case 'I':
				systemMenu();
				break;
			case 'X':
				doorsMenu();
				break;
				// OTHER OPTIONS
			case '1':
				bbs.exec('*oneliner');
				break;
			case 'Q':
				bbs.qwk_sec();
				break;
			case 'A':
				autoMsg();
				break;
			case 'R':
				addRumor();
				break;
				// SOME POPULAR 'HIDDEN' ITEMS (NOT ON MENU)	
			case 'P':
			case 'D':
				defaults();
				break;
			case 'F':
				filemenu();
				break;
			case 'W':
				mystMenu('nodeltop');
				break;
			case 'L':
				console.crlf();
				console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '?' + color.txt_sym + '] ' + color.txt_ques + 'How many callers would you like to list? ' + color.txt_text2 + '100 Max.' + color.txt_sym + '[' + color.txt_sym2 + '10' + color.txt_sym + ']');
				console.crlf();
				console.putmsg(color.txt_sym + '    :');
				var num = console.getnum(100, 10);
				showLastCallers(num);
				break;
			case '/': // SLASH MENU
				console.putmsg('/');
				slashMenu(console.getkeys('?DXO').toUpperCase());
				break;
			case ';': // SYSOP MENU
			case '.':
				console.crlf();
				if (user.compare_ars('SYSOP')) {
					console.print(color.txt_alert + 'Sysop Command: \1n\1w');
					bbs.exec('*str_cmds ' + console.getstr(40));
					break;
				}
				break;
			case ':': // GLOBAL COLON MENU
				console.putmsg(':');
				colonMenu(console.getstr('', 4).toUpperCase());
				break;
			case 'O': // LOGOFF
				logOff();
				break;
			default: // FALL BACK
				break;
		} // end switch
	} // while online
} // end main

function msgMenu() {
	while (bbs.online) {
		bbs.node_action = NODE_RMSG;
		bbs.nodesync();
		console.clear();
		mystMenu(conf.fontcode);
		mystMenu('message');
		console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '@GN@' + color.txt_sym + '] ' + color.txt_user + '@GRP@' + color.txt_sym + ' [' + color.txt_sym2 + '@SN@' + color.txt_sym + '] ' + color.txt_menu + '@SUB@\1n');
		console.crlf();
		console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'Message Menu' + color.txt_sym + ':\1n');

		var key = console.getkey(K_NOECHO).toUpperCase();
		bbs.log_key(key);
		switch (key) {
			// NAVIGATE GROUPS/SUBS
			case '}':
			case KEY_UP:
				bbs.lastgrp = bbs.curgrp;
				bbs.curgrp++;
				if (bbs.lastgrp == bbs.curgrp) bbs.curgrp = 0;
				break;
			case '{':
			case KEY_DOWN:
				bbs.lastgrp = bbs.curgrp;
				bbs.curgrp--;
				if (bbs.lastgrp == bbs.curgrp) bbs.curgrp = msg_area.grp_list.length - 1;
				break;
			case ']':
			case KEY_RIGHT:
				bbs.lastsub = bbs.cursub;
				bbs.cursub++;
				if (bbs.lastsub == bbs.cursub) bbs.cursub = 0;
				break;
			case '[':
			case KEY_LEFT:
				bbs.lastsub = bbs.cursub;
				bbs.cursub--;
				if (bbs.lastsub == bbs.cursub) bbs.cursub = msg_area.grp_list[bbs.curgrp].sub_list.length - 1;
				break;
				// SELECT GROUPS/SUBS
			case 'G':
			case 'J':
				bbs.exec('?DDMsgAreaChooser.js');
				break;
				// READ NEW MESSAGES IN CURRENT GROUP
			case 'L':
				if (file_exists('../xtrn/DDMsgReader/DDMsgReader.js')) {
					bbs.exec('?../xtrn/DDMsgReader/DDMsgReader.js -startMode=list');
				} else {
					bbs.list_msgs();
				}
				break;
			case 'R':
			case '\r':
				// will use DDMesgReader if installed as Loadable module
				bbs.scan_posts();
				break;
				// POST NEW MESSAGE IN CURRENT GROUP
			case 'P':
				bbs.post_msg(msg_area.grp_list[bbs.curgrp].sub_list[bbs.cursub].code);
				break;
				// SCAN FOR NEW MESSAGES
			case 'N':
				// will use DDMesgReader if installed as Loadable module
				console.print("\r\nchNew Message Scan\r\n");
				bbs.scan_subs(SCAN_NEW);
				break;
				// SCAN FOR UNREAD MESSAGE TO USER
			case 'S':
				// will use DDMesgReader if installed as Loadable module
				console.print("\r\nchScan for Messages Posted to You\r\n");
				bbs.scan_subs(SCAN_TOYOU);
				break;
				// CONF NEW MSG SCAN
			case 'C':
			if (file_exists(system.mods_dir + '\\DM_NewScanConfig.js')) {
					bbs.exec('?DM_NewScanConfig.js');
				} else {
					bbs.cfg_msg_scan();
				}
				break;
				// FIND TEXT IN POSTS
			case 'F':
				bbs.scan_subs(SCAN_FIND);
				break;
				// SLASH AND COLON MENUS
			case '/': // FOR /F /N /R /J
				console.putmsg('/');
				slashMenu(console.getkeys('?DXOFNR').toUpperCase());
				break;
			case ':':
				console.putmsg(':');
				colonMenu(console.getstr('', 4).toUpperCase());
				break;
				// QUIT
			case 'Q':
				mainMenu();
				return;
				// LOG OUT
			case 'O':
				logOff();
				break;
				// FALL THROUGH
			default:
				break;
		} // end switch
	} // while online
	return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} // end message

function systemMenu() {
	while (bbs.online) {
		if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) {
			return;
		}
		bbs.node_action = NODE_DFLT;
		bbs.nodesync();
		console.clear();
		mystMenu(conf.fontcode);
		mystMenu('system');
		console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'System Menu' + color.txt_sym + ':\1n');

		var key = console.getkey(K_NOECHO).toUpperCase();
		bbs.log_key(key);
		switch (key) {
			//options and commands to perform
			case 'S':
				console.clear();
				bbs.sys_info();
				break;
			case 'U':
				//console.clear();
				//console.line_counter = 1;
				mystMenu('userlist');
				//bbs.menu(user.command_shell + '\\header');
				bbs.list_users();
				console.line_counter = 1;
				break;
			case 'W':
				mystMenu('nodeltop');
				break;
			case 'L':
				console.crlf();
				console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '?' + color.txt_sym + '] ' + color.txt_ques + 'How many callers would you like to list? ' + color.txt_text2 + '100 Max.' + color.txt_sym + '[' + color.txt_sym2 + '10' + color.txt_sym + ']');
				console.crlf();
				console.putmsg(color.txt_sym + '    :');
				var num = console.getnum(100, 10);
				showLastCallers(num);
				break;
			case 'D':
				defaults();
				break;
				// for /D
			case '/':
				console.putmsg('/');
				slashMenu(console.getkeys('?DXO').toUpperCase());
				break;
			case ':':
				console.putmsg(':');
				colonMenu(console.getstr('', 4).toUpperCase());
				break;
			case 'Y':
				console.clear();
				randomANSI('menu\\' + user.command_shell, 'header');
				//bbs.menu(user.command_shell + '\\header');
				bbs.user_info();
				break;
			case 'I':
				console.clear();
				bbs.ver();
				break;
			case 'M':
				console.clear();
				bbs.sub_info();
				break;
			case 'Q':
				mainMenu();
				return;
			default:
				break;
		} // end switch
	} // while online
	return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} // end system

function chatMenu() {
	while (bbs.online) {
		if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) {
			return;
		}
		bbs.node_action = NODE_CHAT;
		bbs.nodesync()
		console.clear();
		mystMenu('chat');
		console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'Chat Menu' + color.txt_sym + ':\1n');
		var key = console.getkey(K_NOECHO).toUpperCase();
		bbs.log_key(key);
		switch (key) {
			case 'M':
				bbs.exec('*chat_sec');
				break;
			case 'F':
				console.crlf();
				bbs.exec('?finger');
				break;
			case 'I':
				console.crlf();
				bbs.exec('?sbbsimsg.js');
				break;
			case 'J':
				bbs.multinode_chat();
				break;
			case 'P':
				bbs.private_chat();
				break;
			case 'N':
				bbs.page_sysop();
				sleep(500);
				console.putmsg(color.txt_alert + '...');
				sleep(500);
				console.putmsg(color.txt_alert + ' ...');
				sleep(500);
				console.putmsg(color.txt_alert + ' ...');
				sleep(500);
				console.putmsg(color.txt_alert + ' ...');
				sleep(500);
				console.putmsg(color.txt_alert + ' ...');
				break;
			case 'A':
				bbs.exec_xtrn('C0ACHAT');
				break;
			case 'D':
				defaults(2);
				break;
			case 'R':
				if (user.compare_ars("GUEST")) {
					console.clear();
					alert("Can't access as guest.");
					console.pause();
					return;
				}
				console.crlf();
				console.crlf();
				console.print(color.txt_alert + 'You are about to be connected the public #bbs channel in irc.synchro.net\1n');
				console.crlf();
				console.print(color.txt_text + 'Commands to remember' + color.txt_text2 + ':\1n');
				console.crlf();
				console.print(color.txt_info + '    /list          ' + color.txt_text2 + 'List Channels/Rooms');
				console.crlf();
				console.print(color.txt_info + '    /join #channel ' + color.txt_text2 + 'Channel/Room');
				console.crlf();
				console.print(color.txt_info + '    /part #channel ' + color.txt_text2 + 'Leave a Channel/Room');
				console.crlf();
				console.print(color.txt_info + '    /quit          ' + color.txt_text2 + 'Quit IRC\1n');
				console.crlf();
				console.crlf();
				console.print(color.txt_text + 'If you continue, say hello, and hang around for a few minutes.');
				console.crlf();
				if (console.yesno(color.txt_ques + 'Enter IRC Chat')) {
					bbs.node_action = NODE_MCHT;
					var irc_server = "irc.synchro.net 6667";
					var irc_channel = "#bbs";
					bbs.exec("?irc -a " + irc_server + " " + irc_channel);
				}
				console.line_counter = 0;
				console.clear();
				break;

				//bbs.menu.chat();

			case 'Q':
				return;
			case '\r':
				return;

		} // end switch
	} // while online
	return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} // end chat

function emailMenu() {
	while (bbs.online) {
		if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) {
			return;
		}
		bbs.node_action = NODE_RMAL;
		bbs.nodesync();
		console.clear();
		mystMenu('email');
		console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'Email Menu' + color.txt_sym + ':\1n');
		//options and commands to perform
		var key = console.getkey(K_NOECHO).toUpperCase();
		bbs.log_key(key);
		switch (key) {
			case 'R':
				bbs.exec('?../xtrn/DDMsgReader/DDMsgReader.js -personalEmail -startMode=list');
				break;
			case 'S':
				bbs.node_action = NODE_SMAL;
				bbs.nodesync();
				console.print("_\r\nbhE-mail (User name or number): w");
				str = console.getstr("", 40, K_UPRLWR, false);
				if (str == null || str == "")
					break;
				if (str == "Sysop")
					str = "1";
				if (str.search(/\@/) != -1)
					bbs.netmail(str);
				else {
					i = bbs.finduser(str);
					if (i > 0)
						bbs.email(i, WM_EMAIL);
				}
				break;
			case 'O':
				bbs.node_action = NODE_RSML;
				bbs.nodesync();
				bbs.exec('?../xtrn/DDMsgReader/DDMsgReader.js -personalEmailSent -startMode=list');
				break;
			case 'F':
				console.clear();
				console.ungetstr('Feedback');
				bbs.email(1, null, null, '');
				break;
			case ':':
				console.putmsg(':');
				colonMenu(console.getkeysr('', 4).toUpperCase());
				break;
			case 'Q':
				mainMenu();
				break;
			case 'O':
				logoffMenu();
				break;
			default:
				break;
		} // end switch
	} //end while
	return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} //end mail



function defaults(page) {
	if (user.compare_ars('GUEST')) {
		alert('Guest access restricted.');
		console.pause();
		return;
	}
	if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) {
		return;
	}
	
	var defPage = '1';
	if (page) {
	defPage = page;
	}
	
while (bbs.online) {
	
	if (defPage == '1') {
				console.clear();
			mystMenu(conf.fontcode);
			console.putmsg(color.txt_text + 'Settings for \1h\1w' + user.alias + ' #' + user.number + color.txt_text + ', Page ' + color.txt_text2 + '1');
			console.crlf();
			console.putmsg(lpad(color.def_head + 'USER ACCOUNT SETTINGS\1n',64));
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'A' + color.txt_sym + '] ' + color.txt_text + 'Terminal Mode' + color.txt_text2 + '                  : \1n');
			console.putmsg((user.settings & USER_AUTOTERM) ? color.def_on + 'Auto Detect \1n' : '');
			console.putmsg((user.settings & USER_ANSI) ? color.def_on + 'ANSI \1n ' : color.def_off + 'TTY\1n ');
			console.putmsg((user.settings & USER_COLOR) ? color.def_on + '(Color) \1n' : color.def_off + '(Mono) \1n');
			console.putmsg((user.settings & USER_NO_EXASCII) ? color.def_off + 'ASCII Only \1n' : ' \1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'B' + color.txt_sym + '] ' + color.txt_text + 'External Editor' + color.txt_text2 + '                : \1n');
			console.putmsg(color.def_on + xtrn_area.editor[user.editor].name);
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'C' + color.txt_sym + '] ' + color.txt_text + 'Screen Length' + color.txt_text2 + '                  : \1n');
			var screenrows;
			if (user.screen_rows) {
				screenrows = user.screen_rows;
			} else {
				screenrows = color.def_value + 'Auto Detect ' + color.txt_sym + '(' + color.txt_sym2 + console.screen_rows + color.txt_sym + ')';
			}
			console.putmsg(color.def_on + screenrows);
			console.crlf();

			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'D' + color.txt_sym + '] ' + color.txt_text + 'Current Command Shell' + color.txt_text2 + '          : \1n');
			console.putmsg(color.def_on + user.command_shell.toUpperCase());
			console.crlf();

			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'E' + color.txt_sym + '] ' + color.txt_text + 'Expert Mode' + color.txt_text2 + '                    : \1n');
			console.putmsg((user.settings & USER_EXPERT) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'F' + color.txt_sym + '] ' + color.txt_text + 'Screen Pause' + color.txt_text2 + '                   : \1n');
			console.putmsg((user.settings & USER_PAUSE) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'G' + color.txt_sym + '] ' + color.txt_text + 'Hot Keys' + color.txt_text2 + '                       : \1n');
			console.putmsg((user.settings & USER_COLDKEYS) ? color.def_off + 'OFF\1n' : color.def_on + 'ON\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'H' + color.txt_sym + '] ' + color.txt_text + 'Spinning Cursor' + color.txt_text2 + '                : \1n');
			console.putmsg((user.settings & USER_SPIN) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'I' + color.txt_sym + '] ' + color.txt_text + 'Default to Quiet Mode' + color.txt_text2 + '          : \1n');
			console.putmsg((user.settings & USER_QUIET) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.crlf();
			console.putmsg(lpad(color.def_head + 'USER PROFILE SETTINGS\1n',64));
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'J' + color.txt_sym + '] ' + color.txt_text + 'Update Location/Affiliations' + color.txt_text2 + '   : \1n');
			console.putmsg(color.def_value + user.location + '\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'K' + color.txt_sym + '] ' + color.txt_text + 'Change Password\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'L' + color.txt_sym + '] ' + color.txt_text + 'Change Internet E-mail' + color.txt_text2 + '         : \1n');
			console.putmsg(color.def_on + user.netmail + '\1n');
			console.crlf();
			console.putmsg(color.def_off + ' -  ' + color.txt_text + 'Local Email ' + color.def_off + '(READ ONLY)' + color.txt_text2 + '        : ');
			console.putmsg(color.def_off + user.email + '\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'M' + color.txt_sym + '] ' + color.txt_text + 'Update Signature');
			console.crlf();
			console.putmsg(color.def_off + ' -  ' + color.txt_text + 'Birthdate ' + color.def_off + '(READ ONLY)' + color.txt_text2 + '          : ');
			console.putmsg(color.def_off + user.birthdate + '\1n');
			console.putmsg(color.txt_sym + ' (' + color.txt_sym2 + user.age + color.txt_sym + ') \1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'N' + color.txt_sym + '] ' + color.txt_text + 'Change Gender' + color.txt_text2 + '                  : \1n');
			console.putmsg(color.def_on + user.gender + '\1n');

			//	bbs.menu(user.command_shell + '/settings1');
			console.gotoxy(1, 22);
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'Q' + color.txt_sym + '] ' + color.txt_text + 'uit. ' + color.txt_sym + '[' + color.txt_sym2 + 'ARROWS' + color.txt_sym + '] ' + color.txt_text + 'To Switch Pages.');
			console.crlf();
			console.crlf();
			console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'Defaults Menu 1' + color.txt_sym + ': \1n');
			var key = console.getkey(K_NOECHO).toUpperCase();
			bbs.log_key(key);
			switch (key) {
				// USER OPTIONS
			case 'J':
				var lastlocation = user.location;
				console.crlf();
				console.crlf();
				console.putmsg(color.def_value + 'Currently: ' + color.txt_text2 + lastlocation);
				console.crlf();
				console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '?' + color.txt_sym + '] ' + color.txt_ques + 'Enter your location / group affiliations\1w: ');
				var str;
				var location = console.getstr('',20);
				if (!location || !location.length)
					location = lastlocation;
				bbs.log_str(' ' + location);
				user.location = location;
				break;
			case 'A':
				//TERMINAL MODE SELECT
				console.crlf();
				if (console.yesno(color.txt_ques + 'Use automatic terminal type detection')) {
					user.settings |= USER_AUTOTERM;
				} else {
					user.settings &= ~USER_AUTOTERM;
					if (console.yesno(color.txt_ques + 'Does your terminal support ANSI')) {
						user.settings |= USER_ANSI;
					} else {
						user.settings &= ~USER_ANSI;
					}
				}

				if (console.yesno(color.txt_ques + 'Do you have a color terminal')) {
					user.settings |= USER_COLOR;
				} else {
					user.settings &= ~USER_COLOR;
				}

				if (console.yesno(color.txt_ques + 'Does your terminal support IBM extended ASCII')) {
					user.settings &= ~USER_NO_EXASCII;
				} else {
					user.settings |= USER_NO_EXASCII;
				}

				break;
			case 'B':
				// EXTERNAL EDITOR SELECT
				bbs.select_editor();
				break;
			case 'C':
				// SCREEN LENGTH SELECT 
				console.crlf();
				if (console.yesno(color.txt_ques + 'Auto Detect screen row length')) {
					user.screen_rows = '';
				} else {
					console.putmsg(color.txt_ques + 'How many rows does your terminal support?');
					var rows = console.getstr('', 2);
					if (rows) {
						user.screen_rows = rows;
					}
				}
				break;
			case 'D':
				// COMMAND SHELL SELECT
				bbs.select_shell()
				return;
			case 'A':
				// QWK ARCHIVE TYPE
				break;
				// CHAT OPTIONS
			case 'E':
				user.settings ^= USER_EXPERT;
				break;
			case 'F':
				user.settings ^= USER_PAUSE;
				break;
			case 'G':
				user.settings ^= USER_COLDKEYS;
				break;
			case 'H':
				user.settings ^= USER_SPIN;
				break;
			case 'K':
				console.crlf();
				console.crlf();
				alert(color.def_value + 'Current password: ' + color.txt_text2 + user.security.password.toUpperCase());
				console.crlf();
				if (!console.noyes(color.txt_ques + 'Would you like to change your password')) {
					console.putmsg('\1h\1cPlease enter your new password:');
					var pw = console.getstr('', 8, K_UPPER);
					if (pw) {
						user.security.password = pw;
						break;
					} else {
						break;
					}
				}
				break;
			case 'I':
				user.settings ^= USER_QUIET;
				break;
			case 'L':
				var lastnetmail = user.netmail;
				console.crlf();
				console.crlf();
				console.putmsg(color.def_value + 'Currently: ' + color.txt_text2 + lastnetmail);
				console.crlf();
				console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '?' + color.txt_sym + '] ' + color.txt_ques + 'Enter Your Internet E-mail Address\1w: ');
				var netmail = console.getstr();
				if (!netmail || !netmail.length)
					var netmail = lastnetmail;

				bbs.log_str("  " + netmail);
				user.netmail = netmail;
				break;
			case 'M':
				console.crlf();
				console.editfile(format('%suser/%04d.sig', system.data_dir, user.number));
				break;
			case 'N':
				var lastgender = user.gender;
				console.crlf();
				console.crlf();
				console.putmsg(color.def_value + 'Currently: ' + color.txt_text2  + lastgender);
				console.crlf();
				console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '?' + color.txt_sym + '] ' + color.txt_ques + 'Enter Your Gender\1w: ');
				var gender = console.getstr('', 1, K_UPPER);
				if (!gender || !gender.length)
					var gender = lastgender;

				bbs.log_str("  " + netmail);
				user.gender = gender;
				break;
			case KEY_LEFT:
			case KEY_RIGHT:
			case '2':
				defPage = '2';
				break;
			case 'Q':
				return;

			case '\r':
				break;
			default:
				break;
			} // end switch
		
	} else {
	
			console.clear();
			console.putmsg(color.txt_text + 'Settings (b) for \1h\1w' + user.alias + ' #' + user.number + color.txt_text + ', Page ' + color.txt_text2 + '2');
			console.crlf();
			console.putmsg(lpad(color.def_head + 'CHAT SETTINGS\1n',56));
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'A' + color.txt_sym + '] ' + color.txt_text + 'Allow Paging' + color.txt_text2 + '                   : \1n');
			console.putmsg((user.chat_settings & CHAT_NOPAGE) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'B' + color.txt_sym + '] ' + color.txt_text + 'Activity Alerts' + color.txt_text2 + '                : \1n');
			console.putmsg((user.chat_settings & CHAT_NOACT) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'C' + color.txt_sym + '] ' + color.txt_text + 'Private Split-Screen Chat' + color.txt_text2 + '      : \1n');
			console.putmsg((user.chat_settings & CHAT_SPLITP) ? '\1n\1cSPLIT SCREEN\001n' : '\1n\1cTRADITIONAL\001n');
			console.crlf();
			console.putmsg(lpad(color.def_head + 'MESSAGE SCAN SETTINGS\1n',64));
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'D' + color.txt_sym + '] ' + color.txt_text + 'Ask For "New Scan" At Login' + color.txt_text2 + '    : \1n');
			console.putmsg((user.settings & USER_ASK_NSCAN) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'E' + color.txt_sym + '] ' + color.txt_text + 'Ask For Your Un-read Msg Scan' + color.txt_text2 + '  : \1n');
			console.putmsg((user.settings & USER_ASK_SSCAN) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'F' + color.txt_sym + '] ' + color.txt_text + 'New Scan Configuration\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'G' + color.txt_sym + '] ' + color.txt_text + 'Your "to-you" Message Scan Config\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'H' + color.txt_sym + '] ' + color.txt_text + 'Re-init New Scan Pointers\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'I' + color.txt_sym + '] ' + color.txt_text + 'Set New Scan Pointers\1n');
			console.crlf();
			console.putmsg(lpad(color.def_head + 'MESSAGE READ SETTINGS\1n',64));
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'J' + color.txt_sym + '] ' + color.txt_text + 'Remember Current Sub-Board' + color.txt_text2 + '     : \1n');
			console.putmsg((user.settings & USER_CURSUB) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'K' + color.txt_sym + '] ' + color.txt_text + 'Clear Screen Between Messages' + color.txt_text2 + '  : \1n');
			console.putmsg((user.settings & USER_CLRSCRN) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'L' + color.txt_sym + '] ' + color.txt_text + 'Forward Email to Netmail' + color.txt_text2 + '       : \1n');
			console.putmsg((user.settings & USER_NETMAIL) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();

			console.putmsg(lpad(color.def_head + 'FILE SCAN OPTIONS\1n',60));
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'M' + color.txt_sym + '] ' + color.txt_text + 'Default Download Protocol' + color.txt_text2 + '      : \1n');
			console.putmsg('\1n\1c' + user.download_protocol + '-Modem');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'N' + color.txt_sym + '] ' + color.txt_text + 'Auto New File Scan At Login' + color.txt_text2 + '    : \1n');
			console.putmsg((user.settings & USER_ANFSCAN) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'O' + color.txt_sym + '] ' + color.txt_text + 'Batch Download File tagging' + color.txt_text2 + '    : \1n');
			console.putmsg((user.settings & USER_BATCHFLAG) ? color.def_on + 'ON\1n' : color.def_off + 'OFF\1n');

			console.gotoxy(1, 22);
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + 'Q' + color.txt_sym + '] ' + color.txt_text + 'uit. ' + color.txt_sym + '[' + color.txt_sym2 + 'ARROWS' + color.txt_sym + '] ' + color.txt_text + 'To Switch Pages.');
			console.crlf();
			console.crlf();
			console.putmsg(color.txt_user + user.alias + color.txt_sym + '@' + color.txt_menu + 'Defaults Menu 2' + color.txt_sym + ':\1n');
			var key = console.getkey(K_NOECHO).toUpperCase();
			bbs.log_key(key);
			switch (key) {
				// MSG SCAN OPTIONS
			case 'G':
				bbs.exec('?DM_NewScanConfig.js');
				break;
			case 'H':
				bbs.reinit_msg_ptrs();
				break;
			case 'K':
				user.settings ^= USER_CLRSCRN;
				break;
			case 'D':
				user.settings ^= USER_ASK_NSCAN;
				break;
			case 'E':
				user.settings ^= USER_ASK_SSCAN;
				break;
			case 'J':
				user.settings ^= USER_CURSUB;
				break;
			case 'I':
				bbs.cfg_msg_ptrs();
				break;
				// CHAT OPTIONS
			case 'C':
				user.chat_settings ^= CHAT_SPLITP;
				break;
			case 'B':
				user.chat_settings ^= CHAT_NOACT;
				break;
			case 'A':
				user.chat_settings ^= CHAT_NOPAGE;
				break;
			case 'N':
				user.settings ^= USER_ANFSCAN;
				break;
			case 'O':
				user.settings ^= USER_BATCHFLAG;
				break;
			case 'L':
				user.settings ^= USER_NETMAIL;
				break;
			case KEY_RIGHT:
			case KEY_LEFT:
			case '1':
				defPage = '1';
				break;
			case 'Q':
				return;
			case '\r':
				break;
			default:
				break;
			} // end switch
	}		
	}
	return;
}



/*****************************************************************
                                         SLASH AND COLON FUNCTIONS
*****************************************************************/

function slashMenu(option) {
	switch (option) {
	case '?':
		console.clear();
		mystMenu('obscure');
		break;
	case 'O':
		logOffFast();
		break;
		// SYSTEM MENU
	case 'D':
		// old defaults
		defaults();
		break;
		// MSG MENU
	case 'F':
		bbs.scan_subs(SCAN_FIND);
		break;
	case 'N':
		bbs.scan_subs(SCAN_NEW, all = true);
		break;
	case 'R':
		bbs.scan_posts(msg_area.grp_list[bbs.curgrp].sub_list[bbs.cursub].code, 0);
		break;
	case 'J':
		bbs.exec('?../xtrn/DDMsgReader/DDMsgReader.js -chooseAreaFirst');
		break;
	case 'X':
		user.settings ^= USER_EXPERT;
		break;
	case '\r':
		return;
	default:
		alert('NOT VALID');
		console.pause();
		break;
	}
}

// GLOBAL MENU, ACCESSED VIA THE COLON. GROSS.
function colonMenu(option) {
		switch (option) {
		case '?':
		case 'HELP':
			console.clear();
			mystMenu('obscure');
			break;
		case 'BULL':
			bbs.exec_xtrn('BULLSHIT');
			break;
		case 'CHAT':
			chatMenu();
			break;
		case 'CONF':
			defaults();
			return;
		case 'CFG2':
			defaults(2);
			return;
		case 'CFG':
			defaults();
			return;
		case 'EMAI':
		case 'MAIL':
			emailMenu();
			break;
		case 'EXPE':
			user.settings ^= USER_EXPERT;
			break;
		case 'GAME':
			doorsMenu();
			break;
		case 'GFIL':
			bbs.exec_xtrn('TEXTFILE');
			break;
		case 'JEOP':
			bbs.exec_xtrn("JEOPARDI");
			break;
		case 'MAIN':
			mainMenu();
			break;
		case 'MSG':
			msgMenu();
			break;
		case 'ONE':
			bbs.exec('*oneliner');
			break;
		case 'ONEL':
			bbs.exec('*oneliner');
			break;
		case 'ONEN':
			bbs.exec_xtrn('ONELIN3R');
			break;
		case 'LAST':
			console.crlf();
			console.putmsg(color.txt_sym + '[' + color.txt_sym2 + '?' + color.txt_sym + '] ' + color.txt_ques + 'How many callers would you like to list? ' + color.txt_text2 + '100 Max.' + color.txt_sym + '[' + color.txt_sym2 + '10' + color.txt_sym + ']');
			console.crlf();
			console.putmsg(color.txt_sym + '    :');
			var num = console.getnum(100, 10);
			showLastCallers(num);
			break;
			//case '16C':
			//case 'SIXT':
			//case '16CO':
			//	bbs.exec_xtrn('16COLORS'); break;
		case 'WHO':
			mystMenu('nodeltop');
			break;
		case 'QUIT':
			logoffMenu('fast');
			break;
		case 'QWK':
			bbs.exec('*qwk_sec');
			break;
		case 'RUMR':
		case 'RUM':
			bbs.exec('?mystique.js addrumor');
			break;
		case 'SCOR':
			bbs.exec_xtrn('BULLSEYE');
			break;
		case 'SYS':
			systemMenu();
			break;
		case 'TEXT':
		case 'XTRN':
			doorsMenu();
			break;
		case 'WMAT':
			bbs.exec_xtrn('WMATA');
			break;
		} // end switch
	} // end colonMenu



/*****************************************************************
                                          LAST 10 CALLER FUNCTIONS
*****************************************************************/

function lastCaller() {
	if (user.total_logons < '3') {
		activity.isnewu = '\1h\1gN\1n\1y';
	}
	if (bbs.logon_posts != '0') {
		activity.posted = 'P';
	}
	if (bbs.posts_read != '0') {
		activity.readmg = 'R';
	}
	if (bbs.logon_fbacks != '0') {
		activity.fsysop = 'F';
	}

	// MAYBE HAVE FOUND A BETTER WAY TO DO ALL THIS.... f
	var actions = activity.isnewu + activity.doors + activity.readmg + activity.posted + activity.gfiles + activity.fsysop + activity.hungup;
	var nodenum = rpad(bbs.node_num.toString(),3);
	var username = rpad(user.alias,14);
	var location = rpad(user.location,20);
	var dateon = strftime("%m/%d/%y %I:%M%p", client.connect_time);
	var timeon = rpad(user.stats.timeon_last_logon.toString(),4);
	var speed = rpad(client.protocol,6);
	bbs.log_str('Adding to lastcaller list.');
	var newline = " \1h\1c" + nodenum + " \1h\1b" + username + " \1k" + location + " \1w" + dateon + " \1m" + timeon + " \1n\1y" + actions + "  \1h" + speed + " ";
	


	if (stealth == 'disabled') {
		saveLastCaller(newline);
	}
}

function saveLastCaller(newline) {
	var lastcallers = system.mods_dir + '\\cslast10.asc';
	f = new File(lastcallers);
	if (!f.open("a")) {
		alert("Error opening file: " + lastcallers);
		return;
	}

	f.writeln(newline);
	f.close();
}

function showLastCallers(int) {
	var lastcallers = system.mods_dir + '\\cslast10.asc';
	//f = new File(lastcallers);
	mystMenu('last10h');
	console.printtail(lastcallers, int);
	mystMenu('footer');
}

/*****************************************************************
                                                 LOG OFF FUNCTIONS
*****************************************************************/

function logOff() {
	mystMenu('goodbye');
	bbs.exec('*D1LINER');
	bbs.logoff(); // interactive logoff procedure
	if (!bbs.online) {
		activity.hungup = '-';
		//lastCaller();
		//exit();
	}
}

function logOffFast() {
	bbs.logoff(false); // non-interactive logoff procedure
	if (!bbs.online) {
		activity.hungup = '-';
		//lastCaller();
		//exit();
	}
}

//pads left
function lpad(str, length, padString) {
	if (!padString)
			var padString = ' ';
    while (str.length < length)
        str = padString + str;
    return str;
}

 
//pads right
function rpad(str, length, padString) {
	if (!padString)
			var padString = ' ';
    while (str.length < length)
        var str = str + padString;
    return str;
}

function randomANSI(folder,filenamePrefix){
  this.ansiDirectory = folder;
  this.filePrefix = filenamePrefix;
var random_list = directory(system.text_dir + this.ansiDirectory + "/" + this.filePrefix + "*.*")  //returns an array of filenames from a directory that start with the file_name "random" followed by a number from the text directory, in a sub-folder "called coolansi"
if(random_list.length){  //if there are files in the directory
console.printfile("../text/" + this.ansiDirectory + "/" + file_getname(random_list[random(random_list.length)]).slice(0,-4) + ".ans");  // prints a file from the directory "..text/coolansi/" and basically creates a filename to grab by generating a random number and putting it in between the strings "random" and ".ans" in this case.
			//console.pause();
}
}

function viewUser(user) {
	
}


function addRumor() {
	console.clear();
	mystMenu(conf.rumorHeader);
	console.printtail(conf.rumorFile,10);
	mystMenu(conf.rumorFooter);
	console.gotoxy(1,22);

	//console.putmsg('\1h\1b<--------------------------------------------------------------\1k[\1mng \1b2016\1k]\1b------>\1n\1w');
	
	console.gotoxy(1,23);
	console.putmsg('\1h\1b Enter new rumor [\1wRET\1b] quits:\1n');
	console.gotoxy(1,24);
	console.putmsg(':');
	var rumor = console.getstr("", 77);
	if (rumor == null || rumor == "" || rumor =="q" || rumor =="quit") return;
	else customizeRumor(rumor);
}

function customizeRumor(rumor) {
	
	var fgarray = {1:"\1w",2:"\1y",3:"\1r",4:"\1h\1b",5:"\1g",6:"\1m",7:"\1h\1y",8:"\1h\1m"};
	var bgarray = {10:"\0010",11:"\0016",12:"\0012",13:"\0015",14:"\0014",15:"\0013",16:"\0011"};
	


	var rumor = (rpad(rumor,78));
	console.gotoxy(1,23);
	
	console.putmsg('\1h\1m Pimp Your Rumor: \1wUP\1b/\1wDOWN\1b: \1mFG  \1wLEFT\1b/\1wRIGHT\1b: \1mBG  \1b[\1wRET\1b] \1mAccept   \1w[\1wQ\1b] \1mQuit\1n');
	console.gotoxy(1,24);
	console.putmsg('\10\1n\1w[' + rumor + '\10\1n\1w]')
	
	var fg = 1;
	var bg = 10;
	
	
	var accepted = false;
	
	while (!accepted) {

		switch(console.getkey(K_NOECHO).toUpperCase()) {
		case KEY_UP:
        case 'W':
			if (fg == 8) fg = 1;
			else fg = fg +1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
			break;
		case KEY_DOWN:
		case 'S': 
			if (fg == 1) fg = 8;
			else fg = fg -1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
            break;
		case KEY_LEFT:
        case 'A': 
			if (bg == 10) bg = 16;
			else bg = bg -1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
            break;
		case KEY_RIGHT:
        case 'D': 
			if (bg == 16) bg = 10;
			else bg = bg +1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
            break;
		case 'Q':
			accepted = true;
			console.crlf();
			console.pause();
			break;
		case "\r":
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
				f = new File(conf.rumorFile)
				if (!f.open("a")) {
				alert("Error opening file: " + conf.rumorFile);
				return;
				}
				f.writeln(styled);
				f.close();
			console.gotoxy(1,22);
			console.clearline();
			console.gotoxy(1,23);
			console.clearline();
			console.gotoxy(1,24);
			console.clearline();
			console.center('\1h\1rSaved. \1n\1w\r\n');
			console.pause();
			accepted = true;
			break;
		default:
			break;
		}
	}
}


function autoMsg() {
	console.clear();
	mystMenu(conf.amsgHeader);
	console.printtail(conf.amsgFile,6);
	console.crlf();
	mystMenu(conf.amsgFooter);
	console.crlf();
	console.crlf();
	if(!console.noyes('\1h\1bEnter new AutoMsg')) {

	console.putmsg('Line 1:');
	var amsg1 = console.getstr("", 50);
	if (amsg1 == null || amsg1 == "" || amsg1 =="q" || amsg1 =="quit") return;
	console.putmsg('Line 2:');
	var amsg2 = console.getstr("", 50);
	console.putmsg('Line 3:');
	var amsg3 = console.getstr("", 50);
	var uname = user.alias;
	
	console.putmsg('\1h\1bSave your Message? \1h\1w[\1mRET\1w] \1bor \1mY \1bto Save. \1w[\1mQ\1w] \1bto quit.\1n');
    var key = console.getkey(K_NOECHO).toUpperCase();
    bbs.log_key(key);
    switch (key) {
	case "Q":
		return;
	case 'Y':
	case "\r":
		f = new File(conf.amsgFile)
		if (!f.open("w")) {
			alert("Error opening file: " + conf.amsgFile);
			return;
		}
			//f.writeln(amsg);
			f.write('\r\n' + conf.amsgPrefix + amsg1);
			f.write('\r\n' + conf.amsgPrefix + amsg2);
			f.write('\r\n' + conf.amsgPrefix + amsg3);
			f.write('\r\n\r\n' + conf.amsgGreetz + uname);
			f.close();
			console.center('\1h\1rSaved. \1n\1w\r\n');
			console.pause();
			break;
		default:
			break;
		}
	}
	return;
}


console.line_counter = 0;
bbs.sys_status &= ~SS_ABORT; //clear ctrl-c/abort status

mainMenu();