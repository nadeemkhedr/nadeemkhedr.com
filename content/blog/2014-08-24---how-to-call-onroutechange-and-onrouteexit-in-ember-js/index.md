---
title: 'How to call onRouteChange and onRouteExit in Ember.js'
date: '2014-08-24T05:24:51.000Z'
tags: ['Ember.js']
---

A two scenarios that I always encounter while developing an ember app are:

- When the user is in edit/create page and is editing an ember model, I want to rollback that model when the user clicks on any link on the page
- I want to globally hide any error message shown when the route changes

Ember actually has features to make you implment these scenarios but its not exactly clear on how to do it.

### How to implement a global onRouteChange

we will be using [willTransition](http://emberjs.com/guides/routing/preventing-and-retrying-transitions/#toc_preventing-transitions-via-code-willtransition-code) , it will be called when trying to access a certain route _(on entering not on exiting)_

```javascript
App.ApplicationRoute = Em.Route.extend({
  actions: {
    willTransition: function (transition) {
      this.controllerFor(transition.targetName).setProperties({
        errorMessages: null,
      })
    },
  },
})
```

What we have done in the previous example, is on the `ApplicationRoute` we put a `willTransition`, this means when the url changes this function will be called everytime with different `transition` object passed to it depending on the actual route that the user is trying to access

To get the controller that the user is accessing, you have to call

```javascript
this.controllerFor(transition.targetName)
```



### How to implement an onRouteExit

we will be overriding `exit` method on the specific route that you want to add functionality to it

```javascript
App.ItemEditRoute = Em.Route.extend({
  exit: function () {
    this._super()
    this.modelFor('item').rollback()
  },
})
```

> exit is considered private so you have to call `this._super()` when you write one

> In Ember 1.7 there is [resetController ](http://emberjs.com/api/classes/Ember.Route.html#method_resetController)method on the route that will give you the same functionality and its public
