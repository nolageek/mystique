load('sbbsdefs.js');

var amsgFile = system.mods_dir + '\automsg.txt';
	
	
function autoMsg() {
	showAutoMsg()
	
	if(!console.noyes('\1h\1cEnter new AutoMessage')) {
	console.clear();
	bbs.menu(user.command_shell + '/automsg-h');
	console.crlf();
	console.putmsg('\1h\1bLine 1: ');
	var amsg1 = console.getstr("", 50);
	if (amsg1 == null || amsg1 == "" || amsg1 =="q" || amsg1 =="quit") return;
	console.putmsg('\1h\1cLine 2: ');
	var amsg2 = console.getstr("", 50);
	console.putmsg('\1h\1wLine 3: ');
	var amsg3 = console.getstr("", 50);
	var uname = user.alias;
	console.crlf(2);
	bbs.menu(user.command_shell + '/automsg-f');
	console.crlf(2);
	
	if(!console.noyes('\1h\1cSave your Message?')) {
	console.putmsg(amsg1.length);
		f = new File(amsgFile)
		if (!f.open("w")) {
			alert("Error opening file: " + amsgFile);
			return;
		}
			//f.writeln(amsg);
			
			f.write("@RIGHT:" + (79 - amsg1.length)/2 + "@\1h\1w" + amsg1 + "\1n\r\n");
			f.write("@RIGHT:" + (79 - amsg2.length)/2 + "@\1h\1w" + amsg2 + "\1n\r\n");
			f.write("@RIGHT:" + (79 - amsg3.length)/2 + "@\1h\1w" + amsg3 + "\1n\r\n");
			f.write("\r\n");
			f.write("\r\n");
			f.write("@RIGHT:" + (79 - uname.length)/2 + "@\1h\1m" + uname);
			f.close();
			showAutoMsg()
			console.center('\1h\1rYour automessage has been saved. \1n\1w\r\n');
	}

}
}

function showAutoMsg() {
	console.clear();
	bbs.menu(user.command_shell + '/automsg-h');
	console.crlf();
	console.printtail(amsgFile,9);
	console.crlf(2);
	bbs.menu(user.command_shell + '/automsg-f');
	console.crlf(2);
}

autoMsg();