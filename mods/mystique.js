/*****************************************************************************
                       Mystique Synchronet 3 Command Shell
                       requires DDMsgReader, DDAreaLister
                       
					   FLAGS1: PFREDTK: Posted, Read, Feedback, email, doors, text files, FMK
									   Flags1 get wiped each new call.
					   FLAGS2: F: Fast login, (L: LeetCase, C:LeetColor)
----------------------------------------------------------------------------*/
load("sbbsdefs.js"); // load helper functions
load("myst_functions.js");
load("myst_settings.js");
load("myst_colors.js");
load("dd_lightbar_menu.js");
load("myst_language.js");
load("key_defs.js");
//load('fonts.js', "437");

// Load (fontcode).ans from selected menu set directory, reset the font to 437 or amiga.
bbs.menu(conf.fontcode); // reset font type

// Get current shell code, to check later in case of settings change.
var thisShell = user.command_shell;
var thisFont = conf.fontcode;

js.on_exit('setActivityFlags()'); // set activity flags if disconnected

// activity will be posted to last caller list by default
var activity = [];
activity.hungup = "H";

console.putmsg(mystText(color.normal + 'Loading ' + system.name + ' Command Shell.. ') + color.reset + color.yes + ' ' + thisShell.toUpperCase() + ' LOADED! \1n\1c');
console.crlf(2);
sleep(1000);

bbs.timeout_warn = 180; //180 second default timeout warning
bbs.timeout_hangup = 300; //300 second default timeout hangup

/*****************************************************************
                                                    MENU FUNCTIONS
*****************************************************************/


// NO FILE MENU.
function filemenu() {
    console.crlf();
	console.gotoxy(2,24);
    console.putmsg(mystText(" Womp womp. Transfer section is not available. \1n\1c\1hTry \1b\1hG\1r\1ho\1y\1ho\1b\1hg\1g\1hl\1r\1he\1c?\1n"));
    console.pause();
    return;
}

