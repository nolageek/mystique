load("sbbsdefs.js");
load('myst_functions.js');
load('myst_settings.js');
load('myst_colors.js');

// creating some color codes so my eyes dont bleed.
	c_txt 		= '\1h\1b'; 
	c_txt2 	= '\1h\1m';
	c_sym 		= '\1h\1k';
	c_sym2 		= '\1h\1w';
	c_success	= '\1f\1g';
	
var onelinerFile 	= system.mods_dir + '/oneliners.txt';




function addoneliner() {
	console.gotoxy(2,23);
	console.putmsg(c_txt + 'Enter a new \0014oneliner\1n ' + c_sym + '[' + c_sym2 + 'RET' + c_sym + '] ' + c_txt + 'quits:\1n');
	console.gotoxy(2,24);
	console.putmsg('\1h\1w: \1n\1w');
	var oneliner = console.getstr("", 59);
	oneliner = oneliner.trim();
	if (oneliner == null || oneliner == "" || oneliner =="q" || oneliner =="quit") return;
	var formatted = "  \1h\1k[\1w" + rpad(user.alias,15) + "\1h\1k] \1n\1w" + rpad(oneliner,59);
		f = new File(onelinerFile)
			if (!f.open("a")) {
			alert("Error opening file: " + onelinerFile);
			return;
			}
			f.writeln(formatted);
			f.close();
			console.gotoxy(1,24);
			console.clearline();
			console.center(c_success + 'Saved.\1n');
			console.crlf();
			console.pause();
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
	
	console.clear();
	mystHeaderFooter('header','oneliners');
	//console.putmsg(" \0015\1h\1wLocal Oneliners                                                               \r\n");
	//console.putmsg("  \1h\1k[\1mWho said shit: \1k] \1h\1cThe Shit They Said:");
	//console.putmsg(c_txt);
	console.printtail(onelinerFile,12);
	console.gotoxy(2,23);
if(!console.noyes('\1h\1kEnter new Oneliner'))
addoneliner();