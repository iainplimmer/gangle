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

Personal Note...........
This is just a backlash against Javascript in general. I spend 15 minutes when configuring a new Javascript project with webserver, gulp, concat files, ignoring files, bleugh. It's tedious. If I make a new AngularJS 1.x project I want to be 
working in minutes. For that I don't need tests, ot Gulp. This is just step one to test or demo an idea. GANGLE! gives me that. In an over opinionated way where I don't need to think about anything.
