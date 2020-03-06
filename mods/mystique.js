/*****************************************************************************
                       Mystique Synchronet 3 Command Shell
                       requires DDMsgReader, DDAreaLister
                       
					   FLAGS1: PFREDT: Posted, Read, Feedback, email, doors, text files
										Flags1 get wiped each new call.
					   FLAGS2: F: Fast login
----------------------------------------------------------------------------*/
load("sbbsdefs.js"); // load helper functions
load("functions.js");
load("settings.js");
load("dd_lightbar_menu.js");

//load('fonts.js', "437");

// Load (fontcode).ans from selected menu set directory, reset the font to 437 or amiga.
mystMenu(conf.fontcode); // reset font type

// Get current shell code, to check later in case of settings change.
var thisShell = user.command_shell;

js.on_exit('lastCaller()'); // generate last caller entry if disconnected

// activity will be posted to last caller list by default
var activity = [];

console.putmsg(color.t_info + 'Loading ' + system.name + ' Command Shell..' + color.t_yes + thisShell.toUpperCase() + ' Loaded!');
console.crlf(2);
sleep(500);

bbs.timeout_warn = 180; //180 second default timeout warning
bbs.timeout_hangup = 300; //300 second default timeout hangup

/*****************************************************************
                                                    MENU FUNCTIONS
*****************************************************************/


// NO FILE MENU.
function filemenu() {
    console.crlf();
	console.gotoxy(2,24);
    console.putmsg(color.t_alert + "Womp womp. Transfer section is not available. \1c\1hTry \1b\1hG\1r\1ho\1y\1ho\1b\1hg\1g\1hl\1r\1he\1c?\1n");
    console.pause();
    return;
}

function mainMenu() {
    while (bbs.online) {
        //check to see if the user has changed command shell.
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_MAIN;
        bbs.nodesync();
        mystMenu(conf.fontcode); // reset font type
        
		if(!(user.settings & USER_EXPERT)) 
        mystMenu('main');
		else 
		console.clear();
		mystPrompt('Main');

        //options and commands to perform
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);

        switch (key) {
            // MAIN OPTIONS
			
            case 'C':
				chatMenu();
                 break;
            case 'G':
            case 'T':
				activity.gfiles = 'T';
                //bbs.exec_xtrn('TEXTFILE');
					bbs.text_sec();
                break;
			case 'M':
                msgMenu();
                break;
            case 'I':
				systemMenu();
				break;
			case 'S':
				scoresMenu();
				break;
            case 'X':
				if (file_exists('/sbbs/mods/xtrn_sec_vanguard.js')) 
					bbs.exec('?xtrn_sec_vanguard.js');
				else 
					bbs.xtrn_sec();
                break;
                // OTHER OPTIONS
            case '1':
                bbs.exec('*oneliners');
                break;
            case 'A':
                bbs.exec("*automsg")
                break;
            case 'D':
                defaults();
                break;
			case 'R':
                bbs.exec('*rumors addrumor');
                break;
                // SOME POPULAR 'HIDDEN' ITEMS (NOT ON MENU)    
            case 'F':
                filemenu();
                break;
            case 'W':
                mystHeader('online');
                bbs.list_nodes();
                break;
            case 'L':
                bbs.exec('*lastcallers.js');
                break;
            case '/': // SLASH MENU
                console.putmsg('/');
                slashMenu(console.getkeys('?ACDTSGQXO',1));
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
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('main');
				}
				break;
            case 'O': // LOGOFF
                logOff();
                break;
			case '!':
				logOffFast();
				break;
            default: // FALL BACK
                break;
        } // end switch
    } // while online
} // end main