function mainMenu() {
    while (bbs.online) {
        //check to see if the user has changed command shell.
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
		console.putmsg('@RESETPAUSE@');	
        bbs.node_action = NODE_MAIN;
        //bbs.nodesync();
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)

		mystPrompt('main');

        //options and commands to perform
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);

        switch (key) {
            // MAIN OPTIONS
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('main');
				}
				break;
			case '!':
				logOffFast();
				break;
            case '.':
                console.crlf();
				if (user.compare_ars('SYSOP')) {
					console.putmsg('@RESETPAUSE@');
					bbs.menu('sysmain');
                    console.print(" " + color.alert + 'Sysop Command:'+ m_color.RESETCOLOR + " ");
                    bbs.exec('*str_cmds ' + console.getstr(50));
                    break;
                }
                break;
            case '/': // SLASH MENU
                console.putmsg('/');
                slashMenu(console.getkeys('?/1!AMCODFNXSTQ',1));
                break;
            case '1':
                bbs.exec('*oneliners');
                break;
            case 'A':
                bbs.auto_msg()
                break;
            case 'C':
				chatMenu();
                 break;
			case 'D':
                bbs.exec('?myst_defaults');
                break;
            case 'F':
                xferMenu();
                break;
			case 'T':
				activity.gfiles = 'T';
				bbs.exec('?text_sec.js');
                break;
            case 'I':
			case 'S':
				systemMenu();
				break;
            case 'L':
                bbs.exec('*myst_lastcallers.js');
				console.pause();
                break;
			case 'M':
				//console.print(color.alert + ">> Message Menu\1n")
                msgMenu();
                break;
            case 'O': // LOGOFF
                logOff();
                break;
            case 'W':
				mystHeaderFooter('header','hdr-online');
				bbs.list_nodes();
				console.gotoxy(1,24);
				console.pause();
                break;
			case 'G':
            case 'X':
				activity.doors = 'D';
				if (file_exists('/sbbs/mods/xtrn_sec_vanguard.js')) 
					bbs.exec('?xtrn_sec_vanguard.js');
				else 
					bbs.xtrn_sec();
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
        //bbs.nodesync();
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)
		console.putmsg('@RESETPAUSE@');			
		mystPrompt('Mesg');
		
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('mesg');
				}
				break;
			case '!':
				logOffFast();
				break;
                // SLASH AND COLON MENUS
			case '/': // FOR /F /N /R /J
                console.putmsg('/');
                slashMenu(console.getkeys('?/1!AMCODFNXRSTQ',1));
                break;
				// NAVIGATE GROUPS/SUBS
			case '}':
            case KEY_UP:
				console.print(color.alert + " NEXT GROUP \1n\r\n");
                bbs.lastgrp = bbs.curgrp;
                bbs.curgrp++;
                if (bbs.lastgrp == bbs.curgrp) bbs.curgrp = 0;
                break;
            case '{':
            case KEY_DOWN:
				console.print(color.alert + " PREVIOUS GROUP \1n\r\n");
                bbs.lastgrp = bbs.curgrp;
                bbs.curgrp--;
                if (bbs.lastgrp == bbs.curgrp) bbs.curgrp = msg_area.grp_list.length - 1;
                break;
            case ']':
            case KEY_RIGHT:
				console.print(color.alert + " NEXT SUB \1n\r\n");
                bbs.lastsub = bbs.cursub;
                bbs.cursub++;
                if (bbs.lastsub == bbs.cursub) bbs.cursub = 0;
                break;
            case '[':
            case KEY_LEFT:
				console.print(color.alert + " PREVIOUS SUB \1n\r\n");
                bbs.lastsub = bbs.cursub;
                bbs.cursub--;
                if (bbs.lastsub == bbs.cursub) bbs.cursub = msg_area.grp_list[bbs.curgrp].sub_list.length - 1;
                break;
                // SELECT GROUPS/SUBS
            case 'C':
            if (file_exists('/sbbs/mods/DM_NewScanConfig.js')) 
                    bbs.exec('?DM_NewScanConfig.js');
                else 
                    bbs.cfg_msg_scan();
                break;
			case 'D':
                bbs.exec('?myst_defaults');
                break;
            case 'E':
                emailMenu();
                break;
                // FIND TEXT IN POSTS
            case 'F':
                bbs.scan_subs(SCAN_FIND);
                break;
			case 'G':
            case 'J':
                bbs.menu("437");
				if (file_exists(conf.DDReader)) 
					bbs.exec('?' + conf.DDReader + ' -chooseAreaFirst' + DDconfig);
				bbs.menu(conf.fontcode);
				console.pushxy();
				console.clear();
				console.popxy();
                break;
                // READ NEW MESSAGES IN CURRENT GROUP
			case 'I':
                console.clear();
                bbs.sub_info();
                break;
            case 'L':
				bbs.menu("437");
                if (file_exists(conf.DDReader)) 
					bbs.exec('?' + conf.DDReader + ' -startMode=list' + DDconfig);
				else if (file_exists('/sbbs/mods/msglist.js')) 
					bbs.exec('?msglist.js');
				else
                    bbs.list_msgs();
                break;
				bbs.menu(conf.fontcode);
                // POST NEW MESSAGE IN CURRENT GROUP
                // SCAN FOR NEW MESSAGES
            case 'N':
                // will use DDMesgReader if installed as Loadable module
                console.print(color.alert + " New Message Scan \1n\r\n");
				bbs.menu("437");
                bbs.scan_subs(SCAN_NEW);
				bbs.menu(conf.fontcode);
                break;
                // SCAN FOR UNREAD MESSAGE TO USER
            case 'O':
                logOff();
                break;
            case 'P':
                bbs.menu("437");
                bbs.post_msg(msg_area.grp_list[bbs.curgrp].sub_list[bbs.cursub].code);
				bbs.menu(conf.fontcode);
                break;
            case 'Q':
                mainMenu();
                return;
			case 'R':
            case '\r':
				bbs.menu("437");
                //if (file_exists(conf.DDReader)) 
				//	bbs.exec('?' + conf.DDReader + DDconfig);
				//else
                    bbs.list_msgs();
				bbs.menu(conf.fontcode);
                break;
			case 'Y':
			case 'S':
                // will use DDMesgReader if installed as Loadable module
                bbs.menu("437");
                console.print(color.alert + " Scan for Messages Posted to You \1n\r\n");
                bbs.scan_subs(SCAN_TOYOU);
				bbs.menu(conf.fontcode);
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
        //bbs.nodesync();
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)

		mystPrompt('Scores');
		
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('scores');
				}
				break;
            // NAVIGATE GROUPS/SUBS
            case 'B':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bbslink")
				break;
            case 'C':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js coa")
				break;
            case 'D':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js party")
				break;
			case 'L':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js local")
				break;
            case 'N':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bulletins")
				break;
            case 'S':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js news")
				break;
            case 'R':
				bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js rss")
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
        //bbs.nodesync();
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)

		mystPrompt('System');

        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('system');
				}
				break;
            //options and commands to perform
            case 'L':
                bbs.exec('*myst_lastcallers.js');
				console.pause();
                break;
            case 'Q':
                return;
			case 'S':
                console.clear();
                bbs.sys_info();
                break;
            case 'U':
                mystHeaderFooter('header','hdr-userlist');
                bbs.list_users();
                console.line_counter = 1;
                break;
            case 'V':
                console.clear();
                bbs.ver();
                break;
			case 'W':
                mystHeaderFooter('header','hdr-online');
				bbs.list_nodes();
				console.pause();
                break;
            case 'Y':
				mystHeaderFooter('header','hdr-userinfo');
                //mystMenu('userinfo');
				bbs.user_info();
				break;
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
        //bbs.nodesync()
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)
		
		mystPrompt('Chat');
		
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('chat');
				}
				break;
			case 'C':
                bbs.exec_xtrn('C0ACHAT');
                break;
			case 'T':
                console.crlf();
                bbs.exec('?sbbsimsg.js');
                break;
            case 'L':
                bbs.multinode_chat();
                break;
            case 'M':
              bbs.exec_xtrn('MRCCHAT');
              break;
    		case 'N':
			case 'S':
				if (system.operator_available) {
					console.putmsg(color.bright);
					bbs.page_sysop();
					bbs.exec("?pushover page");
					sleep(500);
					console.putmsg(color.bright + ' ...');
					sleep(500);
					console.putmsg(color.normal + ' ...');
					sleep(500);
					console.putmsg(color.bright + ' ... \1n\r\n\r\n');
					sleep(500);
					console.putmsg(" " + color.alert + "Sysop has been paged\1n\r\n");
					sleep(1000);
				} else {
					console.putmsg(" " + color.alert + "Sysop is not available.\1n\r\n")
					sleep(1000);
				}
                break;
            case 'P':
                bbs.private_chat();
                break;
            case 'Q':
                return;
			case 'I':
                if (user.compare_ars("GUEST")) {
                    console.clear();
                    alert("Can't access as guest.");
                    console.pause();
                    return;
                }
                console.clear();
                console.crlf(2);
				mystMenu("irc");
           
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
			default:
				break;
        } // end switch
    } // while online
    return; // RETURN TO MAIN (to have last caller processed if user hangs up)
} // end chat


