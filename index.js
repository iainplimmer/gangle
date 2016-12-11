var fs = require('fs')
var path = require('path')
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');

'use strict'

console.log('-------------------------------------');
console.log('Gangle 0.0.1 Started.')
console.log('-------------------------------------');

var excludedDirectories = ['.//.git','.//node_modules'];  //  We need to know which directories to include

var filelist = [];
var promiseList = [];
GetDirectories('./', filelist, excludedDirectories)
    .then(function (watchList) {
        watchList.forEach(function (dir) {
            WatchFolder(dir)
            .then(function (e){
                console.log(e)
            })
        });
    })


//  Initialise Browser sync now
//browserSync.init({
//    server: ".",
//    port: 9001
//});

console.log('-------------------------------------');
console.log('Gangle 0.0.1 Complete.')
console.log('-------------------------------------');

////////////////////////////////////////////////////////////////////////////////////////////////
//  Setup a watcher on a particular folder, 
//  TO DO : this will read the gangle.config.js configuration file for files to ignore 
////////////////////////////////////////////////////////////////////////////////////////////////
function WatchFolder (folderToWatch) {
    return new Promise(function executePromise (resolve, reject) {
        fs.watch(folderToWatch, {encoding: 'buffer'}, (eventType, filename) => {  
            if (filename) {
                console.log('filename \'' + filename + '\'has changed');
                browserSync.reload();     
            }
        });
        resolve('Watching folder: ' + folderToWatch)
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////
//  We traverse the directory tree and add all directories to a list to watch, returns a 
//  promise so that we can perform this action async
////////////////////////////////////////////////////////////////////////////////////////////////
function GetDirectories (dir, filelist, exclude) {
    return new Promise(function executePromise (resolve, reject) { 
        var files = fs.readdirSync(dir);
        var i = exclude.indexOf(dir)
        filelist = filelist || [];
        if (i == -1) {
            files.forEach(function (file) {
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                GetDirectories(dir + '/' + file, filelist, exclude)
                    .then(function () {
                        resolve(filelist);
                    });
            }
            else {
                if (filelist.indexOf(dir)) {
                    filelist.push(dir);
                }
            }
        });
        }
        resolve(filelist);
    });
};
