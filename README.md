# gangle
GANGLE! Is a simple one step webserver and build system that watches the file system for changes to Javascript files. When it sees a change, it concats ALL of your Javascript and links back to the browser with the change, real-time.

INSTALLATION: 
npm install gangle -g

USAGE: 
Just browse to the folder that your web application is in and type 'gangle', everything is just done for you. If you add a new file, run 'gangle' again, sorry that's the way it is (for now).

What happens now is pretty opinionated. 

1. GANGLE! expects that you want to concat ALL of your Javascript, nothing else, just Javascript. 
2. GANGLE! then puts the Javascript in a new build folder/file called './dist/all.min.js'.
3. GANGLE! does this for every file that is of the type javascript, regardless of whether you want it to or not.
4. There is no build order.
5. There is no minification.
6. There is no config (If you want one, use Webpack).
7. 'node_module' folders and JSON files are excluded.
8. To run the webserver and start, which is BrowserSync, just type 'gangle'
9. GANGLE! has to be installed globally.


YOUR PROJECT TREE (EXAMPLE):

This is only a rough example of a simple project, but is enough to illustrate which files are actually built and which are ignored.


    .
    ├── node_modules
    |   ├── module 1            * Ignored
    |       ├── module 2        * Ignored
    |   └── module 3            * Ignored
    ├── _vendor
    |   ├── angular      
    |       ├── angular.min.js  * Built into ./dist/all.min.js
    ├── src
    |   ├── file1.js            * Built into ./dist/all.min.js
    |   └── file2.js            * Built into ./dist/all.min.js
    ├── css
    |   ├── default.html 
    |   └── post.html
    ├── dist
    |   ├── all.min.js          * File generated by GANGLE!
    ├── templates
    |   └── file1.html
    └── index.html
    └── package.json            * Ignored
    └── myscript.js             * Built into ./dist/all.min.js

Which means once a file changes, look into the './dist/all.min.js' file. This contains everything.

Just make a reference to this file in your html.

Personal Note...........
This is just a backlash against Javascript in general. I spend 15 minutes when configuring a new Javascript project with webserver, gulp, concat files, ignoring files, bleugh. It's tedious. If I make a new demo in an AngularJS 1.x project I want to be working in minutes. And for that I don't need tests, or Gulp, or Webpack. This is just step one to test or demo an idea. GANGLE! gives me that. In an over opinionated way where I don't need to think about anything.

It's never going to set the world alight. But as a journey, I like to think about build systems in the simplest possible way.
