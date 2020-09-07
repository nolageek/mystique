load("sbbsdefs.js");
load("myst_settings.js");

// test for menu in user.command_shell directory, if not found use mystique version.


function mystMenu(file) {
     //checks current command_shell directory for file name, if doesn't exist, 
	 // use mystique dir.
    var ansiDir = '/sbbs/text/menu/' + user.command_shell + '/';
	if (file == "mesg" && file_exists(ansiDir + bbs.curgrp + "-" + file + '*.*')) 
		file = bbs.curgrp + "-" + file + '*.*';
    if (!file_exists(ansiDir + file + '*.*')) 
		var ansiDir = '/sbbs/text/menu/mystique/';  
    var random_list = directory(ansiDir + file + '*.*') //returns an array of filenames from ansiDir
    if (random_list.length)  //if there are files in the directory
        file = file_getname(random_list[random(random_list.length)]).slice(0, -4);
    if (file_exists(ansiDir + file + '*.*'))
		bbs.menu(ansiDir + file);
	else alert("No file found -  " + ansiDir + file)
}


function mystHeader(file) {
		if (!file_exists(system.text_dir + '/menu/' + user.command_shell + '/' + file + '.ans'))
			file = 'header';
		mystMenu(file);
}

function mystPrompt(menuname) {
	
		if(!(user.settings & USER_EXPERT)) 
        mystMenu(menuname);
		
		if (menuname == "Mesg"){
			menuname = "Message";
		console.gotoxy(1,23);
		console.clearline();
		console.putmsg(' ' + bracket('@GN@' ) + color.normal + ' @GRP@' + color.dark + ' - ' + bracket('@SN@') + ' @SUBL@\1n');
		}
		
		if (menuname == "Xfer"){
		menuname = "Transfer";
		console.gotoxy(1,23);
		console.clearline();
		console.putmsg(' ' + bracket('@LN@') + color.normal + ' @LIB@' + color.dark + ' - ' + bracket('@DN@') + color.bright + ' @DIRL@\1n');
		}
		
		if(user.settings & USER_EXPERT) 
        var xpert=".xpert " + bracket("?=menu");
		else
		var xpert="";
	
		console.gotoxy(1,24);

		console.clearline();
		var prompt = format(" %s" + user.alias + "%s > %s" + menuname + "_Menu%s%s %s>%s>%s> \1n"
				,color.bright
				,color.dark
				,color.normal
				,color.dark
				,xpert
				,color.bright
				,color.normal
				,color.dark);
				
		console.print(prompt.toMystText());
		
}

function bracket(string) {
	bracketed = color.dark + '[' + color.bright + string + color.dark + ']';
	return bracketed;
}

//pads left
function lpad(str, length, padString) {
    if (!padString)
            var padString = ' ';
    if (str.length > length)
        str = str.substring(0, length);
    while (str.length < length)
        str = padString + str;
    return str;
}

 
//pads right
function rpad(str, length, padString) {
    if (!padString)
            var padString = ' ';
    if (str.length > length)
        str = str.substring(0, length);
    while (str.length < length)
        str = str + padString;
        
    return str;
}


