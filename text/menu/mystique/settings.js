var color = {
	txt_menu	: '\1h\1b', // Menu name
	txt_user 	: '\1h\1c', // username in menus 
	txt_sym 	: '\1n\1b', // symbols color @, [ ], ( ),etc..
	txt_sym2 	: '\1h\1c', // symbol highlght (numbers in [1], menu options [A], etc..)
	txt_text 	: '\1h\1b', // color for most text
	txt_text2 	: '\1h\1m', // aux color for text, bold words, values, etc...
	txt_ques 	: '\1h\1y', // color for question prompts
	txt_alert 	: '\1h\1r', // color for alert text
	txt_success : '\1h\1g', // color for success text
	txt_info 	: '\1h\1c', // color for info text 
	def_text 	: '\1h\1b', // defaults option text
	def_value 	: '\1h\1c', // defaults current value
	def_on 		: '\1n\1c', // defaults 'on' color
	def_off 	: '\1n\1c', // defaults 'off' color
	def_head 	: '\1h\1w'  // defaults header
}

var conf = {
//	ddmsgread	: '?../xtrn/DDMsgReader/DDMsgReader.js', // command for DDMsgReader if installed
	ddmsgread	: '',
//	dmnewscan	: '?DM_NewScanConfig.js' // command for DM_NewScanConfig if installed
	dmnewscan	: '',
	rumorFile 	: system.mods_dir + '\\rumor.txt',
	rumorHeader : 'rumors',
	rumorFooter : 'footer',
	param		: argv[0]
}