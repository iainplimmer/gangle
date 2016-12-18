#!/usr/bin/env node

////////////////////////////////////////////////////////////////////////////////////////////////
//  GANGLE! is the most over opinionated Javascript build system and webserver ever. It watches
//  your JS files, concats them to the folder it expects and runs borwser-sync to watch your
//  changes and auto refresh the browser. It's nuts, but for every day light use, it's cool.
////////////////////////////////////////////////////////////////////////////////////////////////

var fs = require('fs');
var watch = require('node-watch');
var browserSync = require("browser-sync").create('gangle');

'use strict'

//  Let's create some variables that we can use to store program state
var directoryList = ['./'];
var filesToConcat = [];
var distributionDirectory = './dist';
var fileBuffers = [];

//  We need to know which directories to include - this needs to be read from a file though TODO.
var excludedDirectories = ['./.git','./node_modules','./dist'];  

//  HOW IT ALL HANGS TOGETHER
//  OK, let's start everything off by setting up the directories to watch, once this is 
//  done, we call the success of the promise, create a list of folders to watch, and when these
//  are all executed, we start the server.

console.log('-------------------------------------');
console.log('Gangle Started. ')
console.log('-------------------------------------');
 
GetDirectories('./')
    .then(function () {
        var promiseQueue = [];
        directoryList.forEach(dir => {
            promiseQueue.push(WatchFolder(dir));            
        });

        //  Bundle these promises together before we start the server to ensure all
        //  work has been done before serving files.
        Promise.all(promiseQueue).then(foldersWatched => { 
            console.log(foldersWatched);
            StartBrowserSync(); 
        })
        .catch(error => {
            console.log('ERROR BAD! ', error);
        });
    })
    .catch(error => {
        console.log('ERRORZ! ', error);
    });


 
////////////////////////////////////////////////////////////////////////////////////////////////
//  Setup a watcher on a particular folder, 
//  TO DO : this will read the gangle.config.js configuration file for files to ignore 
////////////////////////////////////////////////////////////////////////////////////////////////
function WatchFolder (folderToWatch) {
    return new Promise(function executePromise (resolve, reject) {
        fs.watch(folderToWatch, {encoding: 'buffer'}, (eventType, filename) => {  
            if (filename && filename != 'all.min.js') {
                CleanFolders()
                    .then(function (ok){
                        //  Concatenate the files to disk
                        GetFileBuffers()
                            .then(function (e){
                                var p = fs.writeFileSync(distributionDirectory + '/all.min.js', Buffer.concat(fileBuffers));   
                                browserSync.reload();                               
                            });                              
                }); 
            }  
        }); 
        resolve('Watching folder: ' + folderToWatch);
    }); 
}

//  Reads the contents of the watched filed.
function GetFileBuffers () {
    return new Promise(function (resolve, reject) {
        filesToConcat.map(function (file) {
            var fileContent = fs.readFileSync(file);
            var newline = new Buffer('\n');
            fileBuffers.push(fileContent);            
            fileBuffers.push(newline);            
        });
        resolve();
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////
//  Ensures that the dist folder is created and cleared before the build cycle
////////////////////////////////////////////////////////////////////////////////////////////////
function CleanFolders () {
    return new Promise(function (resolve, reject) {
   
        //  Create the distribution directory.
        if (!fs.existsSync(distributionDirectory)){
            fs.mkdirSync(distributionDirectory);
        } 

        if (fs.existsSync(distributionDirectory + '/all.min.js')){
            fs.unlinkSync(distributionDirectory + '/all.min.js');
        }

        resolve('Clean up completed.......!');
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////
//  Traverse the directory tree and add all directories to a list to watch, returns a 
//  promise so that we can perform this action async without blocking
////////////////////////////////////////////////////////////////////////////////////////////////
function GetDirectories (dir) {
    return new Promise(function executePromise (resolve, reject) { 
                
        var files = fs.readdirSync(dir);        
        if (excludedDirectories.indexOf(dir) == -1) {

            //  Take each file that is in the files list, and check if they are a directory, if they are
            //  add them to the watch list, if not, we want to run the function to see if we want to add the file.
            files.map(function (file) {
                 
                //  If the current file is a directory and not in the excluded or watch list already                
                if (fs.statSync(dir + '/' + file).isDirectory() && directoryList.indexOf(dir + file) == -1 && excludedDirectories.indexOf(dir + file) == -1) {
                    
                    //  Add the directory to the watch list and let's look up in that directory
                    directoryList.push(dir + '/' + file);
                    GetDirectories(dir + '/' + file)
                        .then(function () { 
                            
                        })
                        .catch(err => {
                            console.log('FATAL EVIL ERROR! ', error);
                        });
                }
                else {                    
                    AddFilesToConcatList(dir, file);
                }        
            });
        }
        resolve();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////
//  Starts up browser sync 
////////////////////////////////////////////////////////////////////////////////////////////////
function StartBrowserSync () {
        console.log('-------------------------------------');
        console.log('Gangle Starting Browser Sync.')
        console.log('-------------------------------------');
    //  Initialise Browser sync now
    browserSync.init({
        server: ".",
        port: 9001
    }, function () {
        console.log('-------------------------------------');
        console.log('Gangle Complete, ready to code :)')
        console.log('-------------------------------------');
    });  
}

////////////////////////////////////////////////////////////////////////////////////////////////
//  Runs the rules on whether to add the file to the list to concat. 
////////////////////////////////////////////////////////////////////////////////////////////////
function AddFilesToConcatList (dir, file) {
    if (file.indexOf('.js') > 0  && file.indexOf('.json') == -1&& file.indexOf('all.min.js') == -1 && filesToConcat.indexOf(dir + '/' + file) == -1) {
            filesToConcat.push(dir + '/' + file);
    }        
}; 