//Fast login
load("sbbsdefs.js"); // load helper functions
load("ansislow.js");
load("myst_colors.js")
load("myst_functions.js");
//load("myst_settings.js");
//load("myst_colors.js");

//var color = "";
//var conf = { fontcode : "437"
//};

//settingsFile = system.text_dir + 'menu\\' + user.command_shell + '\\settings.js'
//load(system.text_dir + 'menu/' + user.command_shell + '/settings.js'); 
	//load(settingsFile);
//

//console.gotoxy(52,9);
	
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
var d = new Date();
var n = d.getMonth();
var monthansi =  "month" + (n+1);
//console.putmsg(monthansi);

//mystMenu('topaz');
//bbs.menu('../bulletins/cnn')

//mystMenu('437');
//randomANSIslow("logon","month"+(n+1)); // cap shrill ansi

bbs.menu('../logon/covid19');
bbs.exec("?ctracker.js"); // covid tracker

bbs.exec("?events.js");
mystMenu('437');
randomANSIslow("logon","1"); // cap shrill ansi

mystMenu('437');
randomANSIslow("logon","2"); // network promo

mystMenu('437');
randomANSIslow("logon","3"); // game promo

mystMenu('437');
bbs.exec("*oneliners"); // not by MrO

//mystMenu(conf.fontcode);	
bbs.exec_xtrn("ONELIN3R"); // networked ones

var n = new File("/sbbs/data/subs/notices.hash")
var u = user.stats.laston_date
if (u < n.date )
 bbs.exec("?/sbbs/xtrn/bullshit/bullshit.js bulletins");
	} 
