load("sbbsdefs.js");

var m_color = [];
    m_color.BLACK         = '\1n\1k';            /* dark colors (HIGH bit unset) */
    m_color.BLUE          = '\1n\1c';
    m_color.GREEN         = '\1n\1g';
    m_color.CYAN          = '\1n\1c';
    m_color.RED           = '\1n\1r';
    m_color.MAGENTA       = '\1n\1m';
    m_color.BROWN         = '\1n\1y';
    m_color.LIGHTGRAY     = '\1n\1w';
    m_color.DARKGRAY      = '\1h\1k';            /* light colors (HIGH bit set) */
    m_color.LIGHTBLUE     = '\1h\1b';
    m_color.LIGHTGREEN    = '\1h\1g';
    m_color.LIGHTCYAN     = '\1h\1c';
    m_color.LIGHTRED      = '\1h\1r';
    m_color.LIGHTMAGENTA  = '\1h\1m';
    m_color.YELLOW        = '\1h\1y';
    m_color.WHITE         = '\1h\1w';

    m_color.BG_BLACK      = '\0010';
    m_color.BG_BLUE       = '\0014';
    m_color.BG_GREEN      = '\0012';
    m_color.BG_CYAN       = '\0016';
    m_color.BG_RED        = '\0011';
    m_color.BG_MAGENTA    = '\0015';
    m_color.BG_BROWN      = '\0013';
    m_color.BG_LIGHTGRAY  = '\0017';
    m_color.RESETCOLOR	  =	m_color.BG_BLACK + m_color.LIGHTGRAY;

var colors = {
	'fg'  : m_color.WHITE,      // Non-highlighted item foreground
	'bg'  : m_color.BG_BLACK,   // Non-highlighted item background
	'lfg' : m_color.WHITE,     // Highlighted item foreground
	'lbg' : m_color.BG_RED,   // Highlighted item background
	'sfg' : m_color.WHITE,     // Path/status-bar foreground
	'sbg' : m_color.BG_CYAN,   // Path/status-bar background
	'hfg' : m_color.LIGHTGRAY, // Header foreground
	'hbg' : m_color.BG_BLACK   // Header background
};

var color = [];
	color.dark		= 	m_color.DARKGRAY;
	color.normal	= 	m_color.LIGHTGRAY;
	color.bright	=	m_color.WHITE;
	color.reset		=	m_color.RESETCOLOR;
	color.alert		=	m_color.BG_RED+	m_color.WHITE;
	color.yes		=	m_color.BG_GREEN+	m_color.WHITE;
	color.info		=	m_color.BG_LIGHTGRAY+color.bright;
	color.select	=	m_color.BG_BLUE+color.bright;



var mystColors 	= system.text_dir + 'menu/' + user.command_shell + '/myst_colors.js';
if (file_exists(mystColors))
	load(mystColors)
