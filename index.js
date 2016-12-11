var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')

'use strict'
var folderToWatch ='./src';             //  We need to kow which directories to include
var excludedFiles = [];                 //  And the ones to exclude
const baseDirectory = process.cwd()     //  Set the current path 
const port = 9615                       //  And the port



server = http.createServer(function (request, response) {
   try {
     var requestUrl = url.parse(request.url)

     // need to use path.normalize so people can't access directories underneath baseDirectory
     var fsPath = baseDirectory+path.normalize(requestUrl.pathname)

     response.writeHead(200)
     var fileStream = fs.createReadStream(fsPath)
     fileStream.pipe(response)
     fileStream.on('error',function(e) {
         response.writeHead(404)     // assume the file doesn't exist
         response.end()
     })
   } catch(e) {
     response.writeHead(500)
     response.end()     // end the response so browsers don't hang
     console.log(e.stack)
   }
}).listen(port)
console.log("listening on port " + port)


//  First thing we are going to do is setup a watcher on a particular folder, this will 
fs.watch(folderToWatch, {encoding: 'buffer'}, (eventType, filename) => {
  if (filename)
    console.log(filename);
    // Prints: <Buffer ...>
});






// #!/usr/bin/env node

// 'use strict';

// const program = require('commander');

// console.log('helllo')

// let gangleNow = () => {
  
//   console.log('gangling!');

//   exec(fullCommand, execCallback);
// };


// program
//     .version('0.0.1')
//     .command('gangle')
//     .description('Creates a build in one step.')
//     .action(gangleNow);
//     //.option('-l, --list [optional]','List all the files and folders that will be parsed')
//     //.option('-o, --option','option description')  
//     //.option('-I, --another-input <required>','required user input')
  
  
// program.parse(process.argv); // end with parse to parse through the input


