---
title: "Adding dynamic elements with unobtrusive jQuery validate in Asp.net-Mvc"
date: "2013-08-05T11:10:20.000Z"
tags: ["asp.net-mvc","javascript","unobtrusive-validation"]
---


If you are trying to parse a form that is already parsed it won’t update

What you could do if you are adding dynamic elements to the form is by either

1- Remove the form’s validation and re validate it it would be like this

```javascript
var form = $(formSelector)
  .removeData("validator") /* added by the raw jquery.validate plugin */
  .removeData("unobtrusiveValidation");
/* added by the jquery unobtrusive plugin */
$.validator.unobtrusive.parse(form);
```

2- Access the form’s `unobtrusiveValidation` data using the jquery `data` method

we can use `$(form).data(‘unobtrusiveValidation’)` and access the `rules` collection and add the new elements attributes *(which is somewhat complicated)*

***

for an example on how that is done check this article, this is a plugin used for adding dynamic elements to a form, its source code is easy to read [link here](http://xhalent.wordpress.com/2011/01/24/applying-unobtrusive-validation-to-dynamic-content/)