function emailMenu() {
    while (bbs.online) {
		  if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) 
            return;
        bbs.node_action = NODE_RMAL;
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)
		
		mystPrompt('mail')
		
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('mail');
				}
				break;
            case 'F':
                console.clear();
                bbs.email(1,subject='Feedback');
                break;
			case 'O':
                bbs.node_action = NODE_RSML;
                bbs.nodesync();
				bbs.menu("437");
				bbs.read_mail(MAIL_SENT, user.number, LM_REVERSE);
				bbs.menu(conf.fontcode);
                break;
            case 'Q':
                return;
			case 'R':
				bbs.menu("437");
				bbs.read_mail(MAIL_YOUR, user.number);
				bbs.menu(conf.fontcode);
                break;
            case 'S':
                bbs.node_action = NODE_SMAL;
                bbs.nodesync();
                console.print("\r\n " + color.alert + "E-mail (User name or number):\1n ");
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
        //bbs.nodesync();
        //bbs.menu(conf.fontcode); // reset font type (moved to mystPrompt)
		
		mystPrompt('Xfer');
        
        var key = console.getkey(K_NOECHO).toUpperCase();
        bbs.log_key(key);
        switch (key) {
			case '/': // FOR /F /N /R /J
                console.putmsg('/');
				slashMenu(console.getkeys('?/1!AMCODFNXSTQ',1));
                break;
			case '?':
				if(user.settings & USER_EXPERT) {
				console.clear();
				mystMenu('xfer');
				}
				break;           
                // LOG OUT
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
                // FIND TEXT IN POSTS
            case 'D':
                console.print("\r\n " + color.alert + "Download File(s)\1n\r\n");
                if(bbs.batch_dnload_total>0) {
                    if(console.yesno(bbs.text(646))) {
                        bbs.batch_download();
                        break;
                    }
                }
                break;
			case 'F':
                console.print(color.alert + "Find Text in File Descriptions (no wildcards)\r\n");             
                bbs.scan_dirs(FL_FINDDESC);
                break;
			case 'I':
                console.print(color.alert + "Directory Information\1n\r\n");             
                bbs.dir_info();
                break;				
            case 'G':
            case 'J':
				bbs.exec('?DDFileAreaChooser.js');
				console.pushxy();
				console.clear();
				console.popxy();
                break;
            case 'L':               
            case '\r':
                // will use DDMesgReader if installed as Loadable module
               bbs.list_files();
                break;
                // SCAN FOR NEW MESSAGES
            case 'N':
                // will use DDMesgReader if installed as Loadable module
                console.print(color.alert + "New File Scan \1n\r\n");
                bbs.scan_dirs(FL_ULTIME);
                break;
            case 'O':
                logOff();
                break;
			case 'Q':
                mainMenu();
                return;
			case 'S':
                console.print(color.alert + "Search Text in File Names. \1n\r\n");
                bbs.scan_dirs(FL_NO_HDR);
                break;
                // SLASH AND COLON MENUS
                // UPLOAD FILE IN CURRENT GROUP
            case 'U':
                bbs.upload_file();
                break;
                // QUIT
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
        mystMenu('slash');
        console.pause();
        break;
	case '/': // FOR /F /N /R /J
	    mystMenu('2slash');
		console.putmsg(' ' + color.alert + 'Two-Slash Menu:\1n //');
		//var keyword = console.getstr(maxlen=7).toUpperCase();
		twoSlashMenu(console.getstr(maxlen=7,mode=K_NOCRLF).toUpperCase());
        break;
    case '1':
    case '!':
		bbs.exec('*d1liner');
        break;
	case 'A':
		bbs.exec('?avatar_chooser');
		break;
	case 'M':
	case 'C':
		bbs.exec_xtrn('MRCCHAT');		
		break;
    case 'O':
        logOffFast();
        break;
        // SYSTEM MENU
    case 'D':
        bbs.xtrn_sec();
        break;
    case 'F':
        xferMenu();
        break;
    case 'N':
		bbs.menu("437");
		console.print(format("%s New Scan ALL \1n\r\n",color.alert));
		console.print(format("%s New Message Scan \1n\r\n",color.alert));
        bbs.scan_subs(SCAN_NEW, all = true);
		console.print(format("%s New File Scan \1n\r\n",color.alert));
		bbs.scan_dirs(FL_ULTIME,all=true);
        bbs.menu(conf.fontcode);
        break;
    case 'X':
        user.settings ^= USER_EXPERT;
        break;
    case 'R':
		bbs.scan_msgs();
        break;		
	case 'S':
		scoresMenu();
		break;
    case 'T':
        bbs.exec('?filearea-lb.js')
		break;
    case 'Q':
         bbs.qwk_sec();
        break;
	case '\r':
        return;
    default:
        alert(' NOT VALID');
        console.pause();
        break;
    }
}

