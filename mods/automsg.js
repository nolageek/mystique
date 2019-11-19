load('sbbsdefs.js');
load('functions.js');

var amsgFile = system.mods_dir + '\automsg.txt';
//var greetz = '\1h\1mg \1n\1mr e e t z\1w:\r\n';
var prefix = '@RIGHT:10@\1h\1b';
	
	
function autoMsg() {
	console.clear();
	bbs.menu(user.command_shell + '/automsg-h');
	console.crlf();
	console.printtail(amsgFile,9);
	console.crlf(2);
	bbs.menu(user.command_shell + '/automsg-f');
	console.crlf(2);

	if(!console.noyes('\1h\1rEnter new AutoMsg')) {

	console.putmsg('Line 1:');
	var amsg1 = console.getstr("", 50);
	if (amsg1 == null || amsg1 == "" || amsg1 =="q" || amsg1 =="quit") return;
	console.putmsg('Line 2:');
	var amsg2 = console.getstr("", 50);
	console.putmsg('Line 3:');
	var amsg3 = console.getstr("", 50);
	var uname = user.alias;
	
	console.putmsg('\1h\1bSave your Message? \1h\1w[\1mRET\1w] \1bor \1mY \1bto Save. \1w[\1mQ\1w] \1bto quit.\1n');
    var key = console.getkey(K_NOECHO).toUpperCase();
    bbs.log_key(key);
    switch (key) {
	case "Q":
		return;
	case 'Y':
	case "\r":
	console.putmsg(amsg1.length);
	console.pause();
		f = new File(amsgFile)
		if (!f.open("w")) {
			alert("Error opening file: " + amsgFile);
			return;
		}
			//f.writeln(amsg);
			
			f.write("@RIGHT:" + (79 - amsg1.length)/2 + "@" + amsg1 + "\r\n");
			f.write("@RIGHT:" + (79 - amsg2.length)/2 + "@" + amsg2 + "\r\n");
			f.write("@RIGHT:" + (79 - amsg3.length)/2 + "@" + amsg3 + "\r\n");
			f.write("\r\n");
			f.write("\r\n");
			//f.write("@RIGHT:" + (79 - 12)/2 + "@\1h\1b" + greetz);
			f.write("@RIGHT:" + (79 - uname.length)/2 + "@\1h\1m" + uname);
			f.close();
			console.center('\1h\1rSaved. \1n\1w\r\n');
			console.pause();
			break;
		default:
			break;
		}
	}
	return;
}

autoMsg();