function timeSince(ts){
    now = new Date();
    ts = new Date(ts*1000);
    var delta = now.getTime() - ts.getTime();

    delta = delta/1000; //us to s

    var ps, pm, ph, pd, min, hou, sec, days;

    if(delta<=59){
        return delta+"s";
    }

    if(delta>=60 && delta<=3599){
        min = Math.floor(delta/60);
        sec = delta-(min*60);
        return min+"m";
    }

    if(delta>=3600 && delta<=86399){
        hou = Math.floor(delta/3600);
        min = Math.floor((delta-(hou*3600))/60);
        return  hou +"h " + min + "m";
    } 

    if(delta>=86400){
        days = Math.floor(delta/86400);
        hou =  Math.floor((delta-(days*86400))/60/60);
        return days+"d "+hou+"h";
    }
	
	}
	
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
			console.print(format("%sSettings for \1h\1w%s #%d%s, Page %s1\r\n"
					,color.d_txt
					,user.alias
					,user.number
					,color.d_txt
					,color.t_txt2));
					
            console.putmsg(lpad(color.d_head + 'USER ACCOUNT SETTINGS\1n',64));
            console.crlf();
            console.putmsg(bracket('A') + color.d_txt + ' Terminal Modes' + color.t_txt2 + '                 : \1n');
            console.putmsg((user.settings & USER_AUTOTERM) ? color.d_on + 'AUTO\1n/' : color.d_off + 'AUTO\1n/');
            console.putmsg((user.settings & USER_ANSI) ? color.d_on + 'ANSI\1n/' : color.d_off + 'TTY\1n/ ');
            console.putmsg((user.settings & USER_COLOR) ? color.d_on + 'COLOR\1n/' : color.d_off + 'MONO \1n/');
            console.putmsg((user.settings & USER_MOUSE) ? color.d_on + 'MOUSE\1n/' : color.d_off + 'MOUSE\1n/');
			console.putmsg((user.settings & USER_NO_EXASCII) ? color.d_off + 'ASCII\1n/' : color.d_on + 'EXTASCII\1n/');
			console.putmsg((user.settings & USER_ICE_COLOR) ? color.d_on + '\1i\1k\x013ICE\1n' : color.d_off + 'ICE\1n');
			//console.putmsg((user.settings & USER_UF8) ? color.d_off + 'UF8 \1n' : ' \1n');
            console.crlf();
            console.putmsg(bracket('B') + color.d_txt + ' External Editor' + color.t_txt2 + '                : \1n');
            console.putmsg(color.d_value + xtrn_area.editor[user.editor].name);
            console.crlf();
            console.putmsg(bracket('C') + color.d_txt + ' Screen Length' + color.t_txt2 + '                  : \1n');
            var screenrows;
            if (user.screen_rows) {
                screenrows = user.screen_rows;
            } else {
                screenrows = color.d_value + 'Auto Detect ' + color.t_sym + '(' + color.t_sym2 + console.screen_rows + color.t_sym + ')';
            }
            console.putmsg(color.d_value + screenrows);
            console.crlf();

            console.putmsg(bracket('D') + color.d_txt + ' Current Command Shell' + color.t_txt2 + '          : \1n');
            console.putmsg(color.d_value + user.command_shell.toUpperCase());
            console.crlf();

            console.putmsg(bracket('E') + color.d_txt + ' Expert Mode' + color.t_txt2 + '                    : \1n');
            console.putmsg((user.settings & USER_EXPERT) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('F') + color.d_txt + ' Screen Pause' + color.t_txt2 + '                   : \1n');
            console.putmsg((user.settings & USER_PAUSE) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('G') + color.d_txt + ' Hot Keys' + color.t_txt2 + '                       : \1n');
            console.putmsg((user.settings & USER_COLDKEYS) ? color.d_off + 'OFF\1n' : color.d_on + 'ON\1n');
            console.crlf();
            console.putmsg(bracket('H') + color.d_txt + ' Spinning Cursor' + color.t_txt2 + '                : \1n');
            console.putmsg((user.settings & USER_SPIN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('I') + color.d_txt + ' Default to Quiet Mode' + color.t_txt2 + '          : \1n');
            console.putmsg((user.settings & USER_QUIET) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('J') + color.d_txt + ' Fast Login Default Option' + color.t_txt2 + '      : \1n');
            console.putmsg((user.security.flags2 & UFLAG_F) ? color.d_on + 'YES\1n' : color.d_off + 'NO\1n');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'USER PROFILE SETTINGS\1n',64));
            console.crlf();
			// [K] Update Location/Affiliations
            console.print(format("%s %sUpdate Location/Affiliations%s%-3s: \1n"
					,bracket('K')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg(color.d_value + user.location + '\1n\r\n');

			// [L] Change Password
            console.print(format("%s %sChange Password\1n\r\n"
					,bracket('L')
					,color.d_txt));

			// [M] Change Internet E-mail
            console.print(format("%s%s Change Internet E-mail %s%-8s: \1n"
					,bracket('M')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
			console.putmsg(color.d_on + user.netmail + '\1n\r\n');
			
			// [-] Local Email (READ ONLY) 
            //console.putmsg(color.d_off + ' -  ' + color.d_txt + 'Local Email ' + color.d_off + '(READ ONLY)' + color.t_txt2 + '        : ');
			console.print(format("%s%s Local Email %s(READ ONLY)%s%-8s: \1n"
					,bracket(color.d_off + '-')
					,color.d_txt
					,color.d_off
					,color.t_txt2
					,conf.spacer));
            console.putmsg(color.d_off + user.email + '\1n\r\n');

			// [N] Update Signature
            console.print(format("%s %sUpdate Signature\1n\r\n"
					,bracket('N')
					,color.d_txt));

            console.putmsg(color.d_off + ' -  ' + color.d_txt + 'Birthdate ' + color.d_off + '(READ ONLY)' + color.t_txt2 + '          : ');
            console.putmsg(color.d_off + user.birthdate + '\1n');
            console.putmsg(color.t_sym + ' (' + color.t_sym2 + user.age + color.t_sym + ') \1n\r\n');

			// [O] Change Gender
			console.print(format("%s %sChange Gender%s%-18s: \1n"
					,bracket('O')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg(color.d_on + user.gender + '\1n');

            // [FOOTER - PAGE ONE]
            console.gotoxy(1, 22);
			console.print(format('%s %suit %s%s To Switch Pages.\r\n\r\n'
						,bracket('Q')
						,color.d_txt
						,bracket('ARROWS' + color.t_sym + ',' + color.t_sym2 + '#')
						,color.d_txt));
						
			mystPrompt('Defaults');
            //console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Defaults Menu' + color.t_sym + ': \1n');
            var key = console.getkey(K_NOECHO).toUpperCase();
            bbs.log_key(key);
            switch (key) {
                // USER OPTIONS
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

                if (console.yesno(color.t_ques + 'Do you have a color terminal')) 
                    user.settings |= USER_COLOR;
                else 
                    user.settings &= ~USER_COLOR;
				
				//if (console.yesno(color.t_ques + 'Does your terminal support UF8')) 
                //    user.settings |= USER_UF8;
                //else 
                //			user.settings &= ~USER_UF8;
                

                if (console.yesno(color.t_ques + 'Does your terminal support Mouse Tracking')) 
                    user.settings |= USER_MOUSE;
                else 
                   user.settings &= ~USER_MOUSE;
				
				
                if (console.yesno(color.t_ques + 'Does your terminal support Ice Colors\r\n (i.e. \1i\1k\x013this text\1n' + color.t_ques + ' is black on yellow and NOT BLINKING)')) 
                    user.settings |= USER_ICE_COLOR;
                else 
                    user.settings &= ~USER_ICE_COLOR;
				
				if (console.yesno(color.t_ques + 'Does your terminal support IBM extended ASCII')) 
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

                console.putmsg(color.d_value + 'Currently: ' + color.t_txt2 + lastlocation);
                console.crlf();
                console.putmsg(bracket('?') + color.t_ques + ' Enter your location / group affiliations\1w: ');
                var str;
                var location = console.getstr('',20);
                if (!location || !location.length)
                    location = lastlocation;
                bbs.log_str(' ' + location);
                user.location = location;
                break;
			case 'L':
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
			case 'M':
                var lastnetmail = user.netmail;
                console.crlf(2);

                console.putmsg(color.d_value + 'Currently: ' + color.t_txt2 + lastnetmail);
                console.crlf();
                console.putmsg(bracket('?') + color.t_ques + ' Enter Your Internet E-mail Address\1w: ');
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

                console.putmsg(color.d_value + 'Currently: ' + color.t_txt2  + lastgender);
                console.crlf();
                console.putmsg(bracket('?') + color.t_ques + ' Enter Your Gender\1w: ');
                var gender = console.getstr('', 1, K_UPPER);
                if (!gender || !gender.length)
                    var gender = lastgender;

                bbs.log_str("  " + netmail);
                user.gender = gender;
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
					,color.d_txt
					,user.alias
					,user.number
					,color.d_txt
					,color.t_txt2));
			
            console.putmsg(lpad(color.d_head + 'CHAT SETTINGS\1n',56));
            console.crlf();
			
			// [A] Allow Paging
			console.print(format("%s %sAllow Paging%s%-19s: \1n"
					,bracket('A')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.chat_settings & CHAT_NOPAGE) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');
			
			// [B] Activity Alerts
			console.print(format("%s %sActivity Alerts%s%-16s: \1n"
					,bracket('B')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.chat_settings & CHAT_NOACT) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');
			
			// [C] Private Split-Screen Chat
			console.print(format("%s %sPrivate Split-Screen Chat%s%-6s: \1n"
					,bracket('C')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.chat_settings & CHAT_SPLITP) ? '\1n\1cSPLIT SCREEN\001n\r\n' : '\1n\1cTRADITIONAL\001n\r\n');
			
            console.putmsg(lpad(color.d_head + 'MESSAGE SCAN SETTINGS\1n',64));
            console.crlf();
			
			// [D] Ask For Your Un-read Msg Scan
			console.print(format("%s %sAsk For 'New Scan' At Login%s%-4s: \1n"
					,bracket('D')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_ASK_NSCAN) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');

			// [E] Ask For Your Un-read Msg Scan
			console.print(format("%s %sAsk For Your Un-read Msg Scan%s%-2s: \1n"
					,bracket('E')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_ASK_SSCAN) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');
			
			// [F] New Scan Configuration
			console.print(format("%s %sNew Scan Configuration\1n\r\n"
					,bracket('F')
					,color.d_txt));				
			
			// [G] Your "to-you" Message Scan Config
			console.print(format("%s %sYour 'to-you' Message Scan Config\1n\r\n"
					,bracket('G')
					,color.d_txt));				
			
			// [H] Re-init New Scan Pointers
			console.print(format("%s %sRe-init New Scan Pointers\1n\r\n"
					,bracket('H')
					,color.d_txt));			
			
			// [I] Set New Scan Pointers
			console.print(format("%s %sSet New Scan Pointers\1n\r\n"
					,bracket('I')
					,color.d_txt));
			
            console.putmsg(lpad(color.d_head + 'MESSAGE READ SETTINGS\1n',64));
            console.crlf();
			
			// [J] Remember Current Sub-Board
			console.print(format("%s %sRemember Current Sub-Board%s%-5s: \1n"
					,bracket('J')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_CURSUB) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');
			
			// [K] Clear Screen Between Messages
            console.print(format("%s %sClear Screen Between Messages%s%-2s: \1n"
					,bracket('K')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_CLRSCRN) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');
			
			// [L] Forward Email to Netmail
			console.print(format("%s %sForward Email to Netmail%s%-7s: \1n"
					,bracket('L')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_NETMAIL) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');

            console.putmsg(lpad(color.d_head + 'FILE SCAN OPTIONS\1n',60));
            console.crlf();
			
			// [M] Default Download Protocol
			console.print(format("%s %sDefault Download Protocol%s%-6s: \1n"
					,bracket('M')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg('\1n\1c' + user.download_protocol + '-Modem\r\n');
			
			// [N] Auto New File Scan At Login
			console.print(format("%s %sAuto New File Scan At Login%s%-4s: \1n"
					,bracket('N')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_ANFSCAN) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n\r\n');
			
			// [O] Batch Download File tagging
			console.print(format("%s %sBatch Download File tagging%s%-4s: \1n"
					,bracket('O')
					,color.d_txt
					,color.t_txt2
					,conf.spacer));
            console.putmsg((user.settings & USER_BATCHFLAG) ? color.d_on + 'ON\1n\r\n' : color.d_off + 'OFF\1n');

            console.gotoxy(1, 22);
			console.print(format('%s %suit %s%s To Switch Pages.\r\n\r\n'
						,bracket('Q')
						,color.d_txt
						,bracket('ARROWS' + color.t_sym + ',' + color.t_sym2 + '#')
						,color.d_txt));

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
					,color.d_txt
					,user.alias
					,user.number
					,color.d_txt
					,color.t_txt2));
			
            console.putmsg(lpad(color.d_head + 'APPEARANCE PREFERENCES\1n',66));
			console.crlf();
			// [A] Random Case
            console.putmsg(bracket('A') + color.d_txt + ' RaNDOm CAsE'.toRandomCase() + color.t_txt2 + '                    : \1n');
            console.putmsg((user.security.flags2 & UFLAG_R) ? color.d_on + 'YES\1n' : color.d_off + 'NO\1n');
			console.crlf();
			// [B] Leet Case
            console.putmsg(bracket('B') + color.d_txt + ' lEET cASE'.toLeetCase() + color.t_txt2 + '                      : \1n');
            console.putmsg((user.security.flags2 & UFLAG_E) ? color.d_on + 'YES\1n' : color.d_off + 'NO\1n');
			console.crlf();
			// [C] Random Color
            console.putmsg(bracket('C') + ' Random Color'.toRandomColor() + color.t_txt2 + '                   : \1n');
            console.putmsg((user.security.flags2 & UFLAG_B) ? color.d_on + 'YES\1n' : color.d_off + 'NO\1n');
			console.crlf();
			// [D] Leet Color
			console.putmsg(bracket('D') + ' Leet Color'.toLeetColor() + color.t_txt2 + '                     : \1n');
            console.putmsg((user.security.flags2 & UFLAG_C) ? color.d_on + 'YES\1n' : color.d_off + 'NO\1n');
			console.crlf();
			// [E] Regular Color
            console.putmsg(bracket('E')  + ' Reset Text' + color.t_txt2 + '                     : \1n');
            console.putmsg((user.security.flags2 & UFLAG_G) ? color.d_on + 'YES\1n' : color.d_off + 'NO\1n');
			console.crlf(2);
			console.putmsg(color.normal + " This is a piece of sample text.".toMystText());
			console.crlf(2);
			console.putmsg(LIGHTGRAY + " Cannot disable colors while Random or Leet case is enabled. ")

			
		

            console.gotoxy(1, 22);
			console.print(format('%s %suit %s%s To Switch Pages.\r\n\r\n'
						,bracket('Q')
						,color.d_txt
						,bracket('ARROWS' + color.t_sym + ',' + color.t_sym2 + '#')
						,color.d_txt));

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

// string.toRandomCase();
String.prototype.toRandomCase = function() {
    return strip_ctrl(this).split('').map(function(c){
        return c[Math.round(Math.random())?'toUpperCase':'toLowerCase']();
    }).join('');
}

String.prototype.toRandomColor = function() {
    return strip_ctrl(this).split('').map(function(c){
        return [Math.round(Math.random())?color.normal:color.bright] + c;
    }).join('');
}

String.prototype.toLeetCase = function () {
	var original = this.toUpperCase().replace(/I/g,'i').replace(/O/g,'0')
    return strip_ctrl(original).split(" ").map(function (e) {
        return e.charAt(0).toLowerCase() + e.slice(1);
    }).join(' ');
}

String.prototype.toLeetColor = function () {
    return strip_ctrl(this).split(" ").map(function (e) {
        return WHITE + e.charAt(0) + color.bright + e.charAt(1) + color.normal + e.slice(2);
    }).join(' ');
}    

String.prototype.toMystText = function () {
	var text = this

try {
	if(user.security.flags2 & UFLAG_R)
		text = text.toRandomCase()
	
	if (user.security.flags2 & UFLAG_E)
		text = text.toLeetCase()
	
	if (user.security.flags2 & UFLAG_B)
		text = text.toRandomColor()
	
	if (user.security.flags2 & UFLAG_C)
		text = text.toLeetColor()
	
	if(user.security.flags2 & UFLAG_G)
		 text = color.normal + text;	
} catch(err) { } finally {
	return text;
}
    }
	
	function mystText(string) {
	return string.toMystText();
}
