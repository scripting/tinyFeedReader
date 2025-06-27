# tinyFeedReader

A minimal feed reader in a Node package.

### How to

Specify at least these three properties of the options object, and then call tinyfeedreader.start.

1. feedUrls: an array of URLs of feeds to check.

2. newItemCallback: a function that's called when a new item is received. 

3. secsBetwChecks: determines how often we check the feeds, will never check more frequently than once a minute. 

### What's in an item?

``{

"description": "The longest continuously updated <a href=\"http://scripting.com/rss.xml\">RSS feed</a> in the known universe.",

"pubDate": "2025-06-27T11:46:47.000Z",

"link": "http://scripting.com/2025/06/27.html#a114647",

"guid": "http://scripting.com/2025/06/27.html#a114647",

"permalink": "http://scripting.com/2025/06/27.html#a114647"

}``

### New features?

You probably shouldn't ask for new features given the name of the project. :-)

But you can download the code and do whatever you like. It's a good place to get started with feed reading.

### What kinds of feeds?

It uses the <a href="https://github.com/scripting/reallysimple">reallySimple package</a> to read feeds which in turn uses the <a href="https://github.com/danmactough/node-feedparser">feedParser package</a>, so we read the same feeds they do, which is a lot of them in all kinds of formats. But you will get a JavaScript object that flattens out all the differences. 

If an item doesn't have a guid, we can't deal with it, and will never return it back to the caller. We use the guid to determine if an item is new or not. So we not only depend on its existence, we also depend on its uniqueness. 

### All data stored in memory

We don't use a database, all the information about the items we've seen is stored in memory and saved to disk in a JSON file, stats.json. You can override the file path, by specifying its value in your options object, so you can store the stats file anywhere you like. 

