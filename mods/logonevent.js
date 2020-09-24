load("sbbsdefs.js"); // load helper functions
load("myst_colors.js")
load("myst_settings.js"); // load helper functions
load("ansislow.js");
user.security.flags1|=UFLAG_H;

	console.clear();
	

	console.putmsg(color.alert + "Current shell:\1n\1c " + user.command_shell + "\1n\r\n");
	if(!console.noyes("\1h\1kSelect a new logon shell\1h\1w "))
		bbs.select_shell();
		

bbs.exec('?../xtrn/twitter/tweet.js ' + user.alias + ' has logged into the BBS on node ' + bbs.node_num + ". #bbslogon");

if (conf.fontcode != "437")
	randomANSIslow("logon","ascii"); // "Ascii Emulation" detected
bbs.exec('*/sbbs/xtrn/fmk/fmk.js');
bbs.exec('*myst_fastlogin.js');
console.clear();

//bbs.exec('*../xtrn/doorscan/doorscan.js scan');

bbs.exec('*myst_lastcallers.js 6');

console.clear();
