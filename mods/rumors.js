load("sbbsdefs.js");

	c_txt 		= '\1h\1b'; 
	c_txt2 	= '\1h\1m';
	c_sym 		= '\1h\1k';
	c_sym2 		= '\1h\1w';
	c_success	= '\1f\1g';
	
var conf = [];
	conf.rumorsNum = 6;

var param = argv[0];
var rumorFile 	= system.mods_dir + '\\rumor.txt';

if (param == 'addrumor') {
	addRumor();
	exit();
} else {
	showRumor();
}

function showRumor() {
	f = new File(rumorFile);
	if (!f.open('r')) {
		alert("Error opening file: " + rumorFile);
		return;
	}
	var all = f.readAll();
	f.close();
	var rumor = all[Math.floor(Math.random()*all.length)];
	console.putmsg(' \1n\1mrumor: \1n\1w[' + rpad(rumor,75) + '\1n\1w]');
}

function addRumor() {
	console.clear();
	findHeader('rumor-h');
	console.putmsg(c_txt);
	console.printtail(rumorFile,conf.rumorsNum);
	findHeader('rumor-f');
	console.gotoxy(2,22);

	console.gotoxy(2,23);
	console.putmsg(c_txt + 'Enter new rumor ' + c_sym + '[' + c_sym2 + 'RET' + c_sym + '] ' + c_txt + 'quits:\1n');
	console.gotoxy(2,24);
	console.putmsg(':');
	var rumor = console.getstr("", 70);
	if (rumor == null || rumor == "" || rumor =="q" || rumor =="quit") return;
	else customizeRumor(rumor);
}

function customizeRumor(rumor) {
	
	var fgarray = {1:"\1n\1w",2:"\1n\1y",3:"\1n\1r",4:"\1h\1b",5:"\1n\1g",6:"\1n\1m",7:"\1h\1y",8:"\1h\1m"};
	var bgarray = {10:"\0010",11:"\0016",12:"\0012",13:"\0015",14:"\0014",15:"\0013",16:"\0011"};
	var fg = 1;
	var bg = 10;
	var rumor = (rpad(rumor,70));

	
	console.gotoxy(1,23);
	
	console.putmsg(c_txt + 'Pimp Your Rumor: ' + c_sym + '[' + c_sym2 + 'UP' + c_sym + '/' + c_sym2 + 'DN' + c_sym + ']' + c_txt + ':' + c_txt2 + 'FG' + c_sym + '   [' + c_sym2 + 'LFT' + c_sym + '/' + c_sym2 + 'RT' + c_sym  +']' + c_txt + ':' + c_txt2 + 'BG' + c_sym + '   [' + c_sym2 + 'RET' + c_sym + ']' + c_txt + ':' + c_txt2 + 'Accept' + c_sym + '   [' + c_sym2 + 'Q' + c_sym + ']' + c_txt + ':' + c_txt2 + 'Quit');
	console.gotoxy(1,24);
	console.putmsg('\10\1n\1w [' + rumor + '\10\1n\1w]')
	
	var accepted = false;
	
	while (!accepted) {

		switch(console.getkey(K_NOECHO).toUpperCase()) {
		case KEY_UP:
        case 'W':
			if (fg == 8) fg = 1;
			else fg = fg +1;
			console.gotoxy(1,24);
			console.clearline();
			console.putmsg('\10\1n\1w [');
			var styled = bgarray[bg] + fgarray[fg] + rumor;
			console.putmsg(styled);
			console.putmsg('\10\1n\1w]');
			break;
		case KEY_DOWN:
		case 'S': 
			if (fg == 1) fg = 8;
			else fg = fg -1;
			console.gotoxy(1,24);
			console.clearline();
			console.putmsg('\10\1n\1w [');
			var styled = bgarray[bg] + fgarray[fg] + rumor;
			console.putmsg(styled);
			console.putmsg('\10\1n\1w]');
            break;
		case KEY_LEFT:
        case 'A': 
			if (bg == 10) bg = 16;
			else bg = bg -1;
			console.gotoxy(1,24);
			console.clearline();
			console.putmsg('\10\1n\1w [');
			var styled = bgarray[bg] + fgarray[fg] + rumor;
			console.putmsg(styled);
			console.putmsg('\10\1n\1w]');
            break;
		case KEY_RIGHT:
        case 'D': 
			if (bg == 16) bg = 10;
			else bg = bg +1;
			console.gotoxy(1,24);
			console.clearline();
			console.putmsg('\10\1n\1w [');
			var styled = bgarray[bg] + fgarray[fg] + rumor;
			console.putmsg(styled);
			console.putmsg('\10\1n\1w]');
            break;
		case 'Q':
			accepted = true;
			console.crlf();
			console.pause();
			break;
		case "\r":
			var styled = bgarray[bg] + fgarray[fg] + rumor;
			f = new File(rumorFile)
			if (!f.open("a")) {
			alert("Error opening file: " + rumorFile);
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
			console.center(c_success + 'Saved.\1n');
			console.crlf();
			console.pause();
			accepted = true;
			break;
		default:
			break;
		}
	}
}

function findHeader(file) {
    // checks current command_shell dir for file name, if doesn't exist, use mod dir. assign to ansiDir
    var ansiDir = user.command_shell + '\\';
    if (!file_exists(ansiDir + file + '.ans') && !file_exists(ansiDir + file + '.asc')) {
        var ansiDir = 'rumors\\'
    }

   // var random_list = directory(ansiDir + file + "*.*") //returns an array of filenames from ansiDir
    //if (random_list.length) { //if there are files in the directory
        bbs.menu(ansiDir + file);
		//console.putmsg(ansiDir + file)
        // displays random file from array.
	//	}
}

function rpad(str, length, padString) {
    if (!padString)
            var padString = ' ';
    if (str.length > length)
        str = str.substring(0, length);
    while (str.length < length)
        str = str + padString;
        
    return str;
}