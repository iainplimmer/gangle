const fs = require('fs');
const http = require('http');

'use strict'

const PORT=8080;


var index = fs.readFileSync('index.html');


console.log('program working')

fs.watch('./src', {encoding: 'buffer'}, (eventType, filename) => {
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


