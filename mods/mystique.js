/*****************************************************************************
                       Mystique Synchronet 3 Command Shell
                       requires DDMsgReader, DDAreaLister
                       
----------------------------------------------------------------------------*/
load("sbbsdefs.js"); // load helper functions
load("DDLightbarMenu.js");
load("json-client.js");
load("functions.js");
load("settings.js");

	var dbRoot = system.mods_dir;
	if(!file_exists(dbRoot + "mystique.ini")) {
		console.putmsg(color.txt_success + dbRoot + "mystique.ini: Server DB initialization file missing");
	} else { 
	var server_file = new File(dbRoot + "mystique.ini");
	server_file.open('r',true);
	var serverAddr=server_file.iniGetValue(null,"host","localhost");
	var serverPort=server_file.iniGetValue(null,"port",10088);
	server_file.close();
	}
	
// Load (fontcode).ans from selected menu set directory, reset the font to 437 or amiga.
mystMenu(conf.fontcode); // reset font type

// if calling last10, run it and exit. 
if (argv[0] == 'last10') {
    showLastCallers(10);
    exit();
}


// Get current shell code, to check later in case of settings change.
var thisShell = user.command_shell;

js.on_exit('lastCaller()'); // generate last caller entry if disconnected

// activity will be posted to last caller list by default
var stealth = 'disabled';


console.putmsg(color.t_info + 'Loading ' + system.name + ' Command Shell..' + color.t_yes + thisShell.toUpperCase() + ' Loaded!\r\n\r\n');
sleep(200);



// if user is sysop, allow them to enable stealth mode.
if (user.is_sysop) {
    if (console.yesno(color.t_ques + 'Log in using stealth mode')) {
        stealth = 'enabled';
        sleep(500);
    }
    console.putmsg(color.t_yes + 'Stealth mode ' + color.t_alert + stealth.toUpperCase() + '\1n');
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
                console.clear();
                mystMenu('doors');
                //var DOORlbMenu=new Lightbar();
                var DOORlbMenu = new DDLightbarMenu(51, 9, 28, 9);
                DOORlbMenu.colors.itemColor = "\1n\1w";
                DOORlbMenu.colors.selectedItemColor = "\1n\0015\1h\1w";
                DOORlbMenu.colors.itemTextCharHighlightColor = "\1h\1w";
                
                DOORlbMenu.Add("Local Games","LOCAL");
                DOORlbMenu.Add("Door Party","DOORPART");
                DOORlbMenu.Add("BCR Game Server","BCRGAMES");                   
                DOORlbMenu.Add("BBSLink","BLMENU");
                DOORlbMenu.Add("&Quit","Q");
                    
                var val = DOORlbMenu.GetVal();
                
                switch(val) {
                case "LOCAL":
                    if (conf.useDefDoors == 1) 
                        bbs.xtrn_sec();
                    else 
                        bbs.exec('*xtrn_sec_vanguard.js'); // XTERNALS
                
                case "Q":
                    return;
                
                default:
                    bbs.exec_xtrn(val)
                
                }               
                console.line_counter = 0;

                console.clear();
                

        return;
        //  bbs.xtrn_sec();
    }
}

