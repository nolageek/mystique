load('sbbsdefs.js');

function showRumor() {
	var rumorFile = 'c:\\sbbs\\mods\\rumor.txt';
	f = new File(rumorFile);
	if (!f.open('r')) {
		alert("Error opening file: " + rumorFile);
		return;
	}
	var all = f.readAll();
	f.close();
	var rumor = all[Math.floor(Math.random()*all.length)];
	console.putmsg('  \1h\1brumor:\1n\1w [' + rpad(rumor,75) + '\1n\1w]');
}

showRumor();

function rpad(str, length, padString) {
    if (!padString)
            var padString = ' ';
    if (str.length > length)
        str = str.substring(0, length);
    while (str.length < length)
        str = str + padString;
        
    return str;
}