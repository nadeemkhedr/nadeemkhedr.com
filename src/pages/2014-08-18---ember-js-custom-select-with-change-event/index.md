---
title: "Ember.js Custom Select with Change Event Callback"
date: "2014-08-18T06:01:40.000Z"
tags: ["Ember.js"]
---

We want to implement basic change callback functionality on a Ember Select , sadly its not part of the ember select view, if you searched about how to implement it, most of the answers would be: make an observable, the hard part if you want to save data when the select changes, that would fire the observable indefinitely and to work around it you would have to hack it

The solution actually is very basic, we just have to extend the `Ember.Select` and add `onChange` callback function

```javascript
App.SelectView = Ember.Select.extend({
  change: function () {
    var self = this;
    this._super();
    var callback = this.get('onChange');
    if (callback) {
      Em.run.later(function () {
        self.get('controller').send(callback);
      });
    }
  }
});
```

> call to `this._super()` its mandatory.

And to call it
```hbs
{{view App.SelectView
  content=items
  value=item
  prompt=’Select Item’
  onChange=’saveItem’
}}
```
