---
title: "Learning React: #1 Setting up the environment"
date: "2016-02-04T12:50:00.000Z"
tags: ["javascript","ReactJs"]
---

## Learning React Series
In this series I wanna discuss my learning experience with `ReactJS`, this will be an opinionated series on what I think of `ReactJS` & other libraries, Why I switched to it, and why I think `ReactJS` is *awesome*, along side all the opinions I will be sharing code on what I am learning and explaining how it all works.

>Note: I have created a github repo that contains all the source code for this article [here](https://github.com/nadeemkhedr/learning-react-series)

### Why I bothered learning a new framework

I've been a frontend developer for a while now, the last 4 years my work was mostly `AngularJS 1.x` & `EmberJS` and I think I'm comfortable with both.

For me it all started by checking out `AngularJS` and building small apps with it, until the apps I was working on got bigger, I learned about `AngularJS` more & knew that the code I wrote was terrible and need a BIG refactoring *(I think this happened to most)*, because `AngularJS` is pretty relaxed, there is no restrictions on where to put things, and that was one of the biggest dis-advantages. at least from my perspective

Then life went by and then I started working with a project built with `EmberJS` I think it was still in beta, and I had a really difficult time learning it, the concepts were totally different from `AngularJS` and I hated it at first.

After that it all clicked, and I **LOVED** `EmberJS` *(And still loving it)* been working with it exclusively on various projects for the last couple of years.

Until one of my tasks was to make a big app more performant, the problem was that there were too many `properties` & `observers` so any change triggered list refresh multiple times, dealing with the meta language of ember and the two way bindings was just too much headache, during that time, `React` was on fire and I decided to take a look, at first honestly I though its just too difficult, then now even tho I didn't work on any real/big projects with `React` it is my new favourite Library

> Note: ember team agrees and they are embracing all the core `React` concepts and they are in the process of integrating them in ember, but this topic is for another article

### Setting up the environment

`React` doesn't come with a build tool to init the app, instead you have to do it manually.

React is a low level library and they want to keep it that way, not providing you with a tool like `ember-cli` for generating/running/deploying the app is a bit frustrating, but honestly giving you the option to choose whatever you want gives you a lot of possibilities like using cutting edge transpilers for using ES7 with react or honestly anything you could ever think of.

Our module loader/bundler + transpiler will be [webpack](https://webpack.github.io/) + [babel](https://babeljs.io/)


#### Initialize the Application

first install `webpack` globally by running
`npm install -g webpack`

To create a new react application, create a new folder and run the following commands

- `npm init`

- npm install the following list
```
"dependencies": {
    "babel-loader": "^6.2.0",
    "babel-plugin-add-module-exports": "^0.1.2",
    "babel-plugin-react-html-attrs": "^2.0.0",
    "babel-plugin-transform-class-properties": "^6.3.13",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-preset-stage-0": "^6.3.13",
    "react": "^0.14.6",
    "react-dom": "^0.14.6",
    "webpack": "^1.12.9",
    "webpack-dev-server": "^1.14.1"
  },
```
let me explain some of the packages introduced in the list above

[wepack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html): a tool for running `webpack` command in watch mode so whenever any file is changed the compilation happens and fires up a localhost server that serves all the files

[react|react-dom](https://github.com/facebook/react) after `react-native` was introduced, the react team figured out the need for extracting a single library that will be used everywhere and created a web specific library that handles the dom aspect of the web, which is now `react-dom`

**babel presets**: presets are bunch of plugins associated together, like `es2015` allows the user to write `ES6`, `react` allows you to write `jsx` and `stage-0` allows the user to write all cutting edge `ES7` stuff

---

#### Configure webpack

create a new `./webpack.config.js` that contains the following
```javascript
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./js/app.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + "/src/",
    filename: "app.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
```
The two interesting properties here are:

- `entry`: which will be our entry point to the app the first script that runs, and through it, loads the rest of the app

- `output`: this is the result when running webpack, this will be referenced in `index.html` that we will create bellow

this is a pretty basic webpack config that checks the env, if its production will optimize the code by uglifying it and removing duplicate code and sourcemaps.

There is a concepts in `webpack` *(actually `babel`)* which is called [loaders](https://github.com/babel/babel-loader) through them we can write *(ES6, ES7, JSX, ...)*, and it will compile all that to `ES5` and will run on all browsers, take a look at the previous link for more info

> Note `webpack` is not exclusive for react, its recommended using it or any other build system (`Grunt`, `Gulp`, ..) for any Javascript application

&nbsp;

> Note by using `webpack` you will install most of the dependencies from `npm` not `bower` and you **can** reference it from the code, `webpack` will figure how to handle all that for you *(and yes `npm` is also a good package manager for the web)*


At this point we are done with creating our small build system, its a little effort at first, but it makes our life so much easier, specially when the project grows

---

####Cool tip on running your app

One of the dependencies for our app is `webpack-dev-server`, you could start the app by running
```
webpack-dev-server
```

This will actually not work, we need to tell it the base of our app is inside `src`, so we would run it with the following instead

```
webpack-dev-server --content-base src
```

Instead of doing this every time that we would want to run our app, we could add a command in `scripts` in our `package.json`
```
  "dependencies": {
    ...
  },
  "scripts": {
    "dev": "./node_modules/.bin/webpack-dev-server --content-base src --inline --hot",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

```

We are passing two extra flags

- `--inline`: this will not show a status bar at the top (shows by default)

- `--hot` this enables hot module replacement, awesome feature, instead of refreshing the whole page, it just replaces the components that was edited, read more about it [here](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html)

Now whenever we want to run the app we would type `npm run dev`

---

#### Basic App Structure

our directory structure should look like this
```
> node_modules/
> src/
   > js/
     - app.js
     > components/
       - Hello-World.js
   - index.html
- package.json
- webpack.config.js
```

---

`./index.html`
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Learning React Series</title>
  </head>

  <body>
    <div id="app"></div>
    <script src="app.min.js"></script>
  </body>
</html>
```
This is just blank html boilerplate, the only interesting part that we are referencing `app.min.js` *(that we specified in the `webpack.config.js`)*

---

`./js/app.js`
```javascript
import React from "react";
import ReactDOM from "react-dom";

import HelloWorld from "./components/Hello-World";

const app = document.getElementById('app');
ReactDOM.render(<HelloWorld/>, app);
```
pretty basic file, just renders the `Hello-World` component


---

`./js/components/Hello-World.js`
```javascript
import React from "react";

export default class HelloWorld extends React.Component {
  render() {
    let msg = "Extra Message from React"
    return (
      <div>
        <div>Hello World!</div>
        <div>{msg}</div>
      </div>
    );
  }
}
```

A really simple `react` component, just renders
```plain
Hello Message
Extra Message from React
```

That's it in my next article will be talking about react basics and what is `DDAU` *(Data down action up)*, until next time, have an awesome day
