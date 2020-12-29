---
title: 'AngularJs Scroll to element using directives'
date: '2014-01-03T15:32:50.000Z'
tags: ['AngularJs', 'directive', 'javascript']
---

I want to implement a simple concept using angular, scrolling to a specific area of the page using a directive, I found myself needing this in a pagination example, I want to scroll to the top of the list when the user clicks on next page

Whenever I am trying to implement a directive like that I always try to first write how I would want to represent it in the html.

**To checkout a demo go [here](http://plnkr.co/edit/WmxLJy2VWWJ69WMAz8am)**

I want my html in the end to be something like this

```html
<div class="def" scroll-bookmark>
  <h1>Default</h1>
</div>
<div class="bm1" scroll-bookmark="bookmark1">
  <h1>Bookmark 1</h1>
</div>
<div class="bm2" scroll-bookmark="bookmark2">
  <h1>Bookmark 2</h1>
</div>

<div class="btns">
  <button scroll-to-bookmark>Default bookmark</button>
  <button scroll-to-bookmark="bookmark1">Bookmark 1</button>
  <button scroll-to-bookmark="bookmark2">Bookmark 2</button>
</div>
```

So there is two parts that makes this example

**`scroll-bookmark`**
Is Where I want to scroll to _(I want to register how I would get there)_

**`scroll-to-bookmark`**
This is the actual directive, I want when I click here to scroll to the corespondent `scroll-bookmark` with the same value _(default one if there is no value)_

```javascript
angular.module('MyApp').directive('scrollToBookmark', function() {
  return {
    link: function(scope, element, attrs) {
      var value = attrs.scrollToBookmark;
      element.click(function() {
        scope.$apply(function() {
          var selector = "[scroll-bookmark='"+ value +"']";
          var element = $(selector);
          if(element.length) {
            window.scrollTo(0, element[0].offsetTop – 100);
            // Don’t want the top to be the exact element, -100 will go to the top for a little bit more
          }
        });
      });
    }
  };
});
```
