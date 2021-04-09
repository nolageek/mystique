load("myst_functions.js");
load("sbbsdefs.js");
load("myst_settings.js");
load("myst_colors.js");


function defaults(page) {
var userprops = load({}, 'userprops.js');
	
	var pronouns = userprops.get('USER_PROFILE', 'pronouns', undefined, user.number);
	if (pronouns == undefined) 
		userprops.set('USER_PROFILE', 'pronouns', ' ', user.number);
	
	var msglist = userprops.get('USER_LOADABLE_MODULES', 'list_msgs', undefined, user.number);
    if (msglist == undefined) 
		userprops.set('USER_LOADABLE_MODULES', 'list_msgs', 'DDReader', user.number);
		


    if (user.compare_ars('GUEST')) {
        alert('Guest access restricted.');
        console.pause();
        return;
    }
//    if (thisShell.toUpperCase() != user.command_shell.toUpperCase()) {
//        return;
//    }
    
    var defPage = '1';
    if (page) {
    defPage = page;
    }
    
while (bbs.online) {
    
    if (defPage == '1') {
                console.clear();
            mystMenu(conf.fontcode);
			console.print(format("%sSettings for \1h\1w%s #%d%s, Page %s1\r\n"
					,color.normal
					,user.alias
					,user.number
					,color.normal
					,color.bright));
					
            console.putmsg(lpad(m_color.WHITE + 'USER ACCOUNT SETTINGS\1n',64));
            console.crlf();
            console.putmsg(bracket('A') + color.normal + ' Terminal Modes' + color.bright + '                 : \1n');
            console.putmsg((user.settings & USER_AUTOTERM) ? color.bright + 'AUTO\1n/' : color.dark + 'AUTO\1n/');
            console.putmsg((user.settings & USER_ANSI) ? color.bright + 'ANSI\1n/' : color.dark + 'TTY\1n/ ');
            console.putmsg((user.settings & USER_COLOR) ? color.bright + 'COLOR\1n/' : color.dark + 'MONO \1n/');
            console.putmsg((user.settings & USER_MOUSE) ? color.bright + 'MOUSE\1n/' : color.dark + 'MOUSE\1n/');
			console.putmsg((user.settings & USER_NO_EXASCII) ? color.dark + 'ASCII\1n/' : color.bright + 'EXTASCII\1n/');
			console.putmsg((user.settings & USER_ICE_COLOR) ? color.bright + '\1i\1k\x013ICE\1n' : color.dark + 'ICE\1n');
			//console.putmsg((user.settings & USER_UF8) ? color.dark + 'UF8 \1n' : ' \1n');
            console.crlf();
            console.putmsg(bracket('B') + color.normal + ' External Editor' + color.bright + '                : \1n');
            console.putmsg(color.bright + xtrn_area.editor[user.editor].name);
            console.crlf();
            console.putmsg(bracket('C') + color.normal + ' Screen Length' + color.bright + '                  : \1n');
            if (user.screen_rows)
                var screenrows = user.screen_rows;
            else
				var screenrows = color.bright + 'Auto Detect ' + color.bright + '(' + color.normal + console.screen_rows + color.bright + ')';
            
            console.putmsg(color.bright + screenrows);
            console.crlf();

            console.putmsg(bracket('D') + color.normal + ' Current Command Shell' + color.bright + '          : \1n');
            console.putmsg(color.bright + user.command_shell.toUpperCase());
            console.crlf();

            console.putmsg(bracket('E') + color.normal + ' Expert Mode' + color.bright + '                    : \1n');
            console.putmsg((user.settings & USER_EXPERT) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('F') + color.normal + ' Screen Pause' + color.bright + '                   : \1n');
            console.putmsg((user.settings & USER_PAUSE) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('G') + color.normal + ' Hot Keys' + color.bright + '                       : \1n');
            console.putmsg((user.settings & USER_COLDKEYS) ? color.dark + 'OFF\1n' : color.bright + 'ON\1n');
            console.crlf();
            console.putmsg(bracket('H') + color.normal + ' Spinning Cursor' + color.bright + '                : \1n');
            console.putmsg((user.settings & USER_SPIN) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('I') + color.normal + ' Default to Quiet Mode' + color.bright + '          : \1n');
            console.putmsg((user.settings & USER_QUIET) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('J') + color.normal + ' Fast Login Default Option' + color.bright + '      : \1n');
            console.putmsg((user.security.flags2 & UFLAG_F) ? color.bright + 'YES\1n' : color.dark + 'NO\1n');
            console.crlf();
			var secret = userprops.get('2FA', 'htop_secret', undefined, user.number);
			if (secret)
                var twofa = secret;
            else
				var twofa = color.bright + 'NOT CONFIGURED';
			console.putmsg(bracket('P') + color.normal + ' 2FA' + color.bright + '                            : ' + twofa + '\1n');
			console.crlf();
            console.putmsg(lpad(m_color.WHITE + 'USER PROFILE SETTINGS\1n',64));
            console.crlf();
			// [K] Update Location/Affiliations
            console.print(format("%s %sUpdate Location/Affiliations%s%-3s: \1n"
					,bracket('K')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg(color.bright + user.location + '\1n\r\n');

			// [L] Change Password
            console.print(format("%s %sChange Password\1n\r\n"
					,bracket('L')
					,color.normal));

			// [M] Change Internet E-mail
            console.print(format("%s%s Change Internet E-mail %s%-8s: \1n"
					,bracket('M')
					,color.normal
					,color.bright
					,conf.spacer));
			console.putmsg(color.bright + user.netmail + '\1n\r\n');
			
			// [-] Local Email (READ ONLY) 
//			console.print(format("%s%s Local Email %s(READ ONLY)%s%-8s: \1n"
//					,bracket(color.normal + '-')
//					,color.normal
//					,color.dark
//					,color.bright
//					,conf.spacer));
 //           console.putmsg(color.dark + user.email + '\1n\r\n');

			// [N] Update Signature
            console.print(format("%s %sUpdate Signature\1n\r\n"
					,bracket('N')
					,color.normal));
					
			// [-] Birthdate (READ ONLY)
			console.print(format("%s%s Birthdate %s(READ ONLY)%s%-10s: \1n"
					,bracket(color.normal + '-')
					,color.normal
					,color.dark
					,color.bright
					,conf.spacer));
            console.putmsg(color.dark + user.birthdate + '\1n');
            console.putmsg(color.bright + ' (' + color.normal + user.age + color.bright + ') \1n\r\n');

			// [O] Change Gender
			console.print(format("%s %sGender Identity%s%-16s: \1n"
					,bracket('O')
					,color.normal
					,color.bright
					,conf.spacer));
					pronouns1 = userprops.get('USER_PROFILE', 'pronouns', pronouns, user.number);
					console.putmsg(color.bright + user.gender + ' ' + bracket(pronouns1) + '\1n');

            // [FOOTER - PAGE ONE]
            console.gotoxy(1, 22);
			console.print(format('%s %suit %s%s To Switch Pages.\r\n\r\n'
						,bracket('Q')
						,color.normal
						,bracket('ARROWS' + color.dark + ',' + color.bright + '#')
						,color.normal));
						
			mystPrompt('Defaults');
            //console.putmsg(color.t_user + user.alias + color.bright + '@' + color.t_menu + 'Defaults Menu' + color.bright + ': \1n');
            var key = console.getkey(K_NOECHO).toUpperCase();
            bbs.log_key(key);
            switch (key) {
                // USER OPTIONS
            case 'A':
                //TERMINAL MODE SELECT
                console.crlf();
                if (console.yesno(color.bright + 'Use automatic terminal type detection')) {
                    user.settings |= USER_AUTOTERM;
                } else {
                    user.settings &= ~USER_AUTOTERM;
                    if (console.yesno(color.bright + 'Does your terminal support ANSI')) {
                        user.settings |= USER_ANSI;
                    } else {
                        user.settings &= ~USER_ANSI;
                    }
                }

                if (console.yesno(color.bright + 'Do you have a color terminal')) 
                    user.settings |= USER_COLOR;
                else 
                    user.settings &= ~USER_COLOR;
				
				//if (console.yesno(color.bright + 'Does your terminal support UF8')) 
                //    user.settings |= USER_UF8;
                //else 
                //			user.settings &= ~USER_UF8;
                

                if (console.yesno(color.bright + 'Does your terminal support Mouse Tracking')) 
                    user.settings |= USER_MOUSE;
                else 
                   user.settings &= ~USER_MOUSE;
				
				
                if (console.yesno(color.bright + 'Does your terminal support Ice Colors\r\n (i.e. \1i\1k\x013this text\1n' + color.bright + ' is black on yellow and NOT BLINKING)')) 
                    user.settings |= USER_ICE_COLOR;
                else 
                    user.settings &= ~USER_ICE_COLOR;
				
				if (console.yesno(color.bright + 'Does your terminal support IBM extended ASCII')) 
                    user.settings &= ~USER_NO_EXASCII;
                else 
                    user.settings |= USER_NO_EXASCII;
                

                break;
            case 'B':
                // EXTERNAL EDITOR SELECT
                bbs.select_editor();
                break;
            case 'C':
                // SCREEN LENGTH SELECT 
                console.crlf();
                if (console.yesno(color.bright + 'Auto Detect screen row length')) {
                    user.screen_rows = '';
                } else {
                    console.putmsg(color.bright + 'How many rows does your terminal support?');
                    var rows = console.getstr('', 2);
                    if (rows) {
                        user.screen_rows = rows;
                    }
                }
                break;
            case 'D':
                // COMMAND SHELL SELECT
                bbs.select_shell();
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
            case 'I':
                user.settings ^= USER_QUIET;
                break;
            case 'J':
                user.security.flags2 ^= UFLAG_F
                break;
			case 'K':
                var lastlocation = user.location;
                console.crlf(2);

                console.putmsg(color.bright + 'Currently: ' + color.bright + lastlocation);
                console.crlf();
                console.putmsg(bracket('?') + color.bright + ' Enter your location / group affiliations\1w: ');
                var str;
                var location = console.getstr('',20);
                if (!location || !location.length)
                    location = lastlocation;
                bbs.log_str(' ' + location);
                user.location = location;
                break;
			case 'L':
                console.crlf(2);

                alert(color.bright + 'Current password: ' + color.bright + user.security.password.toUpperCase());
                console.crlf();
                if (!console.noyes(color.bright + 'Would you like to change your password')) {
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
			case 'M':
                var lastnetmail = user.netmail;
                console.crlf(2);

                console.putmsg(color.bright + 'Currently: ' + color.bright + lastnetmail);
                console.crlf();
                console.putmsg(bracket('?') + color.bright + ' Enter Your Internet E-mail Address\1w: ');
                var netmail = console.getstr();
                if (!netmail || !netmail.length)
                    var netmail = lastnetmail;

                bbs.log_str("  " + netmail);
                user.netmail = netmail;
                break;
            case 'N':
                console.crlf();
                console.editfile(format('%suser/%04d.sig', system.data_dir, user.number));
                break;
            case 'O':
                var lastgender = user.gender;
                console.crlf(2);
                console.putmsg(color.bright + 'Currently: ' + color.bright  + lastgender);
                console.crlf();
                console.putmsg(bracket('?') + color.bright + ' Enter Your Gender Identity\1w: ');
   
                var gender = console.getstr('', 1, K_UPPER);
                if (!gender || !gender.length)
                    var gender = lastgender;
                user.gender = gender;
				
				var lastpronouns = pronouns;
				console.crlf(2);
				console.putmsg(color.bright + 'Currently: ' + color.bright  + lastpronouns);
                console.crlf();
				console.putmsg(bracket('?') + color.bright + ' Enter Your preferred pronouns\1w: ');
				var newpronouns = console.getstr('', 15, K_UPPER);
				if(newpronouns == undefined)
					newpronouns = " ";
				userprops.set('USER_PROFILE', 'pronouns', newpronouns, user.number);
                break;
			case 'P':
				console.crlf();
				if (secret)
					bbs.exec('?2fa.js disable')
				else
					bbs.exec('?2fa.js enable')
				break;
            case KEY_LEFT:
            case '3':
                defPage = '3';
                break;
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
        
    } else if (defPage == '2') {
    
            console.clear();
            // [HEADER - PAGE TWO]
			console.print(format("%sSettings for \1h\1w%s #%d%s, Page %s2\r\n"
					,color.normal
					,user.alias
					,user.number
					,color.normal
					,color.bright));
			
            console.putmsg(lpad(m_color.WHITE + 'CHAT SETTINGS\1n',56));
            console.crlf();
			
			// [A] Allow Paging
			console.print(format("%s %sAllow Paging%s%-19s: \1n"
					,bracket('A')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.chat_settings & CHAT_NOPAGE) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');
			
			// [B] Activity Alerts
			console.print(format("%s %sActivity Alerts%s%-16s: \1n"
					,bracket('B')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.chat_settings & CHAT_NOACT) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');
			
			// [C] Private Split-Screen Chat
			console.print(format("%s %sPrivate Split-Screen Chat%s%-6s: \1n"
					,bracket('C')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.chat_settings & CHAT_SPLITP) ? '\1n\1cSPLIT SCREEN\001n\r\n' : '\1n\1cTRADITIONAL\001n\r\n');
			console.crlf();
            console.putmsg(lpad(m_color.WHITE + 'MESSAGE SCAN SETTINGS\1n',64));
            console.crlf();
			
			// [D] Ask For Your Un-read Msg Scan
			console.print(format("%s %sAsk For 'New Scan' At Login%s%-4s: \1n"
					,bracket('D')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_ASK_NSCAN) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');

			// [E] Ask For Your Un-read Msg Scan
			console.print(format("%s %sAsk For Your Un-read Msg Scan%s%-2s: \1n"
					,bracket('E')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_ASK_SSCAN) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');
			
			// [F] New Scan Configuration
			console.print(format("%s %sNew Scan Configuration\1n\r\n"
					,bracket('F')
					,color.normal));				
			
			// [G] Your "to-you" Message Scan Config
			console.print(format("%s %sYour 'to-you' Message Scan Config\1n\r\n"
					,bracket('G')
					,color.normal));				
			
			// [H] Re-init New Scan Pointers
			console.print(format("%s %sRe-init New Scan Pointers\1n\r\n"
					,bracket('H')
					,color.normal));			
			
			// [I] Set New Scan Pointers
			console.print(format("%s %sSet New Scan Pointers\1n\r\n"
					,bracket('I')
					,color.normal));
			console.crlf();
            console.putmsg(lpad(m_color.WHITE + 'MESSAGE READ SETTINGS\1n',64));
            console.crlf();
			
			// [J] Remember Current Sub-Board
			console.print(format("%s %sRemember Current Sub-Board%s%-5s: \1n"
					,bracket('J')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_CURSUB) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');
			
			// [K] Clear Screen Between Messages
            console.print(format("%s %sClear Screen Between Messages%s%-2s: \1n"
					,bracket('K')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_CLRSCRN) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');
			
			// [L] Forward Email to Netmail
			console.print(format("%s %sForward Email to Netmail%s%-7s: \1n"
					,bracket('L')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_NETMAIL) ? color.bright + 'ON\1n\r\n' : color.dark + 'OFF\1n\r\n');
			// [M] Forward Email to Netmail
			console.print(format("%s %sDefault Msg Lister%s%-13s: \1n"
					,bracket('M')
					,color.normal
					,color.bright
					,conf.spacer));
			msglist = userprops.get('USER_LOADABLE_MODULES', 'list_msgs', undefined, user.number);
            console.putmsg((msglist == 'msglist') ? color.dark + 'Synchronet Default (msglist)\1n\r\n' : color.bright + 'DDMsgReader\1n\r\n');
			

            console.gotoxy(1, 22);
			console.print(format('%s %suit %s%s To Switch Pages.\r\n\r\n'
						,bracket('Q')
						,color.normal
						,bracket('ARROWS' + color.dark + ',' + color.bright + '#')
						,color.normal));

            mystPrompt('Defaults');
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
            case 'L':
                user.settings ^= USER_NETMAIL;
                break;
            case 'M':
				if (msglist == 'msglist')
					userprops.set('USER_LOADABLE_MODULES', 'list_msgs', 'DDReader', user.number);
				else
					userprops.set('USER_LOADABLE_MODULES', 'list_msgs', 'msglist', user.number);
                break;
            case KEY_RIGHT:
		    case '3':
                defPage = '3';
                break;
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
    } else if (defPage == '3') {
		console.clear();
            // [HEADER - PAGE THREE]
			console.print(format("%sSettings for \1h\1w%s #%d%s, Page %s3\r\n"
					,color.normal
					,user.alias
					,user.number
					,color.normal
					,color.bright));
			
            console.putmsg(lpad(m_color.WHITE + 'APPEARANCE PREFERENCES\1n',65));
			console.crlf();
			// [A] Random Case
            console.putmsg(bracket('A') + color.normal + mystRandomCase(' RaNDOm CAsE') + color.bright + '                    : \1n');
            console.putmsg((user.security.flags2 & UFLAG_R) ? color.bright + 'YES\1n' : color.dark + 'NO\1n');
			console.crlf();
			// [B] Leet Case
            console.putmsg(bracket('B') + color.normal + mystLeetCase(' lEET cASE') + color.bright + '                      : \1n');
            console.putmsg((user.security.flags2 & UFLAG_E) ? color.bright + 'YES\1n' : color.dark + 'NO\1n');
			console.crlf();
			// [C] Random Color
            console.putmsg(bracket('C') + mystRandomColor(' Random Color') + color.bright + '                   : \1n');
            console.putmsg((user.security.flags2 & UFLAG_B) ? color.bright + 'YES\1n' : color.dark + 'NO\1n');
			console.crlf();
			// [D] Leet Color
			console.putmsg(bracket('D') + mystLeetColor(' Leet Color') + color.bright + '                     : \1n');
            console.putmsg((user.security.flags2 & UFLAG_C) ? color.bright + 'YES\1n' : color.dark + 'NO\1n');
			console.crlf();
			// [E] Regular Color
            console.putmsg(bracket('E')  + ' Reset Text' + color.bright + '                     : \1n');
            console.putmsg((user.security.flags2 & UFLAG_G) ? color.bright + 'YES\1n' : color.dark + 'NO\1n');
			console.crlf(2);
			console.putmsg(color.normal + mystText(" This is a piece of sample text."));
			//console.crlf(2);
			//console.putmsg(LIGHTGRAY + " Cannot reset text while Random or Leet case is enabled.")
			console.crlf(2);
            console.putmsg(lpad(m_color.WHITE + 'FILE AREA OPTIONS\1n',60));
            console.crlf();
			// [F] Default Download Protocol
			console.print(format("%s %sDefault Download Protocol%s%-6s: \1n"
					,bracket('F')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg('\1n\1c' + user.download_protocol + '-Modem');
			console.crlf();
			// [G] Auto New File Scan At Login
			console.print(format("%s %sAuto New File Scan At Login%s%-4s: \1n"
					,bracket('G')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_ANFSCAN) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');
			console.crlf();
			// [H] Batch Download File tagging
			console.print(format("%s %sBatch Download File tagging%s%-4s: \1n"
					,bracket('H')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_BATCHFLAG) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');
			console.crlf();
			// [I] Batch Download File tagging
			console.print(format("%s %sSet New-Scan From-Date%s%-9s: \1n"
					,bracket('I')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg(user.new_file_time);
			console.crlf();
			// [J] Batch Download File tagging
			console.print(format("%s %sToggle Extended Descriptions%s%-3s: \1n"
					,bracket('J')
					,color.normal
					,color.bright
					,conf.spacer));
            console.putmsg((user.settings & USER_EXTDESC) ? color.bright + 'ON\1n' : color.dark + 'OFF\1n');			

            console.gotoxy(1, 22);
			console.print(format('%s %suit %s%s To Switch Pages.\r\n\r\n'
						,bracket('Q')
						,color.normal
						,bracket('ARROWS' + color.dark + ',' + color.bright + '#')
						,color.normal));

            mystPrompt('Defaults');
            var key = console.getkey(K_NOECHO).toUpperCase();
            bbs.log_key(key);
            switch (key) {
            case 'A': // RANDOM CASE
				user.security.flags2 ^= UFLAG_R;
				user.security.flags2 &=~ UFLAG_E;
				if(!(user.security.flags2&UFLAG_B) && !(user.security.flags2&UFLAG_C)) 
					user.security.flags2 ^= UFLAG_B;
				break;
            case 'B': // lEET cASE
                user.security.flags2 ^= UFLAG_E;
				user.security.flags2 &=~ UFLAG_R;
				if(user.security.flags2&UFLAG_G)
					user.security.flags2 ^= UFLAG_G;
				if(!(user.security.flags2&UFLAG_G) && !(user.security.flags2&UFLAG_B) && !(user.security.flags2&UFLAG_C)) 
					user.security.flags2 ^= UFLAG_C;
                break;
            case 'C': // RANDOM COLOR
                user.security.flags2 ^= UFLAG_B;
				user.security.flags2 &=~ UFLAG_C;
				if((user.security.flags2&UFLAG_R || user.security.flags2&UFLAG_E) && (!(user.security.flags2&UFLAG_B))) 
					user.security.flags2 ^= UFLAG_B;
                break; // LEET COLOR
            case 'D':
                user.security.flags2 ^= UFLAG_C;
				user.security.flags2 &=~ UFLAG_B;
				if((user.security.flags2&UFLAG_R || user.security.flags2&UFLAG_E) && (!(user.security.flags2&UFLAG_C)))
					user.security.flags2 ^= UFLAG_C;
                break;				
            case 'E': // CLEAR ALL
                user.security.flags2 &=~ UFLAG_G;
				user.security.flags2 &=~ UFLAG_R;
				user.security.flags2 &=~ UFLAG_E;
				user.security.flags2 &=~ UFLAG_B;
				user.security.flags2 &=~ UFLAG_C;
                break;
           /* case 'F':
                user.settings ^= USER_ANFSCAN;
                break;*/
            case 'G':
                user.settings ^= USER_ANFSCAN;
                break;
            case 'H':
                user.settings ^= USER_BATCHFLAG;
                break;
			case 'I':
				user.new_file_time=bbs.get_newscantime(bbs.new_file_time);
				break;
			case 'J':
				user.settings ^= USER_EXTDESC;
				break;
			case KEY_RIGHT:
            case '1':
                defPage = '1';
				break;
			case KEY_LEFT:
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
			
    } 
}
    return;
}

var page = '1';
if (argv[0])
	page = argv[0];



defaults(page);
