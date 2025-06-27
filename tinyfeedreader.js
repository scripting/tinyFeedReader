const myProductName = "tinyFeedReader", myVersion = "0.4.0"; 

exports.start = tinyFeedReader; 

const fs = require ("fs");
const utils = require ("daveutils"); 
const reallysimple = require ("reallysimple");

function tinyFeedReader (userOptions) {
	var options = {
		enabled: true,
		feedUrls: new Array (),
		secsBetwChecks: 60,
		fnameStats: "stats.json",
		maxGuids: 2500, //we don't store the guids forever, after we have this number of guids, we start deleting the oldest ones
		flOnlyPostNewItems: true,
		newItemCallback: function (feedUrl, theItem) {
			console.log (nowString () + ": newItemCallback: feedUrl == " + feedUrl + ", theItem == " + utils.jsonStringify (theItem));
			}
		}
	utils.mergeOptions (userOptions, options);
	
	var stats = {
		ctStarts: 0, whenLastStart: new Date (0),
		ctItemsSeen: 0, whenLastItem: new Date (0),
		ctNewItems: 0, whenLastNewItem: new Date (0),
		ctDeletedItems: 0, whenLastDeletedItem: new Date (0),
		guids: new Object ()
		};
	
	var flStatsChanged = false, whenLastCheck = new Date (0);
	
	function nowString () {
		return (new Date ().toLocaleTimeString ());
		}
	function statsChanged () {
		flStatsChanged = true;
		}
	function writeStats () {
		fs.writeFile (options.fnameStats, utils.jsonStringify (stats), function (err) {
			});
		}
	function deleteOldGuids () {
		function countGuids () {
			var ct = 0;
			for (var x in stats.guids) {
				ct++
				}
			return (ct);
			}
		function deleteOldestGuid () {
			var oldestWhen = new Date (), oldestx;
			function dateLessThan (d1, d2) {
				return (new Date (d1) < new Date (d2));
				}
			for (var x in stats.guids) {
				var theGuid = stats.guids [x];
				if (dateLessThan (theGuid.when, oldestWhen)) {
					oldestWhen = theGuid.when;
					oldestx = x;
					}
				}
			if (oldestx !== undefined) {
				delete stats.guids [oldestx];
				stats.ctDeletedItems++; stats.whenLastDeletedItem = new Date ();
				statsChanged ();
				}
			}
		var ct = countGuids () - options.maxGuids;
		if (ct > 0) {
			console.log ("deleteOldGuids: ct == " + ct);
			for (var i = 1; i <= ct; i++) {
				deleteOldestGuid ();
				}
			}
		}
	function isNewFeed (feedUrl) {
		var flnew = true;
		for (var x in stats.guids) {
			if (stats.guids [x].feedUrl == feedUrl) {
				flnew = false;
				break;
				}
			}
		return (flnew);
		}
	function checkFeed (feedUrl, callback) {
		const now = new Date ();
		const flNewFeed = isNewFeed (feedUrl);
		reallysimple.readFeed (feedUrl, function (err, theFeed) {
			if (err) {
				callback (err);
				}
			else {
				theFeed.items.forEach (function (item) {
					if (item.guid !== undefined) { //we ignore items without guids
						var flfound = false;
						for (var x in stats.guids) {
							if (x == item.guid) {
								flfound = true;
								break;
								}
							}
						if (!flfound) {
							stats.guids [item.guid] = {
								when: new Date (),
								feedUrl
								};
							stats.ctItemsSeen++; stats.whenLastItem = now;
							if (flNewFeed && options.flOnlyPostNewItems) {
								 //don't add items from a newly-added feed
								}
							else {
								options.newItemCallback (feedUrl, item);
								stats.ctNewItems++; stats.whenLastNewItem = now;
								}
							statsChanged ();
							}
						}
					});
				}
			});
		}
	function checkAllFeeds () {
		if (options.enabled) {
			whenLastCheck = new Date ();
			options.feedUrls.forEach (function (feedUrl) {
				checkFeed (feedUrl, function (err, data) {
					if (err) {
						console.log ("checkFeed: feedUrl == " +feedUrl + ", err.message == " + err.message);
						}
					});
				});
			}
		}
	function everySecond () {
		if (flStatsChanged) {
			flStatsChanged = false;
			writeStats ();
			}
		}
	function everyMinute () {
		if (options.enabled) {
			if (utils.secondsSince (whenLastCheck) >= options.secsBetwChecks) {
				checkAllFeeds ();
				}
			}
		}
	
	console.log (nowString () + ": tinyFeedReader startup.")
	utils.readConfig (options.fnameStats, stats, function (err) {
		if (err) {
			console.log ("tinyFeedReader: Error reading " + options.fnameStats + " == " + err.message);
			}
		else {
			stats.ctStarts++; stats.whenLastStart = new Date ();
			checkAllFeeds (); //check immediately on startup, don't wait for the top of the minute
			whenLastCheck = new Date (0); //make sure we check again at the top of the minute
			utils.runEveryMinute (everyMinute);
			setInterval (everySecond, 1000); 
			}
		});
	}