function msgMenu() {
    while (bbs.online) {
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_RMSG;
        bbs.nodesync();
        console.clear();
        mystMenu(conf.fontcode);
        mystMenu('mesg');
		mystPrompt('Messages');
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
            case 'D':
                defaults();
                break;
            case 'E':
                emailMenu();
                break;
            case 'G':
            case 'J':
                mystMenu(conf.fontcode);
				if (file_exists(conf.DDReader)) 
					bbs.exec('?' + conf.DDReader + ' -chooseAreaFirst' + DDconfig);
                break;
                // READ NEW MESSAGES IN CURRENT GROUP
			case 'I':
                console.clear();
                bbs.sub_info();
                break;
            case 'L':
				mystMenu(conf.fontcode);
                if (file_exists(conf.DDReader)) 
					bbs.exec('?' + conf.DDReader + ' -startMode=list' + DDconfig);
				else if (file_exists(system.mods_dir + 'msglist.js')) 
					bbs.exec('?' + system.mods_dir + 'msglist.js');
				else
                    bbs.list_msgs();
                break;
            case 'R':
            case '\r':
				mystMenu(conf.fontcode);
                if (file_exists(conf.DDReader)) 
					bbs.exec('?' + conf.DDReader + DDconfig);
				else
                    bbs.list_msgs();
                break;
                // POST NEW MESSAGE IN CURRENT GROUP
            case 'P':
                mystMenu(conf.fontcode);
                bbs.post_msg(msg_area.grp_list[bbs.curgrp].sub_list[bbs.cursub].code);
                break;
                // SCAN FOR NEW MESSAGES
            case 'N':
                // will use DDMesgReader if installed as Loadable module
                mystMenu(conf.fontcode);
                console.print("\r\n" + color.t_ques + "New Message Scan\r\n");
                bbs.scan_subs(SCAN_NEW);
                break;
                // SCAN FOR UNREAD MESSAGE TO USER
            case 'S':
                // will use DDMesgReader if installed as Loadable module
                mystMenu(conf.fontcode);
                console.print("\r\n" + color.t_ques + "Scan for Messages Posted to You\r\n");
                bbs.scan_subs(SCAN_TOYOU);
                break;
                // CONF NEW MSG SCAN
            case 'C':
            if (file_exists(system.mods_dir + '/DM_NewScanConfig.js')) 
                    bbs.exec('?DM_NewScanConfig.js');
                else 
                    bbs.cfg_msg_scan();
                break;
                // FIND TEXT IN POSTS
            case 'F':
                bbs.scan_subs(SCAN_FIND);
                break;
                // SLASH AND COLON MENUS
            case '/': // FOR /F /N /R /J
                console.putmsg('/');
                slashMenu(console.getkeys('?DXOFNWQR',1));
                break;
                // QUIT
            case 'Q':
                mainMenu();
                return;
                // LOG OUT
			case '!':
				logOffFast();
				break;
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

function scoresMenu() {
    while (bbs.online) {
		if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.nodesync();
        console.clear();
        mystMenu(conf.fontcode);
        mystMenu('scores');
		mystPrompt('Scores');
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
            // NAVIGATE GROUPS/SUBS
            case 'L':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js local")
			break;
            case 'B':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bbslink")
			break;
            case 'C':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js coa")
			break;
            case 'D':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js party")
			break;
            case 'N':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bulletins")
			break;
            case 'S':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js news")
			break;
			case 'T':
			bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js business qrd")
			break;			
			case 'Q':
                mainMenu();
                return;
                // LOG OUT
            default:
                break;
        } // end switch
    } // while online
    return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} // end message

function systemMenu() {
    while (bbs.online) {
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_DFLT;
        bbs.nodesync();
        console.clear();
        mystMenu(conf.fontcode);
        mystMenu('system');
		mystPrompt('System');
		//console.gotoxy(2,24);
        //console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'System Menu' + color.t_sym + ': \1n');

        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
            //options and commands to perform
            case 'S':
                console.clear();
                bbs.sys_info();
                break;
            case 'U':
                mystHeader('userlist');
                bbs.list_users();
                console.line_counter = 1;
                break;
            case 'W':
                mystHeader('online');
				bbs.list_nodes();
                break;
            case 'L':
                bbs.exec('*lastcallers.js');
                break;
            case 'Y':
                //console.clear();
				mystHeader('userinfo');
                mystMenu('userinfo');
				bbs.user_info();
				break;
            case 'V':
                console.clear();
                bbs.ver();
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
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_CHAT;
        bbs.nodesync()
        console.clear();
        mystMenu('chat');
		mystPrompt('Chat');
		//console.gotoxy(2,24);
        //console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Chat Menu' + color.t_sym + ': \1n');
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
          case 'M':
              bbs.exec_xtrn('MRCCHAT');
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
           
            var ircMenu = new DDLightbarMenu(46, 14, 32, conf.ircChannels.length+1);
                ircMenu.numberedMode = true;
                ircMenu.colors.itemColor = "\1n\1h\1b";
                for (var i =0; i < conf.ircChannels.length; i++) {
                    //console.crlf();
                    ircMenu.Add(conf.ircChannels[i].name + " on " + conf.ircChannels[i].server);
                }
                    ircMenu.Add("&Quit","Q");
                    
                var val = ircMenu.GetVal();
                    if (val == "Q")
                        break;
                    var irc_server = conf.ircChannels[val].server + " " + conf.ircChannels[val].port;
                    var irc_channel = conf.ircChannels[val].channel;
                    console.print(irc_server + irc_channel)
                    bbs.exec("?irc -a " + irc_server + " " + irc_channel);
                     
                console.line_counter = 0;
                console.clear();
                break;

            case 'Q':
            case '\r':
                return;

        } // end switch
    } // while online
    return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} // end chat


