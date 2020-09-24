	load("sbbsdefs.js");
	load("rss-atom.js");
	load("http.js");
	//load("myst_functions.js");
	load("utf8_cp437.js");
	
	//console.clear(BG_BLACK|LIGHTGRAY);
	
	var feeds = [
	
			//  TOP STORIES
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-TOP]" },
					{ url: "http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml?edition=uk", name: "BBC News - Top Stories" },
					{ url: "http://rss.cnn.com/rss/cnn_topstories.rss", name: "CNN News - Top Stories" },
					
			// 	WORLD
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-WORLD]" },
					{ url: "https://www.aljazeera.com/xml/rss/all.xml", name: "Al Jazeera" },
					{ url: "http://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml", name: "BBC News - World" },
					{ url: "https://www.huffpost.com/section/world-news/feed", name: "Huffington Post - World News" },

			//	US
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-US]" },
					{ url: "https://www.huffpost.com/section/us-news/feed", name: "Huffington Post - US News" },
			//	LOCAL
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-LOCAL]" },
					{ url: "https://dcist.com/feed/", name: "DCist" },
					{ url: "https://local.theonion.com/rss", name: "Onion - Local" },
					//{ url: "http://www.baltimoresun.com/arcio/rss/category/latest/", name: "Baltimore Sun - Top Stories" },
					//{ url: "https://www.baltimoresun.com/arcio/rss/category/maryland/baltimore-city", name: "Baltimore Sun - Baltimore" },
					{ url: "http://baltimorebeat.com/feed/", name: "Baltimore Beat" },
					
					
			//	CULTURE
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-CULTURE]" },
					{ url: "https://theintercept.com/feed/?lang=en", name: "The Intercept" },
					{ url: "https://jezebel.com/rss", name: "Jezebel" },
					{ url: "https://www.theroot.com/rss", name: "The Root" },
					{ url: "https://www.splcenter.org/hatewatch/rss.xml", name: "Southern Poverty Law Center - Hatewatch" },
			//	BUSINESS
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-BUSINESS]" },
					{ url: "http://feeds.bbci.co.uk/news/video_and_audio/business/rss.xml", name: "BBS News - Business" },
			//	POLITICS
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-POLITICS]" },
					{ url: "http://feeds.bbci.co.uk/news/video_and_audio/politics/rss.xml", name: "BBC News - Politics" },
					{ url: "https://fivethirtyeight.com/politics/feed/", name: "538 - Politics" },
					{ url: "https://politics.theonion.com/rss", name: "Onion - Politics" },
			//	HEALTH
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-HEALTH]" },
					{ url: "http://feeds.bbci.co.uk/news/video_and_audio/health/rss.xml", name: "BBS News - Health" },
			//	SCIENCE
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-SCIENCE]" },
				//	{ url: "", name: "" },
					{ url: "http://feeds.bbci.co.uk/news/video_and_audio/science_and_environment/rss.xml", name: "BBC News - Science & Environment" },
			
			//	TECH
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-TECHNOLOGY]" },
					{ url: "http://feeds.feedburner.com/TheHackersNews?format=rss", name: "The Hacker News" },
					{ url: "https://www.darkreading.com/rss_simple.asp", name: "Dark Reading" },
					{ url: "https://nakedsecurity.sophos.com/feed/", name: "Naked Security" },
				//	{ url: "http://feeds.bbci.co.uk/news/video_and_audio/technology/rss.xml", name: "BBC - Technology" },
					
			
					

			//	SPORTS
			
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-SPORTS]" },
					{ url: "https://fivethirtyeight.com/sports/feed/", name: "538 - Sports" },
					{ url: "https://www.espn.com/espn/rss/news", name: "ESPN - Top Stories" },
					{ url: "https://www.espn.com/espn/rss/nfl/news", name: "ESPN - NFL" },
					{ url: "https://www.espn.com/espn/rss/nba/news", name: "ESPN - NBA" },
					{ url: "https://www.espn.com/espn/rss/mlb/news", name: "ESPN - MLB" },
					{ url: "https://www.espn.com/espn/rss/nhl/news", name: "ESPN - NHL" },
					{ url: "https://www.espn.com/espn/rss/rpm/news", name: "ESPN - Motorsports" },
					{ url: "https://www.espn.com/espn/rss/soccer/news", name: "ESPN - Soccer" },
					{ url: "https://www.espn.com/espn/rss/espnu/news", name: "ESPNU" },
					{ url: "https://www.espn.com/espn/rss/ncf/news", name: "ESPN - College Football" },
					{ url: "https://www.espn.com/espn/rss/poker/master", name: "ESPN - College Poker" },
					{ url: "https://sports.theonion.com/rss", name: "Onion - Sports" },
			//	ENTERTAINMENT
					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-ENTERTAINMENT]" },
					{ url: "https://usa.newonnetflix.info/feed.php", name: "New On NETFLIX" },
					{ url: "https://bloody-disgusting.com/feed/", name: "Bloody Disgusting" },
					{ url: "https://bloody-disgusting.com/movie/feed/", name: "Bloody Disgusting - Movies" },
					{ url: "https://bloody-disgusting.com/tv/feed/", name: "Bloody Disgusting - TV" },
					{ url: "https://joebobbriggs.com/feed/", name: "Joe Bob Briggs" },					
					{ url: "https://entertainment.theonion.com/rss", name: "Onion - Entertainment" },
					{ url: "https://www.huffpost.com/section/entertainment/feed", name: "Huffington Post - Entertainment" },
					{ url: "https://www.latest-ufo-sightings.net/feed", name: "Latest UFO Sightings" },
		//	NOT WORKING	{ url: "https://store.steampowered.com/feeds/news.xml", name: "Valve News Updates" },
			//	GAMING
