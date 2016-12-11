#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');
var concat = require('concat-files');

'use strict'

//  Let's create some variables that we can use to store program state
var directoryList = [];
var filesToConcat = [];
var promiseQueue = [];
var distributionDirectory = './dist';

//  We need to know which directories to include - this needs to be read from a file though TODO.
var excludedDirectories = ['.//.git','.//node_modules'];  

console.log('-------------------------------------');
console.log('Gangle 1.0.1 Started.')
console.log('-------------------------------------');
 
//  HOW IT ALL HANGS TOGETHER
//  OK, let's start everything off by setting up the directories to watch, once this is 
//  done, we call the success of the promise, create a list of folders to watch, and when these
//  are all executed, we start the server.

GetDirectories('./')
    .then(function (watchList) {
        watchList.forEach(dir => {
            promiseQueue.push(WatchFolder(dir));            
        });
         
        //  Bundle these promises together before we start the server to ensure all
        //  work has been done before serving files.
        Promise.all(promiseQueue).then(values => { 
            console.log(values, filesToConcat);
            console.log('Ready to concat: ', filesToConcat);
            StartBrowserSync(); 
        });
    })

////////////////////////////////////////////////////////////////////////////////////////////////
//  Starts up browser sync 
////////////////////////////////////////////////////////////////////////////////////////////////
function StartBrowserSync () {
    //  Initialise Browser sync now
    /*browserSync.init({
        server: ".",
        port: 9001
    });*/
    console.log('-------------------------------------');
    console.log('Gangle 1.0.1 Complete.')
    console.log('-------------------------------------'); 
}
 
////////////////////////////////////////////////////////////////////////////////////////////////
//  Setup a watcher on a particular folder, 
//  TO DO : this will read the gangle.config.js configuration file for files to ignore 
////////////////////////////////////////////////////////////////////////////////////////////////
function WatchFolder (folderToWatch) {
    return new Promise(function executePromise (resolve, reject) {
        fs.watch(folderToWatch, {encoding: 'buffer'}, (eventType, filename) => {  
            if (filename && filename != 'all.min.js') {
 
                //  Create the distribution directory
                if (!fs.existsSync(distributionDirectory)){
                    fs.mkdirSync(distributionDirectory);
                } 
                concat(filesToConcat, './' + distributionDirectory + '/all.min.js', function() {
                    console.log('Concat complete. /dist/all.min.js generated');
                });
 
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
function GetDirectories (dir) {
    return new Promise(function executePromise (resolve, reject) { 
        var files = fs.readdirSync(dir);        
        var i = excludedDirectories.indexOf(dir)
        if (i == -1) {
            files.forEach(function (file) {
                //  Check if the file is a directory
                if (fs.statSync(dir + '/' + file).isDirectory()) {
                    GetDirectories(dir + '/' + file)
                        .then(values => {
                            resolve(values);
                        });
                } 
                //  Pick up subdirectories
                else if (directoryList.indexOf(dir) == -1) { 
                    //  Add the file to the concat list
                    if (file.indexOf('.js') > 0 && filesToConcat.indexOf(dir + '/' + file) == -1) {
                        filesToConcat.push(dir + '/' + file);
                    }
                    //  Add the directory to the watch list
                    directoryList.push(dir);
                }
                //  Pick up the root directory
                else {                    
                    if (file.indexOf('.js') > 0 && filesToConcat.indexOf(dir + '/' + file) == -1) {
                        filesToConcat.push(dir + '/' + file);
                    }               
                }            
            });
        }
        resolve(directoryList);
    });
};