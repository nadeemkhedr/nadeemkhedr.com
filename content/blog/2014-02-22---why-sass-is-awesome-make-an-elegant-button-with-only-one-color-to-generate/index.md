---
title: 'Why SASS is awesome, make an elegant button with only one color to generate'
date: '2014-02-22T08:23:20.000Z'
tags: ['Compass', 'CSS', 'SASS']
---

I have been using SASS in my latest project & I have to say its pretty AWESOME! , the CSS code is nicely structured and organized into multiple files using [OO CSS](http://oocss.org/ 'Object Oriented CSS') principles _(Maybe i’ll write about this in another article)_

I Just want to showcase what you can do using SASS

## Creating Elegant Buttons With Only One Color To Generate

[JSFiddle Link](http://jsfiddle.net/nadeemkhedr/7wJya/2 'CSS Button')

What i wanna do is pretty simple and similar to whats happening in [bootstrap](http://getbootstrap.com/) , It will consist of a base button class

```html
<a class="my-btn">My Button</a>
```

This class gives our button two things

- The structure that we want to use _(width, height, fone-size)_ and
- A default skin _(orange in our case)_ with all its different states _(hover, disabled)_

and whenever we want to create a different skin we will write our html to be like

```html
<a class="my-btn my-btn-primary">My Button</a>
```

`.my-btn-primary` will override the default skin cased by `.my-btn` (will produce a blue button in our case)

### Our SASS

Our code is organized to 3 sections

- Color definition variables
- Mixins _( you can read about it [here](http://sass-lang.com/guide 'SASS Guide'))_
- Our SASS rules

Here is the final SASS Code for making the buttons

```scss
/* Colors */
$btn-danger: #da4f49;
$btn-default: #f96b2d;
$btn-primary: #3196cb;
$btn-grey: #999;
$btn-grey-hover: #777;
$btn-color: white;

/* Mixins */
@mixin btn-theme($btn-color) {
  background: $btn-color;
  border-color: darken($btn-color, 10%);
}
@mixin btn-theme-hover($btn-color, $hover-color: '') {
  @if $hover-color == '' {
    $hover-color: saturate($btn-color, 10%);
    $hover-color: darken($hover-color, 10%);
  }
  background: $hover-color;
  border-color: darken($btn-color, 20%);
}
@mixin btn-theme-disabled($btn-color) {
  background: lighten($btn-color, 20%);
  border-color: lighten($btn-color, 10%);
}

/* Primary button class with default color (orange) */
.my-btn {
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid;
  color: $btn-color;
  @include btn-theme($btn-default);
}
.my-btn:hover {
  color: $btn-color;
  text-decoration: none;
  @include btn-theme-hover($btn-default);
}
.my-btn.disabled,
.my-btn.disabled:hover {
  -webkit-user-select: none;
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.65;
  @include btn-theme-disabled($btn-default);
}

/* Different versions of the button (extending) */
.my-btn.my-btn-primary {
  @include btn-theme($btn-primary);
}
.my-btn.my-btn-primary:hover {
  @include btn-theme-hover($btn-primary);
}
.my-btn.my-btn-primary.disabled,
.my-btn.my-btn-primary.disabled:hover {
  @include btn-theme-disabled($btn-primary);
}

.my-btn.my-btn-grey {
  @include btn-theme($btn-grey);
}
.my-btn.my-btn-grey:hover {
  @include btn-theme-hover($btn-grey, $btn-grey-hover);
}
.my-btn.my-btn-grey.disabled,
.my-btn.my-btn-grey.disabled:hover {
  @include btn-theme-disabled($btn-grey);
}

.my-btn.my-btn-danger {
  @include btn-theme($btn-danger);
}
.my-btn.my-btn-danger:hover {
  @include btn-theme-hover($btn-danger);
}
.my-btn.my-btn-danger.disabled,
.my-btn.my-btn-danger.disabled:hover {
  @include btn-theme-disabled($btn-danger);
}
```

As you can see to add a new button all you have to add is a set of rules *(for different states)* for the button and include the mixins for generating the different states colors by passing it the color that you want

What I really loved about this is two things [Compass](http://compass-style.org/) & Optional Parameters in Mixins

[Compass](http://compass-style.org/) which is is a framework built on top of SASS that provides extra functionality and built in functions *(`darken()`, `lighten()`, `saturate()`)*. In our example we were able to use only one color to generate a button with the use of compass functionality , we lightened the border color using `lighten($color, percentage)` function and also on hover we darkened & saturated the background color a little using `darken($color, percentage)` & `saturate($color, percentage)`

The second feature i was talking about is optional parameters for mixins, in our example the hover mixin worked pretty fine for all colors except with grey, saturate method will produce a weird background color for the button, for that i rewrote the mixin to include an optional 2nd parameter, if you passed it, it will use that color instead of applying the _darken_ & _saturate_ functions

```scss
@mixin btn-theme-hover($btn-color, $hover-color: '') {
  @if $hover-color == '' {
    $hover-color: saturate($btn-color, 10%);
    $hover-color: darken($hover-color, 10%);
  }
  background: $hover-color;
  border-color: darken($btn-color, 20%);
}
```

That’s about it, I really love the transition from writing CSS to just make it work to realizing that it too must be structured and written well to make a more reusable, maintainable CSS, and SASS is a very nice addition that will help you work in that direction
