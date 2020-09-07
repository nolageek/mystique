var   BLACK			='\1n\1k';			/* dark colors (HIGH bit unset) */
var   BLUE			='\1n\1c';
var   GREEN			='\1n\1g';
var   CYAN			='\1n\1c';
var   RED			='\1n\1r';
var   MAGENTA		='\1n\1m';
var   BROWN			='\1n\1y';
var   LIGHTGRAY		='\1n\1w';
var   DARKGRAY		='\1h\1k';			/* light colors (HIGH bit set) */
var   LIGHTBLUE		='\1h\1b';
var   LIGHTGREEN	='\1h\1g';
var   LIGHTCYAN		='\1h\1c';
var   LIGHTRED		='\1h\1r';
var   LIGHTMAGENTA	='\1h\1m';
var   YELLOW		='\1h\1y';
var   WHITE			='\1h\1w';

var   BG_BLACK		='\0010';
var   BG_BLUE		='\0014';
var   BG_GREEN		='\0012';
var   BG_CYAN		='\0016';
var   BG_RED		='\0011';
var   BG_MAGENTA	='\0015';
var   BG_BROWN		='\0013';
var   BG_LIGHTGRAY	='\0017';

var   RESETCOLOR	=BG_BLACK+LIGHTGRAY;

// SET DEFAULT VALUES
// set up default colors; in case no theme settings.js file is found.


var colors = {
	'fg' : WHITE,      // Non-highlighted item foreground
	'bg' : BG_BLACK,   // Non-highlighted item background
	'lfg' : WHITE,     // Highlighted item foreground
	'lbg' : BG_RED,   // Highlighted item background
	'sfg' : WHITE,     // Path/status-bar foreground
	'sbg' : BG_CYAN,   // Path/status-bar background
	'hfg' : LIGHTGRAY, // Header foreground
	'hbg' : BG_BLACK   // Header background
};