// NO FILE MENU.
function filemenu() {
    console.crlf();
    console.putmsg(color.t_alert + 'Womp womp. Transfer section is not available. \1c\1hTry \1b\1hG\1r\1ho\1y\1ho\1b\1hg\1g\1hl\1r\1he\1c?\1n');
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
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Main Menu' + color.t_sym + ':\1n');

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
                bbs.exec("*automsg")
                break;
            case 'R':
                bbs.exec('*rumors addrumor');
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
                mystMenu('online');
                bbs.list_nodes()
                mystMenu('footer');
                break;
            case 'L':
                showLastCallers();
                break;
            case '/': // SLASH MENU
                console.putmsg('/');
                slashMenu(console.getkeys('?ADTGXO').toUpperCase());
                break;
            case ';': // SYSOP MENU
            case '.':
                console.crlf();
                if (user.compare_ars('SYSOP')) {
                    console.print(color.t_alert + 'Sysop Command: \1n\1w');
                    bbs.exec('*str_cmds ' + console.getstr(40));
                    break;
                }
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
        console.putmsg(color.t_sym + '[' + color.t_sym2 + '@GN@' + color.t_sym + '] ' + color.t_user + '@GRP@' + color.t_sym + ' [' + color.t_sym2 + '@SN@' + color.t_sym + '] ' + color.t_menu + '@SUBL@\1n');
        console.crlf();
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Message Menu' + color.t_sym + ':\1n');

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
                mystMenu("437");
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
                mystMenu("437");
                bbs.scan_posts();
                break;
                // POST NEW MESSAGE IN CURRENT GROUP
            case 'P':
                mystMenu("437");
                bbs.post_msg(msg_area.grp_list[bbs.curgrp].sub_list[bbs.cursub].code);
                break;
                // SCAN FOR NEW MESSAGES
            case 'N':
                // will use DDMesgReader if installed as Loadable module
                mystMenu("437");
                console.print("\r\n" + color.t_ques + "New Message Scan\r\n");
                bbs.scan_subs(SCAN_NEW);
                break;
                // SCAN FOR UNREAD MESSAGE TO USER
            case 'S':
                // will use DDMesgReader if installed as Loadable module
                mystMenu("437");
                console.print("\r\n" + color.t_ques + "Scan for Messages Posted to You\r\n");
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
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'System Menu' + color.t_sym + ':\1n');

        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
            //options and commands to perform
            case 'S':
                console.clear();
                bbs.sys_info();
                break;
            case 'U':
                mystMenu('userlist');
                bbs.list_users();
                console.line_counter = 1;
                break;
            case 'W':
                mystMenu('nodeltop');
                break;
            case 'L':
                showLastCallers();
                break;
            case 'D':
                defaults();
                break;
                // for /D
            case '/':
                console.putmsg('/');
                slashMenu(console.getkeys('?DXO').toUpperCase());
                break;
            case 'Y':
                console.clear();
                mystMenu('h1');
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
        mystMenu('chat-main');
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Chat Menu' + color.t_sym + ':\1n');
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
          case 'M':
              bbs.exec('*chat_sec');
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
                console.putmsg(color.t_alert + '...');
                sleep(500);
                console.putmsg(color.t_alert + ' ...');
                sleep(500);
                console.putmsg(color.t_alert + ' ...');
                sleep(500);
                console.putmsg(color.t_alert + ' ...');
                sleep(500);
                console.putmsg(color.t_alert + ' ...');
                break;
            case 'A':
                bbs.exec_xtrn('C0ACHAT');
                break;
            case 'R':
                if (user.compare_ars("GUEST")) {
                    console.clear();
                    alert("Can't access as guest.");
                    console.pause();
                    return;
                }
                console.clear();
                console.crlf(2);
				mystMenu("chat-irc");
                /*console.print(color.t_alert + 'You are about to be connected the public #bbs channel in irc.synchro.net\1n');
                console.crlf();
                console.print(color.t_txt + 'Commands to remember' + color.t_txt2 + ':\1n');
                console.crlf();
                console.print(color.t_info + '    /list          ' + color.t_txt2 + 'List Channels/Rooms');
                console.crlf();
                console.print(color.t_info + '    /join #channel ' + color.t_txt2 + 'Channel/Room');
                console.crlf();
                console.print(color.t_info + '    /part #channel ' + color.t_txt2 + 'Leave a Channel/Room');
                console.crlf();
                console.print(color.t_info + '    /quit          ' + color.t_txt2 + 'Quit IRC\1n');
                console.crlf(2);

                console.print(color.t_txt + 'If you continue, say hello, and hang around for a few minutes.');
                console.crlf();
    /*          console.print("Please choose one of the following " + conf.ircChannels.length + " channels:");
                for (var i =0; i < conf.ircChannels.length; i++) {
                    console.crlf();
                    console.print(i+1 + " " + conf.ircChannels[i].name + " " + conf.ircChannels[i].server + " " + conf.ircChannels[i].port);
                }*/
                