function twoSlashMenu(option) {
    switch (option) {
    case '?':
	case 'HELP':
		mystMenu('2Slash');
        console.pause();
        return;
		// GAME SERVERS
	case 'AUTO':
			bbs.auto_msg();
		break;
    case 'BCR':
		activity.doors = 'D';
		bbs.exec_xtrn('BCRGAMES'); // BCR game server
        break;
		case 'BBSLINK':
		activity.doors = 'D';
		mystMenu('437');
		bbs.exec_xtrn('BLMENU'); // BBS Link game server
        break;
    case 'DPARTY':
		activity.doors = 'D';
		bbs.exec_xtrn('DPDOORS');; // DP game server
        break; 
    case 'EXODUS':
		activity.doors = 'D';
		bbs.exec_xtrn('EXODUSGA'); // Exodus game server
        break;
    case 'BBSLIST':
		bbs.exec('?sbbslist'); // BBSLIST
        break;		
		// BBS Extended Menu
	case 'COVID':
		bbs.exec("?ctracker.js"); // covid tracker
        break;
	case 'FILES':
	case 'ARCHAIC':
    	bbs.menu("437");
		bbs.exec('*telgate archaicnet.archaicbinary.net:8523'); // ArchaicNET
		bbs.menu(conf.fontcode);
        break;
    case 'FMK':
		activity.fmk = 'K';
		bbs.exec('?/sbbs/xtrn/fmk/fmk.js'); // Fuck Marry Kill
        break;
	case 'LAST':
        bbs.exec('*myst_lastcallers.js');
		console.gotoxy(1,24);
		console.pause();
        break;
	case 'NEWS':
		bbs.exec('?rss2'); // rss news
        break;
	case 'RELOG':
		bbs.exec('?logonevent'); // re-run logon event
        break;
	case 'RUMORS':
        bbs.exec('*rumors addrumor');
        break;
	case 'WHO':q
        mystHeaderFooter('header','hdr-online');
        bbs.list_nodes();
		console.gotoxy(1,24);
		console.pause();
        break;
    case 'WMATA':
		bbs.exec_xtrn('WMATA'); // WMATA
        break;
    default:
        alert('NOT VALID');
        console.pause();
        break;
    }
}
/*****************************************************************
                                          LAST 10 CALLER FUNCTIONS
*****************************************************************/


function setActivityFlags() {
	
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
	
	if (activity.fmk == 'K')
		user.security.flags1|=UFLAG_K;

	if (activity.hungup == 'H')
		user.security.flags1|=UFLAG_H;
	
	if (activity.gfiles == 'T')
		user.security.flags1|=UFLAG_T;
	
	console.write("Setting up flags...\r\n");
	bbs.exec('?/sbbs/xtrn/twitter/tweet.js ' + user.alias + ' has logged off the BBS. #bbslogoff');

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