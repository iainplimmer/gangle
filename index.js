var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');

'use strict'
//var foldersToWatch = [
//    './src'
//];             

//var watchList = getDirectories('./');
var excludedDirectories = ['.git','node_modules'];  //  We need to know which directories to include

//  Let's get the directories that we want to watch first
// getDirectories('./').map(function (e) {
    
//     var iii = excludedDirectories.indexOf(e);
//     console.log(iii)

//     getDirectories('./' + e).map(function (e) {
//         console.log(e)
//     })
// });

var getDirectories = function (dir, filelist, excludedDirectories) {
    var fs = fs || require('fs')
    var files = fs.readdirSync(dir);

    filelist = filelist || [];
    
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = getDirectories(dir + '/' + file, filelist);
        }
        else {
            filelist.push(file);
        }
    });
    return filelist;
};

var filelist = [];
var iain = getDirectories('./', filelist);
console.log(iain)

/*
browserSync.init({
    server: ".",
    port: 9001
});
*/

//  Returns the directories in the application
// function getDirectories(srcpath) {
//     return fs.readdirSync(srcpath).filter(function(file) {
//         return fs.statSync(path.join(srcpath, file)).isDirectory();
//     });
// }

//////console.log(watchList)

/*
WatchFolder(foldersToWatch[0]);
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