//                console.print("Please choose one of the following " + conf.ircChannels.length + " channels:");
    // Create a menu at position 1, 3 with width 45 and height of 10
            
            var IRClbMenu = new DDLightbarMenu(45, 11, 32, conf.ircChannels.length+1);
                IRClbMenu.numberedMode = true;
                IRClbMenu.colors.itemColor = "\1n\1h\1b";
                for (var i =0; i < conf.ircChannels.length; i++) {
                    //console.crlf();
                    IRClbMenu.Add(conf.ircChannels[i].name + " on " + conf.ircChannels[i].server);
                }
                    IRClbMenu.Add("&Quit","Q");
                    
                var val = IRClbMenu.GetVal();
                    if (val == "Q")
                        break;
                    var irc_server = conf.ircChannels[val].server + " " + conf.ircChannels[val].port;
                    var irc_channel = conf.ircChannels[val].channel;
                    console.print(irc_server + irc_channel)
                    bbs.exec("?irc -a " + irc_server + " " + irc_channel);
                
                        
                /*console.crlf();
                if (console.yesno(color.t_ques + 'Enter IRC Chat')) {
                    bbs.node_action = NODE_MCHT;
                    var irc_server = conf.ircChannels[0].server + " " + conf.ircChannels[0].port;
                    var irc_channel = conf.ircChannels[0].channel;
                    console.print(irc_server + irc_channel)
                    bbs.exec("?irc -a " + irc_server + " " + irc_channel);
                }*/
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
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Email Menu' + color.t_sym + ':\1n');
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
                console.print("\r\n" + color.t_ques + "E-mail (User name or number): \1n");
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
            console.putmsg(color.t_txt + 'Settings for \1h\1w' + user.alias + ' #' + user.number + color.t_txt + ', Page ' + color.t_txt2 + '1');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'USER ACCOUNT SETTINGS\1n',64));
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'A' + color.t_sym + '] ' + color.t_txt + 'Terminal Mode' + color.t_txt2 + '                  : \1n');
            console.putmsg((user.settings & USER_AUTOTERM) ? color.d_on + 'Auto Detect \1n' : '');
            console.putmsg((user.settings & USER_ANSI) ? color.d_on + 'ANSI \1n ' : color.d_off + 'TTY\1n ');
            console.putmsg((user.settings & USER_COLOR) ? color.d_on + '(Color) \1n' : color.d_off + '(Mono) \1n');
            console.putmsg((user.settings & USER_NO_EXASCII) ? color.d_off + 'ASCII Only \1n' : ' \1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'B' + color.t_sym + '] ' + color.t_txt + 'External Editor' + color.t_txt2 + '                : \1n');
            console.putmsg(color.d_on + xtrn_area.editor[user.editor].name);
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'C' + color.t_sym + '] ' + color.t_txt + 'Screen Length' + color.t_txt2 + '                  : \1n');
            var screenrows;
            if (user.screen_rows) {
                screenrows = user.screen_rows;
            } else {
                screenrows = color.d_value + 'Auto Detect ' + color.t_sym + '(' + color.t_sym2 + console.screen_rows + color.t_sym + ')';
            }
            console.putmsg(color.d_on + screenrows);
            console.crlf();

            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'D' + color.t_sym + '] ' + color.t_txt + 'Current Command Shell' + color.t_txt2 + '          : \1n');
            console.putmsg(color.d_on + user.command_shell.toUpperCase());
            console.crlf();

            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'E' + color.t_sym + '] ' + color.t_txt + 'Expert Mode' + color.t_txt2 + '                    : \1n');
            console.putmsg((user.settings & USER_EXPERT) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'F' + color.t_sym + '] ' + color.t_txt + 'Screen Pause' + color.t_txt2 + '                   : \1n');
            console.putmsg((user.settings & USER_PAUSE) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'G' + color.t_sym + '] ' + color.t_txt + 'Hot Keys' + color.t_txt2 + '                       : \1n');
            console.putmsg((user.settings & USER_COLDKEYS) ? color.d_off + 'OFF\1n' : color.d_on + 'ON\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'H' + color.t_sym + '] ' + color.t_txt + 'Spinning Cursor' + color.t_txt2 + '                : \1n');
            console.putmsg((user.settings & USER_SPIN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'I' + color.t_sym + '] ' + color.t_txt + 'Default to Quiet Mode' + color.t_txt2 + '          : \1n');
            console.putmsg((user.settings & USER_QUIET) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf(2);

            console.putmsg(lpad(color.d_head + 'USER PROFILE SETTINGS\1n',64));
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'J' + color.t_sym + '] ' + color.t_txt + 'Update Location/Affiliations' + color.t_txt2 + '   : \1n');
            console.putmsg(color.d_value + user.location + '\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'K' + color.t_sym + '] ' + color.t_txt + 'Change Password\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'L' + color.t_sym + '] ' + color.t_txt + 'Change Internet E-mail' + color.t_txt2 + '         : \1n');
            console.putmsg(color.d_on + user.netmail + '\1n');
            console.crlf();
            console.putmsg(color.d_off + ' -  ' + color.t_txt + 'Local Email ' + color.d_off + '(READ ONLY)' + color.t_txt2 + '        : ');
            console.putmsg(color.d_off + user.email + '\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'M' + color.t_sym + '] ' + color.t_txt + 'Update Signature');
            console.crlf();
            console.putmsg(color.d_off + ' -  ' + color.t_txt + 'Birthdate ' + color.d_off + '(READ ONLY)' + color.t_txt2 + '          : ');
            console.putmsg(color.d_off + user.birthdate + '\1n');
            console.putmsg(color.t_sym + ' (' + color.t_sym2 + user.age + color.t_sym + ') \1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'N' + color.t_sym + '] ' + color.t_txt + 'Change Gender' + color.t_txt2 + '                  : \1n');
            console.putmsg(color.d_on + user.gender + '\1n');

            //  bbs.menu(user.command_shell + '/settings1');
            console.gotoxy(1, 22);
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'Q' + color.t_sym + '] ' + color.t_txt + 'uit. ' + color.t_sym + '[' + color.t_sym2 + 'ARROWS' + color.t_sym + ',' + color.t_sym2 + '#' + color.t_sym + '] ' + color.t_txt + 'To Switch Pages.');
            console.crlf(2);

            console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Defaults Menu 1' + color.t_sym + ': \1n');
            var key = console.getkey(K_NOECHO).toUpperCase();
            bbs.log_key(key);
            switch (key) {
                // USER OPTIONS
            case 'J':
                var lastlocation = user.location;
                console.crlf(2);

                console.putmsg(color.d_value + 'Currently: ' + color.t_txt2 + lastlocation);
                console.crlf();
                console.putmsg(color.t_sym + '[' + color.t_sym2 + '?' + color.t_sym + '] ' + color.t_ques + 'Enter your location / group affiliations\1w: ');
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
                if (console.yesno(color.t_ques + 'Use automatic terminal type detection')) {
                    user.settings |= USER_AUTOTERM;
                } else {
                    user.settings &= ~USER_AUTOTERM;
                    if (console.yesno(color.t_ques + 'Does your terminal support ANSI')) {
                        user.settings |= USER_ANSI;
                    } else {
                        user.settings &= ~USER_ANSI;
                    }
                }

                if (console.yesno(color.t_ques + 'Do you have a color terminal')) {
                    user.settings |= USER_COLOR;
                } else {
                    user.settings &= ~USER_COLOR;
                }

                if (console.yesno(color.t_ques + 'Does your terminal support IBM extended ASCII')) {
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
                if (console.yesno(color.t_ques + 'Auto Detect screen row length')) {
                    user.screen_rows = '';
                } else {
                    console.putmsg(color.t_ques + 'How many rows does your terminal support?');
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
                console.crlf(2);

                alert(color.d_value + 'Current password: ' + color.t_txt2 + user.security.password.toUpperCase());
                console.crlf();
                if (!console.noyes(color.t_ques + 'Would you like to change your password')) {
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
                console.crlf(2);

                console.putmsg(color.d_value + 'Currently: ' + color.t_txt2 + lastnetmail);
                console.crlf();
                console.putmsg(color.t_sym + '[' + color.t_sym2 + '?' + color.t_sym + '] ' + color.t_ques + 'Enter Your Internet E-mail Address\1w: ');
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
                console.crlf(2);

                console.putmsg(color.d_value + 'Currently: ' + color.t_txt2  + lastgender);
                console.crlf();
                console.putmsg(color.t_sym + '[' + color.t_sym2 + '?' + color.t_sym + '] ' + color.t_ques + 'Enter Your Gender\1w: ');
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
            console.putmsg(color.t_txt + 'Settings for \1h\1w' + user.alias + ' #' + user.number + color.t_txt + ', Page ' + color.t_txt2 + '2');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'CHAT SETTINGS\1n',56));
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'A' + color.t_sym + '] ' + color.t_txt + 'Allow Paging' + color.t_txt2 + '                   : \1n');
            console.putmsg((user.chat_settings & CHAT_NOPAGE) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'B' + color.t_sym + '] ' + color.t_txt + 'Activity Alerts' + color.t_txt2 + '                : \1n');
            console.putmsg((user.chat_settings & CHAT_NOACT) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'C' + color.t_sym + '] ' + color.t_txt + 'Private Split-Screen Chat' + color.t_txt2 + '      : \1n');
            console.putmsg((user.chat_settings & CHAT_SPLITP) ? '\1n\1cSPLIT SCREEN\001n' : '\1n\1cTRADITIONAL\001n');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'MESSAGE SCAN SETTINGS\1n',64));
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'D' + color.t_sym + '] ' + color.t_txt + 'Ask For "New Scan" At Login' + color.t_txt2 + '    : \1n');
            console.putmsg((user.settings & USER_ASK_NSCAN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'E' + color.t_sym + '] ' + color.t_txt + 'Ask For Your Un-read Msg Scan' + color.t_txt2 + '  : \1n');
            console.putmsg((user.settings & USER_ASK_SSCAN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'F' + color.t_sym + '] ' + color.t_txt + 'New Scan Configuration\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'G' + color.t_sym + '] ' + color.t_txt + 'Your "to-you" Message Scan Config\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'H' + color.t_sym + '] ' + color.t_txt + 'Re-init New Scan Pointers\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'I' + color.t_sym + '] ' + color.t_txt + 'Set New Scan Pointers\1n');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'MESSAGE READ SETTINGS\1n',64));
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'J' + color.t_sym + '] ' + color.t_txt + 'Remember Current Sub-Board' + color.t_txt2 + '     : \1n');
            console.putmsg((user.settings & USER_CURSUB) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'K' + color.t_sym + '] ' + color.t_txt + 'Clear Screen Between Messages' + color.t_txt2 + '  : \1n'); // clear screen btw msgs
            console.putmsg((user.settings & USER_CLRSCRN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'L' + color.t_sym + '] ' + color.t_txt + 'Forward Email to Netmail' + color.t_txt2 + '       : \1n');
            console.putmsg((user.settings & USER_NETMAIL) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();

            console.putmsg(lpad(color.d_head + 'FILE SCAN OPTIONS\1n',60));
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'M' + color.t_sym + '] ' + color.t_txt + 'Default Download Protocol' + color.t_txt2 + '      : \1n');
            console.putmsg('\1n\1c' + user.download_protocol + '-Modem');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'N' + color.t_sym + '] ' + color.t_txt + 'Auto New File Scan At Login' + color.t_txt2 + '    : \1n');
            console.putmsg((user.settings & USER_ANFSCAN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'O' + color.t_sym + '] ' + color.t_txt + 'Batch Download File tagging' + color.t_txt2 + '    : \1n');
            console.putmsg((user.settings & USER_BATCHFLAG) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');

            console.gotoxy(1, 22);
            console.putmsg(color.t_sym + '[' + color.t_sym2 + 'Q' + color.t_sym + '] ' + color.t_txt + 'uit. ' + color.t_sym + '[' + color.t_sym2 + 'ARROWS' + color.t_sym + ',' + color.t_sym2 + '#' + color.t_sym + '] ' + color.t_txt + 'To Switch Pages.');
            console.crlf(2);

            console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Defaults Menu 2' + color.t_sym + ':\1n');
            var key = console.getkey(K_NOECHO).toUpperCase();
            bbs.log_key(key);
            switch (key) {
                // MSG SCAN OPTIONS
            case 'F':
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

function xferMenu() {
    while (bbs.online) {
    //  if (!file_exists(system.mods_dir + 'DDFileArea3Chooser.js')) {
    //  console.putmsg(color.t_alert + 'Womp womp. Transfer section is not available. \1c\1hTry \1b\1hG\1r\1ho\1y\1ho\1b\1hg\1g\1hl\1r\1he\1c?\1n');
    //  console.pause();
    //  return; 
    //  }
        bbs.node_action = NODE_XFER;
        bbs.nodesync();
        console.clear();
        mystMenu(conf.fontcode);
        mystMenu('xfer');
        console.putmsg(color.t_sym + '[' + color.t_sym2 + '@LN@' + color.t_sym + '] ' + color.t_user + '@LIB@' + color.t_sym + ' [' + color.t_sym2 + '@DN@' + color.t_sym + '] ' + color.t_menu + '@DIRL@\1n');
        console.crlf();
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'File Menu' + color.t_sym + ':\1n');
        
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
            // NAVIGATE GROUPS/SUBS
            case '}':
            case KEY_UP:
                if(bbs.curlib == file_area.lib_list.length-1)
                    bbs.curlib=0;
                else
                    bbs.curlib++;
                break;
            case '{':
            case KEY_DOWN:
                if(bbs.curlib == 0)
                    bbs.curlib=file_area.lib_list.length-1;
                else
                    bbs.curlib--;
                break;
            case ']':
            case KEY_RIGHT:
                if(bbs.curdir>=file_area.lib_list[bbs.curlib].dir_list.length-1)
                    bbs.curdir=0;
                else
                    bbs.curdir++;
                break;
            case '[':
            case KEY_LEFT:
                if(bbs.curdir==0)
                    bbs.curdir=file_area.lib_list[bbs.curlib].dir_list.length-1;
                else
                    bbs.curdir--;
                break;
                // SELECT GROUPS/SUBS
            case 'G':
            case 'J':
				bbs.exec('?DDFileAreaChooser.js');
                break;
            case 'L':               
                // LIST FILES IN CURRENT DIRECTORY
                bbs.list_files();
            case 'R':
            case '\r':
                // will use DDMesgReader if installed as Loadable module
                bbs.scan_dirs();
                break;
                // POST NEW MESSAGE IN CURRENT GROUP
            case 'U':
                bbs.upload_file();
                break;
                // SCAN FOR NEW MESSAGES
            case 'N':
                // will use DDMesgReader if installed as Loadable module
                console.print("\r\n" + color.t_ques + "New File Scan\r\n");
                bbs.scan_dirs(FL_ULTIME);
                break;
                // FIND TEXT IN POSTS
            case 'F':
                console.print("\r\n" + color.t_ques + "Find Text in File Descriptions (no wildcards)\r\n");             
                bbs.scan_dirs(FL_FINDDESC);
                break;
            case 'S':
                console.print("\r\n" + color.t_ques + "Search Text in File Names.\r\n");                
                bbs.scan_dirs(FL_NO_HDR);
                break;
                // SLASH AND COLON MENUS
            case '/': // FOR /F /N /R /J
                console.putmsg('/');
                slashMenu(console.getkeys('?DXOFNR').toUpperCase());
                break;
            case 'D':
                console.print(color.t_txt + "\r\nDownload File(s)\r\n");
                if(bbs.batch_dnload_total>0) {
                    if(console.yesno(bbs.text(DownloadBatchQ))) {
                        bbs.batch_download();
                        break;
                    }
                }
                break;
                // QUIT
            case 'Q':
                mainMenu();
                return;
            case '?':
                mystMenu('xfer');
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



/*****************************************************************
                                         SLASH FUNCTIONS
*****************************************************************/

function slashMenu(option) {
    switch (option) {
    case '?':
        console.clear();
        mystMenu('obscure');
        break;
	case 'A':
		avatar_chooser();
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
        bbs.scan_subs(SCAN_FIND, all = true);
        break;
    case 'G':
        xferMenu();
        //bbs.exec("*DDFLIST")
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
    case 'T':
        bbs.exec('?filearea-lb.js')
    case '\r':
        return;
    default:
        alert('NOT VALID');
        console.pause();
        break;
    }
}


/*****************************************************************
                                          LAST 10 CALLER FUNCTIONS
*****************************************************************/

function lastCaller() {
    if (user.total_logons < '3') {
        activity.isnewu = '\1h\1gN\1n\1w';
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

    // Compile Activity string for last10 callers.
    var actions = activity.isnewu + activity.doors + activity.readmg + activity.posted + activity.gfiles + activity.fsysop + activity.hungup;
	
	var call_data = {
			call:system.stats.total_logons,
			nodenum:bbs.node_num.toString(),
			username:user.alias,
			totcalls:user.stats.total_logons,
			usernum:user.number,
			location:user.location,
			ip:user.ip_address,
			dateon:client.connect_time,
			timeon:user.stats.timeon_last_logon.toString(),
			speed:client.protocol,
			actions:actions,
			shell:user.command_shell
		};

    //var nodenum = rpad(bbs.node_num.toString(),3);
    //var username = rpad(user.alias,15);
    //var location = rpad(user.location,20);
    //var dateon = strftime("%m/%d/%y %I:%M%p", client.connect_time);
    //var timeon = rpad(user.stats.timeon_last_logon.toString(),4);
    //var speed = rpad(client.protocol,6);
    bbs.log_str('Adding to lastcaller list.');
    //var newline = " \1h\1c" + rpad(call_data.nodenum,3) + "\1h\1b" + rpad(call_data.username,15) + "\1k" + rpad(call_data.location,20) + " \1w" + call_data.dateon2 + " \1m" + rpad(call_data.timeon,5) + "\1n\1y" + call_data.actions + "  \1h" + call_data.shell.toUpperCase();

	
    if (stealth == 'disabled') {
        saveLastCaller(call_data);
	}
}

function saveLastCaller(call_data) {
    var lastcallers = system.mods_dir + '\\cslast10.asc';
    f = new File(lastcallers);
    if (!f.open("a")) {
        alert("Error opening file: " + lastcallers);
        return;
    }
	// save to text file
    f.writeln(" \1h\1c" + rpad(call_data.nodenum,3) + "\1h\1b" + rpad(call_data.username,15) + "\1k" + rpad(call_data.location,20) + " \1w" + strftime("%m/%d/%y %I:%M%p", call_data.dateon) + " \1m" + rpad(call_data.timeon,4) + "\1n\1y" + call_data.actions + "   \1h" + call_data.shell.toUpperCase());
    f.close();
	
	//save to JSON database
	var db = new JSONClient(serverAddr, serverPort);
	var laston = db.read("mystique", "laston", 1);
	if(laston == undefined) db.write("mystique", "laston", [], 2);
	db.push("mystique", "laston", call_data, 2);
}


function showLastCallers(int) {
    var num = int
    var lastcallers = system.mods_dir + '\\cslast10.asc';
    console.crlf();
    if (num == 'undefined' || num == null) {
        console.putmsg(color.t_sym + '[' + color.t_sym2 + '?' + color.t_sym + '] ' + color.t_ques + 'How many callers would you like to list? ' + color.t_txt2 + '100 Max.' + color.t_sym + ' [' + color.t_sym2 + '10' + color.t_sym + ']');
        console.putmsg(color.t_sym + ' : ');
        num = console.getnum(100, 10);
        }
		console.crlf(5);
		
/*	var db=new JSONClient(serverAddr,serverPort);
	var laston = db.read("mystique", "laston", 1);	
	var allLastCallers = db.slice('mystique','laston',0,allLastCallers.length,1);
	/*WAIT FOR DATABASE TO BE MORE POPULATED*/


	/*var unique = [];
	for (var n in allLastCallers) {
		unique[n] = allLastCallers[n];
	}
		
	console.pause()
*/

    mystMenu('last10-h');
	/*for (n in last10) 
		console.putmsg(" \1h\1c" + rpad(last10[n].nodenum,3) + "\1h\1b" + rpad(last10[n].username,15) + "\1k" + rpad(last10[n].location,20) + " \1w" + rpad(timeSince(last10[n].dateon),8)  + " \1m" + rpad(last10[n].timeon,4) + "\1n\1y" + last10[n].actions + " \1h" + last10[n].shell.toUpperCase() + "\r\n");
	/*WAIT FOR DATABASE TO BE MORE POPULATED*/
    console.printtail(lastcallers, num);
    mystMenu('last10-f');
    }
    

/*****************************************************************
                                                 LOG OFF FUNCTIONS
*****************************************************************/

function logOff() {
	console.clear();
    mystMenu('goodbye');
    bbs.exec('*D1LINER');
    bbs.logoff(); // interactive logoff procedure
    if (!bbs.online) {
        activity.hungup = '-';
    }
}

function logOffFast() {
	console.clear();
    bbs.logoff(false); // non-interactive logoff procedure
    if (!bbs.online) {
        activity.hungup = '-';
    }
}

console.line_counter = 0;
bbs.sys_status &= ~SS_ABORT; //clear ctrl-c/abort status

mainMenu();
//menu.main();