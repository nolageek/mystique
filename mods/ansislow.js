/* $Id$ */
/* Used for renderinglong ansi more slowly. */
/* Created By tracker1(at)theroughnecks(dot)net */

load("sbbsdefs.js");

//if (!bbs.mods) bbs.mods = {};
//if (!bbs.mods.vanguard) bbs.mods.vanguard = {};

function ansislow(fname) {
	file_base = fname;
	if (file_exists(file_base))
		f = new File(file_base);
	else if (file_exists(file_base+".ans") && (((console.autoterm & USER_ANSI) > 1) || (user && (user.number > 0) && ((user.settings & USER_ANSI) > 1))))
		f = new File(file_base+".ans");
	else if (file_exists(file_base+".asc"))
		f = new File(file_base+".asc");
	else {
		//console.print(file_base+".ans\r\n")
		console.print("File doesn't exist: menu/" + fname + ".???\r\n");
		return;
	}
	if(!f.open("r")) {
		console.print("Error opening file: " + f.name + "\r\n");
		return;
	}

	console.print("\1n");
	console.clear();
	console.line_counter = 0;
	text = f.readAll();
	f.close();
	for (var i=0;i<text.length;i++) {
		console.print(text[i]);
		if (i<text.length-1)
			console.putmsg("\r\n");
		console.line_counter = 0;
		
		if (text.length > 25)
			sleep(25);
	
		//allow cancel
		switch (console.inkey().toLowerCase()) {
			case " ":
			case "c":
			case "\1":
			case "q":
			case "x":
				i = text.length;
			default:
				if (bbs.sys_status&SS_ABORT)
					i = text.length;
		}
	}
	if (text.length > 25)
		sleep(500);

	bbs.sys_status &= ~SS_ABORT;
	console.line_counter=23;
}
//bbs.show = bbs.mods.vanguard.ansislow;



function randomANSI(folder,filenamePrefix){
  var ansiDirectory = folder;
  var filePrefix = filenamePrefix;
var random_list = directory(system.text_dir + ansiDirectory + "/" + filePrefix + "*.*")  //returns an array of filenames from a directory that start with the file_name "random" followed by a number from the text directory, in a sub-folder "called coolansi"
if(random_list.length){  //if there are files in the directory
console.printfile("../text/" + ansiDirectory + "/" + file_getname(random_list[random(random_list.length)]).slice(0,-4) + ".ans");  // prints a file from the directory "..text/ansiDirectory/" and basically creates a filename to grab by generating a random number and putting it in between the strings "random" and ".ans" in this case.
			//console.pause();
}
}

function randomANSIslow(folder,filenamePrefix){
  var ansiDirectory = folder;
  var filePrefix = filenamePrefix;
var random_list = directory(system.text_dir + ansiDirectory + "/" + filePrefix + "*.*")  //returns an array of filenames from a directory that start with the file_name "random" followed by a number from the text directory, in a sub-folder ansiDirectory.
if(random_list.length){  //if there are files in the directory
ansislow("c:/sbbs/text/" + ansiDirectory + "/" + file_getname(random_list[random(random_list.length)]).slice(0,-4) + ".ans");
			//console.pause();
}
}