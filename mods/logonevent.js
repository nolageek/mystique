load("sbbsdefs.js"); // load helper functions
load("myst_colors.js")
load("myst_settings.js"); // load helper functions
load("ansislow.js");
user.security.flags1|=UFLAG_H;

//console.clear();

if (conf.fontcode != "437")
	randomANSIslow("logon","ascii"); // "Ascii Emulation" detected
else 	randomANSIslow("logon","us-ansi"); // "Ascii Emulation" detected
console.putmsg(color.alert + "@RESETPAUSE@ Current shell:\1n\1c " + user.command_shell + "\1n\r\n");
	if(!console.noyes("\r\n\1h\1k Select a new logon shell\1h\1w "))
		bbs.select_shell();
		

bbs.exec('?../xtrn/twitter/tweet.js ' + user.alias + ' has logged into the BBS on node ' + bbs.node_num + ". #bbslogon");



bbs.exec('*myst_fastlogin.js');
console.clear();

bbs.menu('437');
bbs.menu("../logon/userinfo");

bbs.menu(conf.fontcode);
bbs.exec('*myst_lastcallers.js 6');
console.pause();
console.clear();
bbs.menu('437');
bbs.menu("../logon/4-synchronet1");
bbs.menu(conf.fontcode);
