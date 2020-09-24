/* $Id$ */
/* External Section Replacement. */
/* Created By tracker1(at)theroughnecks(dot)net */

/* Begin includes ************************************************************/
load("sbbsdefs.js");
load("mods.vanguard.selectList.js"); //selectList tool
load("ansislow.js"); //ansi display control
//load("myst_functions.js");
load("myst_settings.js");

//var mystSettings 	= system.text_dir + 'menu/' + user.command_shell + '/myst_settings.js';

if (!bbs.mods) bbs.mods = {}
if (!bbs.mods.vanguard) bbs.mods.vanguard = {}
if (!bbs.mods.vanguard.assault) bbs.mods.vanguard.assault = {}
if (!bbs.mods.vanguard.assault.xtrn_sec) bbs.mods.vanguard.assault.xtrn_sec = {}
/* End includes **************************************************************/

/* Begin selectListSettings **************************************************/
bbs.mods.vanguard.assault.xtrn_sec.select_options = {};
bbs.mods.vanguard.assault.xtrn_sec.select_options.x1 = 51; // left col
bbs.mods.vanguard.assault.xtrn_sec.select_options.y1 = 7; // top row
bbs.mods.vanguard.assault.xtrn_sec.select_options.x2 = 79; //right col
bbs.mods.vanguard.assault.xtrn_sec.select_options.y2 = 22;// last row if using a js shell use  .. load("mods.vanguard.xtrn_sec.js");
/* End selectListSettings ****************************************************/

/* Begin Initialize **********************************************************/
bbs.mods.vanguard.assault.xtrn_sec.options = {}
bbs.mods.vanguard.assault.xtrn_sec.options.mainExit = false;
/* End Initialize ************************************************************/

// Method to load the ansi display.
bbs.mods.vanguard.assault.xtrn_sec.loadAnsi = function() {
	bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = false;
	console.line_counter = 0;
	console.clear();
		bbs.menu(conf.fontcode);
        bbs.menu(user.command_shell + '/doors'); 
		// MENU_DIR/vanguard/assault/xtrn_sec.ans
	console.line_counter = 0;
}

// handle raised/control characters
bbs.mods.vanguard.assault.xtrn_sec.ctrl_handler = function(k) {
	//display awaiting messages
	if (k == "" && ((system.node_list[bbs.node_num-1].misc&NODE_NMSG) != 0)||((system.node_list[bbs.node_num-1].misc&NODE_MSGW) != 0)) {
		console.line_counter = 0;
                console.print("\1"+"0\1n\1l\1cIncoming Messsage(s) \r\n\1h\1k---\1n\r\n");
		sleep(500); //sleep before to let any messages finish.
		while (((system.node_list[bbs.node_num-1].misc&NODE_NMSG) != 0)||((system.node_list[bbs.node_num-1].misc&NODE_MSGW) != 0)) {
			bbs.nodesync();
			sleep(1000); //longer wait after message (sometimes multiple msgs from logon/off).
		}
		console.print("\1h\1k---\1n\r\n");
		
		bbs.sys_status &= ~SS_ABORT;
		while (console.inkey() != "") {/*do nothing - clear buffer*/};
		console.pause();
		bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;
		console.putmsg(k.charCodeAt(0));
	} else if (k.charCodeAt(0) < 82)  {
		console.line_counter = 0;
		console.clear();
		console.line_counter = 0;
		
		if (k.toString().length) {
			switch(k.charCodeAt(0)) {
				case 26: //ctrl-z - unfiltered input - ignore
					break;
				case 3: //ctrl-c
				case 27: //escape
				case 113: //q
				case 81: //Q
					bbs.mods.vanguard.assault.xtrn_sec.options.mainExit = true;
					break;
				case 11: //ctrl-k - hotkey listing
				case 20: //ctrl-t - time listing
					console.handle_ctrlkey(k,0); // for now
					console.pause();
					break;
				default:
					console.handle_ctrlkey(k,0); // for now
					break;
				
			} 
		} 

		
		
		bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;
	} 	
}

//returns a sub selection
bbs.mods.vanguard.assault.xtrn_sec.runProgram = function(current_group) {
	var iCount = 0;
	var iCurrent = 0;
	var options = new Array();
	var _group = xtrn_area.sec_list[current_group]
	var x;
	var pref = "";
	options[""] = "<--(back)";
	
	//populate list based on _group
	if (_group) {
		for (x in _group.prog_list) {
			if (user.compare_ars(_group.prog_list[x].ars)) {
				var prefCode = _group.prog_list[x].code.substring(0,2);
				if ( prefCode == "dp") {
					pref = "\1h\1m";
				} else if (prefCode == "bb") {
					pref = "\1h\1y";
				} else if (prefCode == "ex") {
					pref = "\1h\1b";
				} else if (prefCode == "co") {
					pref = "\1h\1g";
				} else if (prefCode == "bc") {
				pref = "\1h\1r";
					} else {
					pref = "";
				}
				options[x] = pref + _group.prog_list[x].name;
			}
		}
	}
	
	var sl = new bbs.mods.vanguard.selectList(options,bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1+3,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2,bbs.mods.vanguard.assault.xtrn_sec.select_options.y2);
	sl.padText = true;
	sl.current = 0;
	
	bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;

	while (bbs.online && !bbs.mods.vanguard.assault.xtrn_sec.options.mainExit) {
		if (bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi == true) {
			bbs.mods.vanguard.assault.xtrn_sec.loadAnsi();
			console.gotoxy(bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1);
			print("\1n\1"+"7\1k" + ("SECTION: \1b" + _group.name + sl.padding).substring(0,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2 - bbs.mods.vanguard.assault.xtrn_sec.select_options.x1+2));
			console.gotoxy(bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1+1);
                        print("\1n\1"+"7\1k" + ("Note:Hit ESC to Exit" + sl.padding).substring(0,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2 - bbs.mods.vanguard.assault.xtrn_sec.select_options.x1));
			console.gotoxy(bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1+2);
			print("\1n" + sl.padding.replace(/ /g,"-").substring(0,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2 - bbs.mods.vanguard.assault.xtrn_sec.select_options.x1));
		}
		
		var k = sl.choose();
		if (sl.raised != null) {
			bbs.mods.vanguard.assault.xtrn_sec.ctrl_handler(sl.raised);
		} else if (k == "") {
			return;
		} else {
// ADDING DOORSCAN.JS
		bbs.menu("437");
		load("../xtrn/doorscan/doorscan.js","run",_group.prog_list[k].code);
//			bbs.exec_xtrn(_group.prog_list[k].code);

			if (console.line_count)
				console.pause();
			bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;
		}
	}
}

