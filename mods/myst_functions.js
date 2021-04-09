load("sbbsdefs.js");
load("myst_colors.js");
load("myst_settings.js");



//load("myst_language.js");

// test for menu in user.command_shell directory, if not found use mystique version.


function mystMenu(file) {
     //checks current command_shell directory for file name, if doesn't exist, 
	 // use mystique dir.
	console.putmsg('@RESETPAUSE@');

    var ansiDir = '/sbbs/text/menu/' + user.command_shell + '/';
	if (file_exists(ansiDir + bbs.curgrp + "-" + file + '.ans')) 
		file = bbs.curgrp + "-" + file;

    if (!file_exists(ansiDir + file + '*.*')) 
		var ansiDir = '/sbbs/text/menu/mystique/';  
    var random_list = directory(ansiDir + file + '*.*') //returns an array of filenames from ansiDir
    if (random_list.length)  //if there are files in the directory
        file = file_getname(random_list[random(random_list.length)]).slice(0, -4);
    if (file_exists(ansiDir + file + '*.*'))
		bbs.menu(ansiDir + file, P_NOERROR);

	
}		


function mystHeaderFooter(type,file) {
		if (!file_exists('/sbbs/text/menu/' + user.command_shell + '/' + file + '.ans'))
			file = type;
		mystMenu(file);
}

function mystPrompt(menuname) {
        bbs.nodesync();
		bbs.menu(conf.fontcode); // reset font type
		
		if(!(user.settings & USER_EXPERT)) 
        mystMenu(menuname);
		
		if (menuname == "Mesg"){
			menuname = "Message";
			
			if(!(user.settings & USER_EXPERT)) 
				console.gotoxy(1,23);
				
			//console.clearline();
			console.putmsg(' ' + bracket('@GN@' ) + color.normal + ' @GRP@' + color.dark + ' - ' + bracket('@SN@') + ' @SUBL@\1n');
			console.crlf()
		}
		
		if (menuname == "Xfer"){
			menuname = "Transfer";
			
		if(!(user.settings & USER_EXPERT)) 
				console.gotoxy(1,23);
				
		//console.clearline();
		console.putmsg(' ' + bracket('@LN@') + color.normal + ' @LIB@' + color.dark + ' - ' + bracket('@DN@') + color.bright + ' @DIRL@\1n');
		console.crlf()
		}
		
		if(user.settings & USER_EXPERT) 
        var xpert=".xpert " + bracket("?=menu");
		else
		var xpert="";
		
		if(!(user.settings & USER_EXPERT)) 
			console.gotoxy(1,24);

		//console.clearline();

		var prompt = format(" %s" + user.alias + "%s > %s" + menuname + "_Menu%s%s %s>%s>%s>" + m_color.RESETCOLOR
				,color.bright
				,color.dark
				,color.normal
				,color.dark
				,xpert
				,color.bright
				,color.normal
				,color.dark);
				
		console.print(mystText(prompt));
		
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
	


/*
String.prototype.toRandomCase = function() {
return mystRandomCase(this);
} */

function mystRandomCase(string) {
    return strip_ctrl(string).split('').map(function(c){
        return c[Math.round(Math.random())?'toUpperCase':'toLowerCase']();
    }).join('');
}

function mystRandomColor(string) {
	return strip_ctrl(string).split('').map(function(c){
		var items = [color.normal,color.dark,color.bright,m_color.WHITE,m_color.LIGHTGRAY];
        return m_color.BG_BLACK + items[Math.floor(Math.random() * items.length)] + c 
    }).join('');
}



function RainbowColor(string) {
	return strip_ctrl(string).split('').map(function(c){
		var items = ['\1n\1h\1r', '\1n\1y', '\1n\1h\1y','\1n\1h\1g','\1n\1h\1b','\1n\1m','\1n\1h\1m'];
        return items[Math.floor(Math.random() * items.length)] + c 
    }).join('');
}

function mystLeetCase(string) {
		var original = string.toUpperCase().replace(/I/g,'i').replace(/O/g,'0')
    return strip_ctrl(original).split(" ").map(function (e) {
        return e.charAt(0).toLowerCase() + e.slice(1);
    }).join(' ');
}

function mystLeetColor(string) {
    return strip_ctrl(string).split(" ").map(function (e) {
        return 	m_color.WHITE + e.charAt(0) + color.bright + e.charAt(1) + color.normal + e.slice(2);
    }).join(' ');
	}

function mystFirstWhiteColor(string) {
    return strip_ctrl(string).split(" ").map(function (e) {
        return 	m_color.WHITE + e.charAt(0) + color.bright + e.slice(1)
    }).join(' ');
	}
	
function mystText(string) {
	var text = string;
	
	if(user.security.flags2 & UFLAG_R)
		text = mystRandomCase(text)
	
	if (user.security.flags2 & UFLAG_E)
		text = mystLeetCase(text)
	
	if (user.security.flags2 & UFLAG_B)
		text = mystRandomColor(text)
	
	if (user.security.flags2 & UFLAG_C)
		text = mystLeetColor(text)
	
	if(user.security.flags2 & UFLAG_G)
		 text = color.normal + text;
	 
	return text;
}