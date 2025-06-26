# tinyFeedReader

A minimal feed reader in a Node package.

### How to

Specify at least these three properties of the options object, and then call tinyfeedreader.start.

1. feedUrls: an array of URLs of feeds to check.

2. newItemCallback: a function that's called when a new item is received. 

3. secsBetwChecks: determines how often we check the feeds, will never check more frequently than once a minute. 

### New features

You probably shouldn't ask for new features given the name of the project. :-)

But you can download the code and do whatever you like. It's a good place to get started with feed reading.

### What kinds of feeds?

It uses the reallySimple package to read feeds which in turn uses the feedParser package, so we read the same feeds they do, which is a lot of them in all kinds of formats. But you will get a JavaScript object that flattens out all the differences. 

