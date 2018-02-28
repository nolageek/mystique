load("sbbsdefs.js"); 

var param = argv[0];
var ansiDir = user.command_shell + '\\';
var rumorHeader	= 'rumor-h';
var rumorFooter	= 'footer';
var rumorFile 	= system.mods_dir + '\\rumor.txt';

var color = {
							// MENU STRING COLORS
	txt_menu	: '\1h\1b', // menu name
	txt_user 	: '\1h\1c', // username in menus 
	txt_sym 	: '\1n\1b', // symbols color @, [ ], ( ),etc..
	txt_sym2 	: '\1h\1c', // symbol highlght (numbers in [1], menu options [A], etc..)
	txt_text 	: '\1h\1b', // color for most text
	txt_text2 	: '\1h\1m', // aux color for text, bold words, values, etc...
	txt_ques 	: '\1h\1y', // color for question prompts
	txt_alert 	: '\1h\1r', // color for alert text
	txt_success	: '\1h\1g', // color for success text
	txt_info 	: '\1h\1c', // color for info text
}


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
	console.putmsg(rumor);
}

function addRumor() {
	console.clear();
	bbs.menu(ansiDir + rumorHeader);
	console.printtail(rumorFile,12);
	bbs.menu(ansiDir + rumorFooter);
	console.gotoxy(1,22);

	console.gotoxy(1,23);
	console.putmsg(color.txt_text + 'Enter new rumor ' + color.txt_sym + '[' + color.txt_sym2 + 'RET' + color.txt_sym + '] ' + color.txt_text + 'quits:\1n');
	console.gotoxy(1,24);
	console.putmsg(':');
	var rumor = console.getstr("", 77);
	if (rumor == null || rumor == "" || rumor =="q" || rumor =="quit") return;
	else customizeRumor(rumor);
}

function customizeRumor(rumor) {
	
	var fgarray = {1:"\1w",2:"\1y",3:"\1r",4:"\1h\1b",5:"\1g",6:"\1m",7:"\1h\1y",8:"\1h\1m"};
	var bgarray = {10:"\0010",11:"\0016",12:"\0012",13:"\0015",14:"\0014",15:"\0013",16:"\0011"};
	var rumor = (rpad(rumor,78));
	console.gotoxy(1,23);
	
	console.putmsg(color.txt_text + 'Pimp Your Rumor: ' + color.txt_sym + '[' + color.txt_sym2 + 'UP' + color.txt_sym + '/' + color.txt_sym2 + 'DOWN' + color.txt_sym + ']' + color.txt_text + ':' + color.txt_text2 + 'FG' + color.txt_sym + '   [' + color.txt_sym2 + 'LEFT' + color.txt_sym + '/' + color.txt_sym2 + 'RIGHT' + color.txt_sym  +']' + color.txt_text + ':' + color.txt_text2 + 'BG' + color.txt_sym + '   [' + color.txt_sym2 + 'RET' + color.txt_sym + ']' + color.txt_text + ':' + color.txt_text2 + 'Accept' + color.txt_sym + '   [' + color.txt_sym2 + 'Q' + color.txt_sym + ']' + color.txt_text + ':' + color.txt_text2 + 'Quit');
	console.gotoxy(1,24);
	console.putmsg('\10\1n\1w[' + rumor + '\10\1n\1w]')
	
	var fg = 1;
	var bg = 10;
	
	
	var accepted = false;
	
	while (!accepted) {

		switch(console.getkey(K_NOECHO).toUpperCase()) {
		case KEY_UP:
        case 'W':
			if (fg == 8) fg = 1;
			else fg = fg +1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
			break;
		case KEY_DOWN:
		case 'S': 
			if (fg == 1) fg = 8;
			else fg = fg -1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
            break;
		case KEY_LEFT:
        case 'A': 
			if (bg == 10) bg = 16;
			else bg = bg -1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
            break;
		case KEY_RIGHT:
        case 'D': 
			if (bg == 16) bg = 10;
			else bg = bg +1;
			console.gotoxy(1,24);
			console.clearline();
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
			console.putmsg(styled);
            break;
		case 'Q':
			accepted = true;
			console.crlf();
			console.pause();
			break;
		case "\r":
			var styled = '\10\1n\1w[' + bgarray[bg] + fgarray[fg] + rumor + '\10\1n\1w]';
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
			console.center(color.txt_success + 'Saved.\1n');
			console.crlf();
			console.pause();
			accepted = true;
			break;
		default:
			break;
		}
	}
}

//pads right
function rpad(str, length, padString) {
	if (!padString)
			var padString = ' ';
	if (str > length)
		var str = str.substring(0, length);
    while (str.length < length)
        var str = str + padString;
		
    return str;
}