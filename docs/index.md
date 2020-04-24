# Installation

# Menu Files
Place menu files in a directory within sbbs\text\menu\ that correlates to the code used for the menu set in SCFG. If no file is used in user's current menu dir, one will be used from the sbbs\text\menu\mystique directory.

All menus can have multiple files and one will be chosen at random. main.ans, main1.ans, main2.ans, main-a.ans, main-b.ans, main-skull, main-castle are all valid file names for the main menu.

## File Names

* **main.ans**: Main Menu
* **mesg.ans**: Message Menu
  * **mail.ans**: Mail Menu 
* **scores.ans**: Scores Menu
* **system.ans**: System Menu
  * **userinfo.ans**: User Info
* **chat.ans**: Chat Menu
  * **irc.ans**: IRC Menu
* **xfer.ans**: Transfers Menu
* **obsc.ans**: Obscure Commands
* **goodbye.ans**: Logoff

## Headers
* **header.ans**: Default header, used if the following menu specific header files are not found.
* **hdr-online.ans**: Displayed above node list.
* **hdr-userlist.ans**: Displayed above User List
* **hdr-userinfo.ans**: Displayed above Current User Info


## Commands
### Main Menu
* ? Display Menu 
* ! Log Off (Fast)
* ; or : or . SysOp Commands
* / Slash Commands (Global)
* 1 One Liners
* A Automessage
* C Chat Menu
* D Defaults
* F File Menu
* G or T Text Files
* I or S System Information
* L Last x Callers
* M Messages Menu
* O Log Off
* R Rumors
* W Who Is Online
* X Xternal Programs (Doors)

### Messages Menu
* ? Display Menu 
* ! Log Off (Fast)
* / Slash Commands (Global)
* } or UP ARROW Next Message Group
* { or DOWN ARROW Previous Message Group
* ] or RIGHT ARROW Next Message Area
* [ or LEFT ARROW Previous Message Area
* C Configure Message Scan
* D Defaults
* E Email Menu
* F or G Find text in Messages
* J Jump to Message Group
* I Information on Current Message Area
* L List Messages in Current Message Area
* N New Message Scan
* O Log Off
* P Post New Message
* Q Quit to Main Menu
* R or ENTER Read Messages in Current Message Area
* S Scan for Messages to You

### Email Menu
* F Feedback to SysOp
* O Outbox
* Q Quit to Main Menu
* R Read Mail
* S Send Mail

### System Menu
* L Last Callers
* Q Quit to Main Menu
* S System Information
* U Userlist
* V BBS Version Information
* W Who is Online
* Y Your User Information

### Chat Menu Menu
* A Center of Awareness Chat
* I Synchronet InterBBS Messaging
* J Multinode Chat
* M MRC Chat
* N Page Sysop
* P Private Chat
* Q Quit to Message Menu
* R IRC Chat

### IRC Menu
* 1
* 2
* 3
* 4
* Q
### Transfer Menu
* ? Display Menu 
* ! Log Off (Fast)
* / Slash Commands (Global)
* } or UP ARROW Next File Group
* { or DOWN ARROW Previous File Group
* ] or RIGHT ARROW Next File Area
* [ or LEFT ARROW Previous File Area
* B Batch Menu
* D Download File(s)
* F Find text in File Descriptions
* G or J Jump to File Group
* L or ENTER List Files in Current Area
* N New File Scan
* O Log Off
* Q Quit to Main Menu
* S Scan for Test in File Names
* U Upload New File

### Slash Menu
* /? Display Menu
* /A Avatar Chooser
* /C MRC Chat
* /D ?xtrn_sec
* /G xferMenu()
* /N New Scan All
* /O Logoff Fast
* /S Scores Menu
* /W bbs.xtrn_sec()
* /X Toggle Xpert Mode ***