function emailMenu() {
    while (bbs.online) {
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_RMAL;
        bbs.nodesync();
        console.clear();
        mystMenu('mail');
		mystPrompt('Email')
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
            case 'R':
				if (file_exists(conf.DDReader)) 
                    bbs.exec('?' + conf.DDReader + ' -personalEmail -startMode=list' + DDconfig);
                else 
                    bbs.read_mail();
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
				if (file_exists(conf.DDReader)) 
                    bbs.exec('?' + conf.DDReader + ' -personalEmailSent -startMode=list' + DDconfig);
                else 
                    bbs.read_mail(which=MAIL_SENT);
                break;
            case 'F':
                console.clear();
//                console.ungetstr('Feedback');
                bbs.email(1,subject='Feedback');
                break;
            case 'Q':
                msgMenu();
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





function xferMenu() {
    while (bbs.online) {
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_XFER;
        bbs.nodesync();
        console.clear();
        mystMenu(conf.fontcode);
        mystMenu('xfer');
		mystPrompt('Files');
        
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
			case 'B':
				bbs.batch_menu();
				break;
                // SELECT GROUPS/SUBS
            case 'G':
            case 'J':
				bbs.exec('?DDFileAreaChooser.js');
                break;
            case 'L':               
            case '\r':
                // will use DDMesgReader if installed as Loadable module
               bbs.list_files();
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
                slashMenu(console.getkeys('?DXOFNR',1));
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
        mystMenu('obsc');
        break;
    case '1':
		bbs.exec('*d1liner');
        break;
	case 'A':
		avatar_chooser();
		break;
	case 'C':
		bbs.exec_xtrn('MRCCHAT');		
		break;
    case 'O':
        logOffFast();
        break;
        // SYSTEM MENU
    case 'W':
        
        bbs.xtrn_sec("LOCALGA")
        break;
        // MSG MENU
    case 'F':
        bbs.scan_subs(SCAN_FIND, all = true);
        break;
    case 'X':
        bbs.exec('?xtrn_sec LOCALGA');
        break;
    case 'G':
        xferMenu();
        break;
    case 'N':
        bbs.scan_subs(SCAN_NEW, all = true);
        break;
    case 'R':
        bbs.scan_posts(msg_area.grp_list[bbs.curgrp].sub_list[bbs.cursub].code, 0);
        break;
    case 'J':
				if (file_exists(conf.DDReader)) 
					bbs.exec('?' + conf.DDReader + ' -chooseAreaFirst' + DDconfig);
        break;
    case 'X':
        user.settings ^= USER_EXPERT;
        break;
    case 'T':
        bbs.exec('?filearea-lb.js')
    case 'Q':
	//mystMenu("qwk");
         bbs.qwk_sec();
        break;
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
	
	bbs.log_str('Removing user activity flags.');
	user.security.flags1=0;
	
	bbs.log_str('Creating user activity flags.');

    if (bbs.logon_posts != '0') 
		user.security.flags1|=UFLAG_P;
	
    if (bbs.posts_read != '0') 
		user.security.flags1|=UFLAG_R;

    if (bbs.logon_fbacks != '0') 
		user.security.flags1|=UFLAG_F;
    
    if (bbs.logon_emails != '0') 
		user.security.flags1|=UFLAG_E; 
    
	if (activity.doors == 'D')
		user.security.flags1|=UFLAG_D;
	
	if (activity.gfiles == 'T')
		user.security.flags1|=UFLAG_T;
	
	console.write("Setting up flags...\r\n");

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
		user.security.flags1^=UFLAG_H; 
		}
}

function logOffFast() {
	console.clear();
    bbs.logoff(false); // non-interactive logoff procedure
    if (!bbs.online) {
		user.security.flags1^=UFLAG_H; 
    }
}

console.line_counter = 0;
bbs.sys_status &= ~SS_ABORT; //clear ctrl-c/abort status

mainMenu();
