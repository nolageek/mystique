load("sbbsdefs.js");
load("settings.js");

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
    bbs.menu(ansiDir + file);

}


function mystHeader(file) {
		if (!file_exists(system.text_dir + '/menu/' + user.command_shell + '/' + file + '.ans')) {
		file = 'header';
		}
		mystMenu(file);
}

function mystPrompt(menuname) {
		var menuName = menuname;
		if (menuName == "Messages"){
		console.gotoxy(2,23);
		console.putmsg(bracket('@GN@') + '@GRP@ ' + bracket('@SN@') + color.t_menu + '@SUBL@\1n');
		}
		if (menuName == "Files"){
		console.gotoxy(2,23);
		console.putmsg(bracket('@LN@') + color.t_user + '@LIB@ ' + bracket('@DN@') + color.t_menu + '@DIRL@\1n');
		}
		if(user.settings & USER_EXPERT) 
        var xpert=".xpert " + color.t_sym2 + "(?=menu)";
		else
		var xpert="";
		//console.crlf();
		console.gotoxy(2,24);
        console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + menuName + ' Menu' + color.t_sym + xpert + ' >' + color.t_menu + '>' + color.t_sym2 + '> \1n');
}

function bracket(string) {
	bracketed = color.t_sym + '[' + color.t_sym2 + string + color.t_sym + '] ';
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

function file_select_directory() {
    //list and select a directory for the current library
    //list and select a subboard for the current group
        console.clear();
        console.crlf();
        console.print(color.d_text + "Directories of " + color.d_head + file_area.lib_list[bbs.curlib].name);
        console.crlf();
    var lib_dirs = file_area.lib_list[bbs.curlib].dir_list;
    for (var i=0; i<lib_dirs.length; i++)
        console.print(color.d_text + ((i==bbs.curdir)?"* ":"  ") + ((i+1)+"   ").substr(0,3) +  color.d_value + lib_dirs[i].name + "\r\n");

    console.gotoxy(2,screenRows-1)
    console.print(color.t_txt2 + 'Select a Directory: ');
    bbs.curdir = console.getnum(lib_dirs.length)-1;
}

function file_select_library() {
    //list and select a group, then a subboard.
        console.clear();
        console.crlf();
        console.print(color.d_text + 'File Libraries');
        console.crlf();

    var lib_list = file_area.lib_list;
    for (var i=0; i<lib_list.length; i++)
        console.print(color.d_text + ((i==bbs.curlib)?"* ":"  ") + ((i+1)+"   ").substr(0,2) +  color.d_value + lib_list[i].name + "\r\n");

    console.gotoxy(2,screenRows-1)
    console.print(color.t_txt2 + "Select a Library: ");
    bbs.curlib = console.getnum(lib_list.length)-1;
    file_select_directory();
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
            console.putmsg(color.d_txt + 'Settings for \1h\1w' + user.alias + ' #' + user.number + color.d_txt + ', Page ' + color.t_txt2 + '1');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'USER ACCOUNT SETTINGS\1n',64));
            console.crlf();
            console.putmsg(bracket('A') + color.d_txt + 'Terminal Mode' + color.t_txt2 + '                  : \1n');
            console.putmsg((user.settings & USER_AUTOTERM) ? color.d_value + 'Auto Detect \1n' : '');
            console.putmsg((user.settings & USER_ANSI) ? color.d_value + 'ANSI \1n ' : color.d_off + 'TTY\1n ');
            console.putmsg((user.settings & USER_COLOR) ? color.d_value + '(Color) \1n' : color.d_off + '(Mono) \1n');
            console.putmsg((user.settings & USER_NO_EXASCII) ? color.d_off + 'ASCII Only \1n' : ' \1n');
            console.crlf();
            console.putmsg(bracket('B') + color.d_txt + 'External Editor' + color.t_txt2 + '                : \1n');
            console.putmsg(color.d_value + xtrn_area.editor[user.editor].name);
            console.crlf();
            console.putmsg(bracket('C') + color.d_txt + 'Screen Length' + color.t_txt2 + '                  : \1n');
            var screenrows;
            if (user.screen_rows) {
                screenrows = user.screen_rows;
            } else {
                screenrows = color.d_value + 'Auto Detect ' + color.t_sym + '(' + color.t_sym2 + console.screen_rows + color.t_sym + ')';
            }
            console.putmsg(color.d_value + screenrows);
            console.crlf();

            console.putmsg(bracket('D') + color.d_txt + 'Current Command Shell' + color.t_txt2 + '          : \1n');
            console.putmsg(color.d_value + user.command_shell.toUpperCase());
            console.crlf();

            console.putmsg(bracket('E') + color.d_txt + 'Expert Mode' + color.t_txt2 + '                    : \1n');
            console.putmsg((user.settings & USER_EXPERT) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('F') + color.d_txt + 'Screen Pause' + color.t_txt2 + '                   : \1n');
            console.putmsg((user.settings & USER_PAUSE) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('G') + color.d_txt + 'Hot Keys' + color.t_txt2 + '                       : \1n');
            console.putmsg((user.settings & USER_COLDKEYS) ? color.d_off + 'OFF\1n' : color.d_on + 'ON\1n');
            console.crlf();
            console.putmsg(bracket('H') + color.d_txt + 'Spinning Cursor' + color.t_txt2 + '                : \1n');
            console.putmsg((user.settings & USER_SPIN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('I') + color.d_txt + 'Default to Quiet Mode' + color.t_txt2 + '          : \1n');
            console.putmsg((user.settings & USER_QUIET) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('J') + color.d_txt + 'Fast Login Default Option' + color.t_txt2 + '      : \1n');
            console.putmsg((user.security.flags2 & UFLAG_F) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'USER PROFILE SETTINGS\1n',64));
            console.crlf();
            console.putmsg(bracket('K') + color.d_txt + 'Update Location/Affiliations' + color.t_txt2 + '   : \1n');
            console.putmsg(color.d_value + user.location + '\1n');
            console.crlf();
            console.putmsg(bracket('L') + color.d_txt + 'Change Password\1n');
            console.crlf();
            console.putmsg(bracket('M') + color.d_txt + 'Change Internet E-mail' + color.t_txt2 + '         : \1n');
            console.putmsg(color.d_on + user.netmail + '\1n');
            console.crlf();
            console.putmsg(color.d_off + ' -  ' + color.d_txt + 'Local Email ' + color.d_off + '(READ ONLY)' + color.t_txt2 + '        : ');
            console.putmsg(color.d_off + user.email + '\1n');
            console.crlf();
            console.putmsg(bracket('N') + color.d_txt + 'Update Signature');
            console.crlf();
            console.putmsg(color.d_off + ' -  ' + color.d_txt + 'Birthdate ' + color.d_off + '(READ ONLY)' + color.t_txt2 + '          : ');
            console.putmsg(color.d_off + user.birthdate + '\1n');
            console.putmsg(color.t_sym + ' (' + color.t_sym2 + user.age + color.t_sym + ') \1n');
            console.crlf();
            console.putmsg(bracket('O') + color.d_txt + 'Change Gender' + color.t_txt2 + '                  : \1n');
            console.putmsg(color.d_on + user.gender + '\1n');

            //  bbs.menu(user.command_shell + '/settings1');
            console.gotoxy(1, 22);
            console.putmsg(bracket('Q') + color.d_txt + 'uit. ' + bracket('ARROWS' + color.t_sym + ',' + color.t_sym2 + '#') + color.d_txt + 'To Switch Pages.');
            console.crlf(2);
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
                console.putmsg(bracket('?') + color.t_ques + 'Enter your location / group affiliations\1w: ');
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
                console.putmsg(bracket('?') + color.t_ques + 'Enter Your Internet E-mail Address\1w: ');
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
                console.putmsg(bracket('?') + color.t_ques + 'Enter Your Gender\1w: ');
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
            console.putmsg(color.d_txt + 'Settings for \1h\1w' + user.alias + ' #' + user.number + color.d_txt + ', Page ' + color.t_txt2 + '2');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'CHAT SETTINGS\1n',56));
            console.crlf();
            console.putmsg(bracket('A') + color.d_txt + 'Allow Paging' + color.t_txt2 + '                   : \1n');
            console.putmsg((user.chat_settings & CHAT_NOPAGE) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('B') + color.d_txt + 'Activity Alerts' + color.t_txt2 + '                : \1n');
            console.putmsg((user.chat_settings & CHAT_NOACT) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('C') + color.d_txt + 'Private Split-Screen Chat' + color.t_txt2 + '      : \1n');
            console.putmsg((user.chat_settings & CHAT_SPLITP) ? '\1n\1cSPLIT SCREEN\001n' : '\1n\1cTRADITIONAL\001n');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'MESSAGE SCAN SETTINGS\1n',64));
            console.crlf();
            console.putmsg(bracket('D') + color.d_txt + 'Ask For "New Scan" At Login' + color.t_txt2 + '    : \1n');
            console.putmsg((user.settings & USER_ASK_NSCAN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('E') + color.d_txt + 'Ask For Your Un-read Msg Scan' + color.t_txt2 + '  : \1n');
            console.putmsg((user.settings & USER_ASK_SSCAN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('F') + color.d_txt + 'New Scan Configuration\1n');
            console.crlf();
            console.putmsg(bracket('G') + color.d_txt + 'Your "to-you" Message Scan Config\1n');
            console.crlf();
            console.putmsg(bracket('H') + color.d_txt + 'Re-init New Scan Pointers\1n');
            console.crlf();
            console.putmsg(bracket('I') + color.d_txt + 'Set New Scan Pointers\1n');
            console.crlf();
            console.putmsg(lpad(color.d_head + 'MESSAGE READ SETTINGS\1n',64));
            console.crlf();
            console.putmsg(bracket('J') + color.d_txt + 'Remember Current Sub-Board' + color.t_txt2 + '     : \1n');
            console.putmsg((user.settings & USER_CURSUB) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('K') + color.d_txt + 'Clear Screen Between Messages' + color.t_txt2 + '  : \1n'); // clear screen btw msgs
            console.putmsg((user.settings & USER_CLRSCRN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('L') + color.d_txt + 'Forward Email to Netmail' + color.t_txt2 + '       : \1n');
            console.putmsg((user.settings & USER_NETMAIL) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();

            console.putmsg(lpad(color.d_head + 'FILE SCAN OPTIONS\1n',60));
            console.crlf();
            console.putmsg(bracket('M') + color.d_txt + 'Default Download Protocol' + color.t_txt2 + '      : \1n');
            console.putmsg('\1n\1c' + user.download_protocol + '-Modem');
            console.crlf();
            console.putmsg(bracket('N') + color.d_txt + 'Auto New File Scan At Login' + color.t_txt2 + '    : \1n');
            console.putmsg((user.settings & USER_ANFSCAN) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');
            console.crlf();
            console.putmsg(bracket('O') + color.d_txt + 'Batch Download File tagging' + color.t_txt2 + '    : \1n');
            console.putmsg((user.settings & USER_BATCHFLAG) ? color.d_on + 'ON\1n' : color.d_off + 'OFF\1n');

            console.gotoxy(1, 22);
            console.putmsg(bracket('Q') + color.d_txt + 'uit. ' + bracket('ARROWS' + color.t_sym + ',' + color.t_sym2 + '#') + color.d_txt + 'To Switch Pages.');
            console.crlf(2);

            console.putmsg(color.t_user + user.alias + color.t_sym + '@' + color.t_menu + 'Defaults Menu' + color.t_sym + ':\1n');
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