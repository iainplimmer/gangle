var fs = require('fs')
var path = require('path')
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');

'use strict'

//  Let's create some variables that we can use to store program state
var filelist = [];
var promiseList = [];

//  We need to know which directories to include - this needs to be read from a file though TODO.
var excludedDirectories = ['.//.git','.//node_modules'];  

console.log('-------------------------------------');
console.log('Gangle 0.0.1 Started.')
console.log('-------------------------------------');

//  HOW IT ALL HANGS TOGETHER
//  OK, let's start everything off by setting up the directories to watch, once this is 
//  done, we call the success of the promise, create a list of folders to watch, and when these
//  are all executed, we start the server.

GetDirectories('./', filelist, excludedDirectories)
    .then(function (watchList) {
        watchList.forEach(dir => {
            promiseList.push(WatchFolder(dir));            
        });
        
        //  Bundle these promises together before we start the server to ensure all
        //  work has been done before serving files.
        Promise.all(promiseList).then(values => { 
            console.log(values);
            StartBrowserSync(); 
        });
    })

////////////////////////////////////////////////////////////////////////////////////////////////
//  Starts up browser sync 
////////////////////////////////////////////////////////////////////////////////////////////////
function StartBrowserSync () {
    //  Initialise Browser sync now
    browserSync.init({
        server: ".",
        port: 9001
    });
    console.log('-------------------------------------');
    console.log('Gangle 0.0.1 Complete.')
    console.log('-------------------------------------');
}

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
//  Traverse the directory tree and add all directories to a list to watch, returns a 
//  promise so that we can perform this action async without blocking
////////////////////////////////////////////////////////////////////////////////////////////////
function GetDirectories (dir, filelist, exclude) {
    return new Promise(function executePromise (resolve, reject) { 
        var files = fs.readdirSync(dir);
        var i = exclude.indexOf(dir)
        if (i == -1) {
            files.forEach(function (file) {
            if (fs.statSync(dir + '/' + file).isDirectory()) {
                GetDirectories(dir + '/' + file, filelist, exclude)
                    .then(values => {
                        resolve(values);
                    });
            }
            else {
                if (filelist.indexOf(dir) == -1) {
                    filelist.push(dir);
                }
            }
        });
        }
        resolve(filelist);
    });
};