const tinyfeedreader = require ("../tinyfeedreader.js");

const options = {
	feedUrls: ["https://dave.linkblog.org/", "http://scripting.com/rss.xml"],
	newItemCallback: function (feedUrl, theItem) {
		console.log ("new item from tinyFeedReader: feedUrl == " + feedUrl + ", theItem == " + utils.jsonStringify (theItem));
		}
	};
tinyfeedreader.start (options);
