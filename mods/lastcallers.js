// Many thanks to tracker and ispyhumanfly for a lot of this code.
load("sbbsdefs.js");
load("settings.js");
load("functions.js");

function lastCallers(num) {

    if (!num) num = conf.rumorsNum;

    //clear the counter...
    //console.line_counter = 0;

    //console.clear();

    //now begin the last few callers module... 
    var show_count = num - 1; //number of logins to show...
    var u = new User(1); //user object...
    var laston_list = new Array(); //array to hold recent users...

    function UserLogin(user_number, user_laston) {
        this.number = user_number;
        this.logon = user_laston;
    }

    function sortByLogin(a, b) {
        return a.logon - b.logon;
    }

    var lastuser;
    if (system.lastuser == undefined)
        lastuser = system.stats.total_users;
    else
        lastuser = system.lastuser;

    for (var i = 1; i <= lastuser; i++) {
        u.number = i; //change to current user
        if (
            u.stats.total_logons > 0 &&
            u.compare_ars("NOT GUEST") &&
            ((u.settings & USER_DELETED) != USER_DELETED)
        )
            laston_list[laston_list.length] = new UserLogin(i, u.stats.laston_date);
    }

    laston_list.sort(sortByLogin);

    var start = (laston_list.length > show_count) ? laston_list.length - 1 - show_count : 0;
    //console.ansi_gotoxy(3,8);
    mystHeader('last10-h');
    //create a loop to display the last few callers...
    for (var i = start, j = 0; i < laston_list.length; i++, j++) {
        u.number = laston_list[i].number; //assign to user in list...

        //where you would like the data located...
        //console.ansi_gotox(3);

        //variable to display the connection type...
        var connection = u.connection.toUpperCase().substring(0, 3);
        var totlogins = (u.stats.total_logons + "       ").substring(0, 5);
        //variable to create the date and time format...
        var lastdate = strftime("%m/%d/%y ", u.stats.laston_date);
        var firstdate = strftime("%m/%d/%y ", u.stats.firston_date);

        var activit_posted = '-';
        var activit_gfiles = '-';
        var activit_feedback = '-';
        var activit_readmg = '-';
        var activit_hungup = '-';
        var activit_doors = '-';
        var activit_emails = '-';
        var activit_isnew = '-';

        if (lastdate == firstdate)
            activit_isnew = "\1h\1g\1IN\1n\1w";
        if (u.security.flags1 & UFLAG_P)
            activit_posted = 'P';
        if (u.security.flags1 & UFLAG_T)
            activit_gfiles = 'T';
        if (u.security.flags1 & UFLAG_F)
            activit_feedback = 'F';
        if (u.security.flags1 & UFLAG_R)
            activit_readmg = 'R';
        if ((u.security.flags1 & UFLAG_H) && (u.alias != user.alias))
            activit_hungup = 'H';
        if (u.security.flags1 & UFLAG_D)
            activit_doors = 'D';
        if (u.security.flags1 & UFLAG_E)
            activit_emails = 'E';

        var timelast = (u.stats.timeon_last_logon + "m");
        //how you want the information displayed via telnet...

        var active = " " + color.t_txt2 + rpad(u.alias, 14) + color.t_txt + " " + rpad(u.location, 23) + color.t_user + " " + rpad(u.command_shell.toUpperCase(), 9) + "\1n\1c" + rpad(timeSince(u.stats.laston_date), 8) + color.t_info + rpad(u.stats.timeon_last_logon + "m", 5) + color.t_sym + "[" + color.t_sym2 + activit_isnew + color.t_sym2 + activit_posted + activit_readmg + activit_feedback + activit_gfiles + activit_doors + activit_emails + activit_hungup + color.t_sym + "] " + color.t_txt + rpad(totlogins, 5) + "\r\n";


        //now create the desired output...
        console.putmsg(active);

    }
    mystMenu('last10-f');
}

function askLastCallers(int) {
    var num = int;
    console.crlf();
    if (num == 'undefined' || num == null) {
        console.putmsg(color.t_sym + '[' + color.t_sym2 + '?' + color.t_sym + '] ' + color.t_ques + 'How many callers would you like to list? ' + color.t_txt2 + '10 Max.' + color.t_sym + ' [' + color.t_sym2 + conf.rumorsNum + color.t_sym + ']');
        console.putmsg(color.t_sym + ' : ');
        num = console.getnum(10, conf.rumorsNum);
    }
    lastCallers(num);
}


function timeSince(ts) {
    now = new Date();
    ts = new Date(ts * 1000);
    var delta = now.getTime() - ts.getTime();

    delta = delta / 1000; //us to s

    var ps, pm, ph, pd, min, hou, sec, days;

    if (delta <= 59) {
        return delta + "s";
    }

    if (delta >= 60 && delta <= 3599) {
        min = Math.floor(delta / 60);
        sec = delta - (min * 60);
        return min + "m";
    }

    if (delta >= 3600 && delta <= 86399) {
        hou = Math.floor(delta / 3600);
        min = Math.floor((delta - (hou * 3600)) / 60);
        return hou + "h " + min + "m";
    }

    if (delta >= 86400) {
        days = Math.floor(delta / 86400);
        hou = Math.floor((delta - (days * 86400)) / 60 / 60);
        return days + "d " + hou + "h";
    }

}

if (!argv[0])
    askLastCallers();
else askLastCallers(argv[0]);