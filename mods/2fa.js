load("sbbsdefs.js");
load('qrcode.js');
load('totp.js');
load('sha.js');

/* Settings */
var skip = false;
// Set to true if you want to disable it altogether

var force = false;
// Set to false if you want to give them the option when the log in Z(but wont hang up if they say no unless...

var hangup = true;
// Set to true if you want to hangup after failed validation.


var sysop_bypass = false;
// Allow sysop bypass for 2FA 


var bbsname = "CAP SHRILL"
bbsname = bbsname.substring(0, 10);
// BBS name used in QRCode. Limit to 10 characters to reduce QRCode size. IMPORTANT.

/* END SETTINGS */


var userprops = load({}, 'userprops.js');
var secret = userprops.get('2FA', 'htop_secret', undefined, user.number);
var param = argv[0];

var qr = qrcode(0, 'M');

if (param == 'enable') {
    otp_enable();
} else if (param == 'disable') {
    otp_disable();
} else {
    otp_validate(secret);
}

function randomString(keyLength) {
    var i, key = "",
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var charactersLength = characters.length;
    for (i = 0; i < keyLength; i++) {
        key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
    }
    return key;
}



function otp_disable() {
    if (user.security.flags2 & UFLAG_O) {
        if (!console.noyes("\1h\1mAre you sure you want to disable 2fa \1n\1m(\1h\1rNOT RECOMMENDED\1n\1m)\1n")) {
            user.security.flags2 &= ~UFLAG_O;
            userprops.set('2FA', 'htop_secret', '', user.number);
            console.putmsg("\1h\1m2FA is \1h\1rDISABLED\1n\r\n")
			console.pause();
        }

    } else {
        console.putmsg("\1h\1m2FA is \1h\1rNOT ENABLED\1n\r\n")
		console.pause();
    }

}


function otp_enable() {
		if(skip == true)
		return;
	
    if (secret != undefined) {
        console.putmsg(" \1h\1m2FA is \1h\1gENABLED\1n")
    } else {
		var go = false;
        secret = randomString(16)
		

		
        if (force == true)
			console.putmsg("\r\n\1h\1mThis BBS requires 2-Factor Authentication.\r\n")
		if (force == true)
			go = true;
		else
        if (!console.noyes("\1h\1mWould you like to enable 2FA \1n\1m(\1h\1gRECOMENDED\1n\1m)\1n"))
			go = true;
	
        if (go == true) {
            console.clear();
            console.putmsg("[0;0 D")
            console.crlf();
            string = 'otpauth://totp/' + bbsname + ':' + user.alias + '?secret=' + secret + '&issuer=' + bbsname;
            qr.addData(string);
            qr.make();
            var str = qr.createCP437();
            console.putmsg(str);
            console.putmsg("@GOTOXY:42,2@\1n\1cThe secret key and QR Code are\1n");
            console.putmsg("@GOTOXY:42,3@\1n\1cvalid with any TOTP 2FA application.\1n");
            console.putmsg("@GOTOXY:42,5@\1n\1cSome compatible 2FA apps are:\1n");
            console.putmsg("@GOTOXY:42,6@\1h\1c * Authy\1n");
            console.putmsg("@GOTOXY:42,8@\1h\1c * Google Authenticator\1n");
            console.putmsg("@GOTOXY:42,9@\1h\1c * LastPass Authenticator\1n");
            console.putmsg("@GOTOXY:42,10@\1h\1c * Microsoft Authenticator\1n");
            console.putmsg("@GOTOXY:42,11@\1h\1c * Okta Authenticator\1n");
            console.putmsg("@GOTOXY:42,12@\1h\1c * Protectimus Authenticator\1n");
            console.putmsg("@GOTOXY:42,15@\1h\1bYour secret key is \1h\1w" + secret + "\1h\1b.\1n");
            console.putmsg("@GOTOXY:42,16@\1h\1b<-- Your QRCode.\1n")
            console.putmsg("@GOTOXY:42,18@\1h\1wPress Any Key \1h\1conce you have\1n")
            console.putmsg("@GOTOXY:42,19@\1h\1cscanned the QRCode or entered your\1n")
            console.putmsg("@GOTOXY:42,20@\1h\1csecret key.\1n")
			console.gotoxy(2,console.screen_rows);
			console.pause();
			
			console.clear();
            console.putmsg("\1h\1rBefore we can enable 2FA, you must validate!\1n\r\n")


            var validated = otp_validate(secret)

            if (validated == true) {
                console.putmsg("\r\n\1h\1cValidated! \1h\1g2FA enabled! \1h\1mYou will be required to use this when logging on.\1n\r\n")
                userprops.set('2FA', 'htop_secret', secret, user.number);
                user.security.flags2 ^= UFLAG_O;
            } else {
                console.putmsg("\r\n\1h\1rThere was a problem with your validation.\1n");
				console.gotoxy(2,console.screen_rows);
				console.pause();

            }
        }
    }
}


function otp_validate(secret, hangup) {
    if (secret == undefined) {
        otp_enable();
        return;
    }

    if (sysop_bypass == true)
        if (user.is_sysop) {
            console.putmsg("\r\n \1h\1w>\1n\1w>\1n\1w> \1n\1r 2FA SYSOP BYPASS ENABLED.");
            sleep(500);
            return;
        }

    console.putmsg("\1h\1c> \1n\1c2-Factor Authentication\1n\r\n");
    console.putmsg("\1n\1c> \1h\1cEnter your 6 digit code: \1h\1w");
    console.pushxy()
    var validate = false;
    var i = 0;
    while (validate == 0 && i < 3) {
        var input = console.getstr(maxlen = 6, mode = K_NUMBER);
        var totpObj = new TOTP();
        if (input == totpObj.getOTP(secret))
            validate = true;
        else
            i++

        console.popxy()
        if (validate == false)
            console.putmsg("\1h\1rFAILURE!\1n");
        else
            console.putmsg("\1h\1gSUCCESS!\1n");
        sleep(500);
        console.popxy()
        console.cleartoeol()
    }

    if (validate == false)
        bbs.email(1, subject = '2FA Failure');

    if ((validate == false) && (hangup == true))
		bbs.hangup(false);
    else
        return validate


}