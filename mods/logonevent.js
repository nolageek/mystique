load("sbbsdefs.js"); // load helper functions

user.security.flags1|=UFLAG_H;
//bbs.select_shell();
bbs.exec('*fastlogin');
console.clear();

//bbs.exec('*../xtrn/doorscan/doorscan.js scan');

bbs.exec('*lastcallers.js 6');

console.clear();