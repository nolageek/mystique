load("sbbsdefs.js");

// test for menu in user.command_shell directory, if not found use mystique version.
function mystMenu(file) {
    // checks current command_shell dir for file name, if doesn't exist, use mystique dir. assign to ansiDir
    var ansiDir = system.text_dir + '\menu\\' + user.command_shell + '\\';
    if (!file_exists(ansiDir + file + '.ans') && !file_exists(ansiDir + file + '.asc')) {
        var ansiDir = system.text_dir + '\menu\\mystique\\';
    }

    var random_list = directory(ansiDir + '\\' + file + "*.*") //returns an array of filenames from ansiDir
    if (random_list.length) { //if there are files in the directory
        bbs.menu(ansiDir + '\\' + file_getname(random_list[random(random_list.length)]).slice(0, -4));
        // displays random file from array.
		}
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

//Totally swiped this from ispyhumanfly //
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