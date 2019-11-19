//Fast login
load("sbbsdefs.js"); // load helper functions
load("ansislow.js");
load("functions.js");
load("settings.js");

var color = "";
var conf = { fontcode : "437"
};

//settingsFile = system.text_dir + 'menu\\' + user.command_shell + '\\settings.js'
load(system.text_dir + 'menu\\' + user.command_shell + '\\settings.js'); 
	//load(settingsFile);
//

//console.gotoxy(52,9);
mystMenu(conf.fontcode)
mystMenu('FASTLOGIN');
if (user.security.flags2&UFLAG_F) {
	if(!console.yesno("\1h\1kFast Login:\1n\1w")){
		no_fastlogin();
		}
	 } else {
		if(console.noyes("\1h\1kFast Login:\1n\1w")){
		no_fastlogin();
		}
		}


function no_fastlogin() {
console.clear();
mystMenu('437');
randomANSIslow("logon","1"); // cap shrill ansi

mystMenu('437');
randomANSIslow("logon","2"); // game/network promo

mystMenu('437');
bbs.exec("*oneliner"); // by MrO

mystMenu(conf.fontcode);	
bbs.exec_xtrn("ONELIN3R"); // networked ones
//bbs.exec_xtrn("SYNCWXR"); // Weather
// WU API has been cancelled

// Auto-message
mystMenu(conf.fontcode);
bbs.exec('*automsg');

console.clear();

bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bulletins");
console.crlf(2);

	} 
