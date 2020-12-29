---
title: 'Knockout view model binding variations to a page'
date: '2013-01-29T15:22:53.000Z'
tags: ['bindings', 'knockout', 'mvvm']
---

## Bind a _viewModel_ to the whole page

There are many variations to write the view model in knockout, for example if we are using a simple object as a view model we will have some problems with *<span style="color:#800000;">this, </span>*we will examine the variations of how we would write our view model and why

First of lets start with a simple example and how to write a simple* view model* and bind it to the page

```html
First name: <input type="text" data-bind="value: firstName" /> Last name:
<input type="text" data-bind="value: lastName" />
<h2>Hello, <span data-bind="text: fullName " />!</h2>
```

And the Javascript file

```javascript
var User = function () {
  this.firstName = ko.observable('Nadeem')
  this.lastName = ko.observable('Khedr')
  this.fullName = ko.computed(function () {
    return this.firstName() + ' ' + this.lastName()
  }, this)
}
ko.applyBindings(new User())
```

This will bind our javascript view model to the whole _html_ document and every variable in the _databind_ attributes wil refer to a property of this one view model

## Bind a _viewModel_ to a partial part of the page

In the previous example we passed our `viewModel` to `ko.applyBindings`, this method take another parameter, which is the `DOM` element that we want to attach our `viewModel` to, In the next example we will attach two different & not related `viewModel`s to different parts of our page

```html
<div id="section1">
  First name: <input type="text" data-bind="value: firstName" /> Last name:
  <input type="text" data-bind="value: lastName" />
  <h2>Hello, <span data-bind="text: fullName " />!</h2>
</div>
<div id="section2">
  First name: <input type="text" data-bind="value: firstName" /> Last name:
  <input type="text" data-bind="value: lastName" />
  <h2>Hello, <span data-bind="text: fullName " />!</h2>
</div>
```

```javascript
var User = function (firstName, lastName) {
  this.firstName = ko.observable(firstName)
  this.lastName = ko.observable(lastName)
  this.fullName = ko.computed(function () {
    return this.firstName() + ' ' + this.lastName()
  }, this)
}
ko.applyBindings(new User('Nadeem', 'Khedr'), $('#section1').get(0))
ko.applyBindings(new User('Phil', 'Joe'), $('#section2').get(0))
```

## Bind a _viewModel_ to the whole page and bind other *viewModel*s to sections inside the page

In a more advanced scenario what we could want is to bind a viewModel to the whole page & sort of mini `viewModel`s to different reusable components inside the page

In the previous example we cant define two `html` sections inside each other with different `viewModel`s, they must be distinct, in another word we can’t define a master view model for all the page and a small view model for a part of that page because they will collide

### A scenario that we would want exactly that

- We want a master `viewModel` to our page (Layout)
- We want a reusable `viewModel` for a sidebar that we could use in multiple pages (Partial View)

To achieve that what we will do is go to the parent of the sidebar and tell it stop binding the page `viewModel` to your descendant elements

so what will happen exactly is we will define a `viewModel` to the whole page without specifying a _DOM_ element to attach it to, and another _view model_ (maybe in another file) for only the sidebar and bind it to it

### How to do that without getting errors that the properties in the sidebar doesn’t exists in the application `viewModel`

We will put a custom attribute on the sidebar container, the attribute will look like this

```html
<div id="sidebarCont" data-bind="allowBinding: false"></div>
```

what this will do is tell the current view model attached to the document to stop binding itself to the descendant elements for the `sidebarCont`

the `allowBinding` is a custom `bindingHandler` that we defined and looks like this

```javascript
ko.bindingHandlers.allowBindings = {
  init: function (elem, valueAccessor) {
    var shouldAllowBindings
    shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor())
    return {
      controlsDescendantBindings: !shouldAllowBindings,
    }
  },
}
```

the above code is self explanatory all the magic happens with the _[controlsDescendantBindings](http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html)_

> if you want to read more about bindingHandlers you can check this [link](http://knockoutjs.com/documentation/custom-bindings.html)
