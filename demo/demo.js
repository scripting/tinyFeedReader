const tinyfeedreader = require ("../tinyfeedreader.js");

//6/27/25 by DW
	//this app reads three feeds once a minute, and calls newItemCallback when an item arrives in one of them.
	//feedUrl, one of the parameters to newItemCallback, tells you which feed the item came from. 
	//theItem, the other parameter, is an object that contains  the information we have about the item.

const options = {
	feedUrls: [
		"https://dave.linkblog.org/", //new linkblog, want to completely switch to this
		"http://scripting.com/rss.xml", //the longest continually updated RSS feed in the known universe
		"http://data.feedland.org/feeds/davewiner.xml" //old linkblog, still works
		],
	secsBetwChecks: 60,
	maxGuids: 100, //small number for testing, in general it's better to use the default of 2500
	newItemCallback: function (feedUrl, theItem) {
		console.log ("\nnew item from tinyFeedReader: feedUrl == " + feedUrl + ", theItem == " + JSON.stringify (theItem, undefined, 4) + "\n");
		}
	};
tinyfeedreader.start (options);