bbs.mods.vanguard.assault.xtrn_sec.getgrp = function(current_group) {
	var iCount = 0;
	var iCurrent = 0;
	var options = new Array();
	options[""] = "<--(back)";
	var x;
	for (x in xtrn_area.sec_list) {
		if (user.compare_ars(xtrn_area.sec_list[x])) {
			iCount++;
			options[x] = xtrn_area.sec_list[x].name;
			if (x == current_group)
				iCurrent = iCount;
		}			
	}
	if (!iCount) {
		console.line_count = 0;
		console.clear();
		console.print("\1n\1h\1rWarning:\1n \r\nYou do not have access to any external sections\r\n");
		console.pause();
		return "";
	}
			
	var sl = new bbs.mods.vanguard.selectList(options,bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1+2,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2,bbs.mods.vanguard.assault.xtrn_sec.select_options.y2);
	sl.current = iCurrent;
	sl.padText = true;
	sl.showKeys = false;
	
	bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;
	while (bbs.online && !bbs.mods.vanguard.assault.xtrn_sec.options.mainExit) {
		if (bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi == true) {
			bbs.mods.vanguard.assault.xtrn_sec.loadAnsi();
			console.gotoxy(bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1);
			print("\1n\1"+"7\1k" + ("Select a section."+sl.padding).substring(0,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2 - bbs.mods.vanguard.assault.xtrn_sec.select_options.x1));
			console.gotoxy(bbs.mods.vanguard.assault.xtrn_sec.select_options.x1,bbs.mods.vanguard.assault.xtrn_sec.select_options.y1+1);
			print("\1n" + sl.padding.replace(/ /g,"-").substring(0,bbs.mods.vanguard.assault.xtrn_sec.select_options.x2 - bbs.mods.vanguard.assault.xtrn_sec.select_options.x1));
		}

		var k = sl.choose();
		if (sl.raised != null)
			bbs.mods.vanguard.assault.xtrn_sec.ctrl_handler(sl.raised);
		else if (k == "")
			return "";
		else
			return k;
	}
	bbs.mods.vanguard.assault.xtrn_sec.options.mainExit = false;
	return "";
}

//msg_sec starting point
bbs.mods.vanguard.assault.xtrn_sec.main = function() {
	try {
		system.node_list[bbs.node_num-1].action = NODE_XTRN;
		
		//bbs.trace.write("vanguard.assault.xtrn_sec","begin main()");
		if (console.line_counter)
			console.pause();
		
		console.status &= ~CON_RAW_IN; // no raw input
		var exit_menu = false;

		bbs.mods.vanguard.assault.xtrn_sec.options.mainExit = false;
		bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;
		var current_group = "";
		while (bbs.online && !bbs.mods.vanguard.assault.xtrn_sec.options.mainExit) {
			var k = bbs.mods.vanguard.assault.xtrn_sec.getgrp(current_group);
			if (!k || k == "") {
				bbs.mods.vanguard.assault.xtrn_sec.options.mainExit = true;
			} else if (xtrn_area.sec_list[k]) {
				print("\1n ");
				current_group = k;
				bbs.mods.vanguard.assault.xtrn_sec.runProgram(k);
				bbs.mods.vanguard.assault.xtrn_sec.options.mainExit = false; //only drop from runProgram to grouplist
				bbs.mods.vanguard.assault.xtrn_sec.options.reloadAnsi = true;
			}
		}
		
		//bbs.trace.write("vanguard.assault.xtrn_sec","end main()");
	} catch(err) {
		bbs.trace.render(err);
	}
	console.line_counter = 0;
	console.clear();
}
if (user.settings & USER_ANSI)
	bbs.mods.vanguard.assault.xtrn_sec.main(); //ansi
else
	bbs.xtrn_sec(); //not ansi

/* Begin trace/debug settings ************************************************/
if (bbs.mods.vanguard.assault.xtrn_sec.debug) {
	if (bbs.mods.vanguard.assault.xtrn_sec.firstTrace) {
		//bbs.trace.close();
		//bbs.trace.enabled = false;
	}
	//bbs.trace.merge();
}
/* End trace/debug settings **************************************************/