//					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-GAMING]" },
					//{ url: "https://forum.deadbydaylight.com/en/categories/general-news/feed.rss", name: "Dead By Daylight News" },
					{ url: "https://ogn.theonion.com/rss", name: "Onion - Gaming" },
					{ url: "https://nintendoeverything.com/category/news/feed/", name: "Nintendo Everything" },
			//	BBSing
//					{ url: "http://10.0.0.221/empty.rss", name: "[RSS-BBSING]" },
					{ url: "https://www.telnetbbsguide.com/bbs/feed/", name: "Telnet BBS Guide - New Listings" },
					{ url: "https://www.telnetbbsguide.com/feed/", name: "Telnet BBS Guide - Blog" },
				//	{ url: "https://www.reddit.com/r/bbs/top.rss?t=week", name: "/r/bbs New Posts" },
					{ url: "https://gitlab.synchro.net/sbbs/sbbs/-/commits/master?format=atom", name: "Synchronet Gitlab Commits" },
					
					]

	var list = new File("/sbbs/text/bulletins/rsslist.txt");
	list.open('w');

	for (var a = 0; a < feeds.length; a++) {
	try {
	var f = new Feed(feeds[a].url);
	} catch(err) {
		console.putmsg("\r\nError ..." + feeds[a].name + "\r\n");
	}
	console.putmsg("\r\nTesting ..." + feeds[a].name + "\r\n");
	for(var c = 0; c < f.channels.length; c++) {
		
	var filename = "/sbbs/text/bulletins/" + feeds[a].name.replace(/[\s]/g, '') + ".ans";
	
	if (feeds[a].name.indexOf("RSS") !== -1) {
		list.writeln("\r" + feeds[a].name);
		} else {
		list.writeln(feeds[a].name + " = " + filename);

		var file = new File(filename);
		console.putmsg("\r\n* " + feeds[a].name);

		file.open('w');
		for(var i = 0; i < 5; i++) {
		var date = f.channels[c].items[i].date
		var shortlink = getShortURL(f.channels[c].items[i].link);
		
		var title = utf8_cp437(f.channels[c].items[i].title);//.replace(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g, '$1\n');
			title = word_wrap(title,line_length=70)
		var body = utf8_cp437(f.channels[c].items[i].body);
			body = cleanUp(body);
			body = word_wrap(body,line_length=70)
		
		file.writeln("[0m[36m" + date + " [1m" + shortlink);
			file.writeln("[1m[37m" + title);
			file.writeln("[A[35m" + body);

		}
		file.writeln("[32m- -- ----------------------------------------------------------------- -- -");
				}
	}

	}
	list.close();



function getShortURL(longURL) {
     var request = new HTTPRequest();
     var bitlyAPI = "http://api.bit.ly/v3/shorten?login=inshirtandtie&apiKey=R_1b0901de7abbb1620568f018451a71d9&longUrl="
     var bitlyFullURL = bitlyAPI + longURL;
     var response = request.Get(bitlyFullURL);
     var obj = JSON.parse(response);
     return obj.data.url;
}

function cleanUp(str) {
      if ((str===null) || (str===''))
      return false;
      else
      str = str.toString();
  	  str = str.replace( /(<([^>]+)>)/ig, '');
	  str = str.replace( /&#8220;|&#8221;/ig, '"');
	  str = str.replace( /&#8216;|&#8217;/ig, "'");
      str = str.replace( /&#8230;/ig, '...');
	  return str;
   }
