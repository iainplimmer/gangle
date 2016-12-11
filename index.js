var fs = require('fs')
var path = require('path')
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');

'use strict'

var excludedDirectories = ['.//.git','.//node_modules'];  //  We need to know which directories to include

var filelist = [];
var watchList = getDirectories('./', filelist, excludedDirectories);
watchList.forEach(function (dir) {
    WatchFolder(dir);
});

/*
//  Initialise Browser sync now
browserSync.init({
    server: ".",
    port: 9001
});
*/

//  First thing we are going to do is setup a watcher on a particular folder, this will read the
//  gangle.config.js configuration file 
function WatchFolder (folderToWatch) {
    console.log('Watching folder: ' + folderToWatch);
    fs.watch(folderToWatch, {encoding: 'buffer'}, (eventType, filename) => {  
        if (filename) {
            console.log('filename \'' + filename + '\'has changed');
            browserSync.reload();     
        }
    });
}

//  We traverse the directory tree and add all directories to a list to watch
function getDirectories (dir, filelist, exclude) {
    var files = fs.readdirSync(dir);
    var i = exclude.indexOf(dir)
    filelist = filelist || [];
    if (i == -1) {
        files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = getDirectories(dir + '/' + file, filelist, exclude);
        }
        else {
            if (filelist.indexOf(dir)) {
                filelist.push(dir);
            }
        }
    });
    }
    return filelist;
};
