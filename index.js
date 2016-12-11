var fs = require('fs')
var path = require('path')
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');

'use strict'

var excludedDirectories = ['.//.git','.//node_modules'];  //  We need to know which directories to include

//  We can traverse the directory tree and add all directories to a list 
var getDirectories = function (dir, filelist, exclude) {
    var files = fs.readdirSync(dir);
    var i = exclude.indexOf(dir)
    filelist = filelist || [];
    if (i == -1) {
        files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = getDirectories(dir + '/' + file, filelist, exclude);
        }
        else {
            filelist.push(dir + '/' + file);
        }
    });
    }
    return filelist;
};

var filelist = [];
var iain = getDirectories('./', filelist, excludedDirectories);
console.log(iain)

/*
browserSync.init({
    server: ".",
    port: 9001
});
*/

//  First thing we are going to do is setup a watcher on a particular folder, this will read the
//  gangle.config.js configuration file 
function WatchFolder (folderToWatch) {
    console.log('Watching folder')
    fs.watch(folderToWatch, {encoding: 'buffer'}, (eventType, filename) => {  
        if (filename) {
            console.log('filename \'' + filename + '\'has changed');
            browserSync.reload();     
        }
    });
}

