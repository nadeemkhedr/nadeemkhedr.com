---
title: "Easy Javascript plugin development using gulpjs"
date: "2014-10-20T03:38:46.000Z"
tags: ["gulp.js","javascript"]
---


I’ll be showing how to setup a build environment suitable for developing a sophisticated JavaScript plugin


## Build System: Gulp.js

We don’t want to end up writing all the code in one huge JavaScript file, so using [gulp.js ](http://gulpjs.com/)actually gives us  lots of features:

- Modularizing our code in multiple files and concating/minifying it at run time
-  Gives us the ability to write our code using higher level languages like [CoffeeScript](http://coffeescript.org/), [Sass](http://sass-lang.com/) , etc.. and will compile them at run time
- A local  web server to to host our plugin and the styling code ( sometime that’s needed if you have different development and deployment workflows )
- Enable [sourcemaps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ "Introduction to JavaScript Source Maps") while developing
- Use watchers to recompile files on change & also for browser reload

### Our Directory will look like this

```bash
 /plugin
 /src
 /styles
 /dist
 package.json
 gulpfile.js
```

**/src** Directory contains all the plugin code *(can be javascript/coffeescript)*

**/styles** Directory contains all the styling code *(can be sass/less/css)*

**/dist** Directory contains all the compiled plugin files *(plugin.js, plugin-styles.css, images, etc..)*

**package.json** contains all the npm modules that our app depends on *(the dependencies are not javascript dependencies for our plugin but our gulp plugins that we will use in our build)*

**gulpfile.js** Here is where all the build magic happens

### Package.json

To get started in our plugin root folder we need to run
```sh
npm init
```
it will asks us multiple questions and in the end will generate
a `package.json`


Then we need to install the following plugins because we will be using them in our gulp file [gulp-concat](https://github.com/wearefractal/gulp-concat), [gulp-webserver](https://github.com/schickling/gulp-webserver), [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) and [gulp-sass](https://github.com/dlmanning/gulp-sass)

install them by typing the following in your command line
```sh
npm install gulp gulp-concat gulp-webserver gulp-sourcemaps gulp-sass --save-dev
```
> you need to also install gulp globally if you didn't `npm install -g gulp`


### Our Gulp file

```javascript
 // /plugin/gulpfile.js
var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src('styles/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'src/app.js',
    'src/!(main)*.js',
    'src/main.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('plugin.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['src/*.js'], ['scripts']);
  gulp.watch(['styles/*.scss'], ['sass']);
});

gulp.task('server', ['scripts', 'sass', 'watch'], function() {
  gulp.src('dist')
  .pipe(webserver({ port: 9001 }));
});
```

Our gulp file is pretty basic it does the following

- Convert all the sass files to css and create them in the `dist` directory
- Concat all the javascript files into one file and create it in the `dist` directory
*Note: In the result concatenated file we are specifying the first & last files to include app.js, main.js*
- Watch the files & recompile on change
- Create a webserver that will have the `dist` directory as its root

all we have to do to run & watch file changes is to run this command in the command line

```sh
gulp server
```

> `server` is the task name defined in our `gulpfile.js` and as you can see in our code that task depends on all other tasks (meaning it will run everything) and it will also fire up a server on port `9001` and the server’s root will be `/dist`

You can read more about gulp [here](http://gulpjs.com/), It is extremely easy to use. With a little searching you can get tons of good examples of how to practically do anything with it
