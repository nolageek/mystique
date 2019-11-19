load("sbbsdefs.js");
load("settings.js");

// test for menu in user.command_shell directory, if not found use mystique version.


function mystMenu(file) {
    // checks current command_shell dir for file name, if doesn't exist, use mystique dir. assign to ansiDir
    var ansiDir = user.command_shell + '\\';
    if (!file_exists('c:\\sbbs\\text\\menu\\' + ansiDir + file + '.ans') && !file_exists('c:\\sbbs\\text\\menu\\' + ansiDir + file + '.asc')) {
        var ansiDir = 'mystique\\';
    }

		
    var random_list = directory(ansiDir + '\\' + file + "*.*") //returns an array of filenames from ansiDir
    if (random_list.length) { //if there are files in the directory
        bbs.menu(ansiDir + file_getname(random_list[random(random_list.length)]).slice(0, -4));
		//console.putmsg(ansiDir + file);
        // displays random file from array.
		} else { 
		bbs.menu(ansiDir + file) 
		}
		
/*
		var menuHead = "Area Menu" + "Options" + "Help";	
	switch (file) {
	case 'main':
		var menu = "  " 
					+ rpad(bracket('M') + color.d_txt + "essages", 40) 
					+ rpad(bracket('1') + color.d_txt + "liners",45) 
					+ bracket('D') + color.d_txt + "Settings"
					+ "\r\n  "
					+ rpad(bracket('E') + color.d_txt + "mail",40) 
					+ rpad(bracket('R') + color.d_txt + "umors",44) 
					+ bracket('/S') + color.d_txt + "cores Menu"
					+ "\r\n  "					
					+ rpad(bracket('C') + color.d_txt + "hat",40) 
					+ rpad(bracket('A') + color.d_txt + "utoMsg",44) 
					+ bracket('/?') + color.d_txt + "slash Commands"
					+ "\r\n  "
					+ rpad(bracket('T') + color.d_txt + "ext Files",39) 
					+ rpad(bracket('/C') + color.d_txt + "Local Chat",40)
					+ "\r\n  "
					+ rpad(bracket('X') + color.d_txt + "Games",40) 
					+ rpad(bracket('W') + color.d_txt + "ho's Online",45) 
					+ bracket('O') + color.d_txt + "logOff"
					+ "\r\n  "
					+ rpad(bracket('S') + color.d_txt + "ystem Menu",40) 
					+ rpad(bracket('L') + color.d_txt + "ast Callers",44) 
					+ bracket('/O') + color.d_txt + "fast!"
					+ "\r\n";
		break;
	case 'mesg':
		var menu = "  " 
					+ rpad(bracket('J') + color.d_txt + "ump to Group/Sub", 40) 
					+ rpad(bracket('S') + color.d_txt + "can for mentions",45)
					+ rpad(bracket('R') + color.d_txt + "ead (also [Enter])",40) 
					+ "\r\n  "
					+ rpad(bracket('F') + color.d_txt + "find Text in Msgs",40)
					+ rpad(bracket('L') + color.d_txt + "ist Msgs",40)
					+ "\r\n  "
					+ rpad(bracket('P') + color.d_txt + "Post Msg",40) 
					+ rpad(bracket('C') + color.d_txt + "onfigure N Scan",44)
					+ "\r\n  "
					+ rpad(bracket('N') + color.d_txt + "New Msg Scan",40)
					+ rpad(bracket('I') + color.d_txt + "Current Sub Info",45)
					+ bracket('Q') + color.d_txt + "uit to main"
					+ "\r\n  "
					+ "\r\n  "
					+ rpad(bracket('u/d') + color.t_txt + "to change group",40)
					+ rpad(bracket('l/r') + color.t_txt + "to change sub")
					+ "\r\n  ";
		break;
	case 'mail':
		var menu = "  " 
					+ rpad(bracket('R') + color.d_txt + "ead Mail",40)
					+ rpad(bracket('O') + color.d_txt + "ut Box");
					+ "\r\n  "
					+ rpad(bracket('S') + color.d_txt + "end Mail",40)
					+ rpad(bracket('F') + color.d_txt + "eedback to Sysop",45)
					+ bracket('Q') + color.d_txt + "uit to main"
					+ "\r\n  ";
		break;		
		default:
		break;
}
if (file.length == 4) {
		//console.putmsg(menuHead + "\r\n");
		console.putmsg(menu);
	
		}
		*/
		
}
function mystHeader(file) {
		if (!file_exists(system.text_dir + '\menu\\' + user.command_shell + "\\" + file + ".ans")) 
		file = "header";
		mystMenu(file);
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
        //mystMenu('h1');

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