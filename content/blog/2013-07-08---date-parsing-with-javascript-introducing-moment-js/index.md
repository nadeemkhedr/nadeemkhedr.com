---
title: 'Date parsing with JavaScript, Introducing Moment.js'
date: '2013-07-08T13:35:42.000Z'
tags: ['dates', 'javascript']
---

_JavaScript already has a `Date.parse()` method, why would we talk about date parsing?_

Because in short the `Date.parse()` method implementation is dependent on the browser itself, so it could return a different result in chrome/firefox/ie [like here](http://stackoverflow.com/questions/15291585/javascript-date-parse-method-not-working-correctly 'Example for date parsing problem')\*\*

## Introducing Moment.js

[Moment.js](http://momentjs.com/ 'moment.js') is a library for parsing, validating, manipulating, and formatting dates.

it has an excellent [documentation](http://momentjs.com/docs/ 'moment.js documentation'), it has plenty of helpful examples

### Parsing & Validating dates

```javascript
var isValid = moment('12-252-1995').isValid() //returns false
var date = moment('12-25-1995', 'MM-DD-YYYY') //prase a date using a specify format, if the actual date is in a different format isValid() will return false
var date = moment('12-25-1995', ['MM-DD-YYYY', 'YYYY-MM-DD']) //parse a date with a list of possible formats that it could matches

//using it as a wrapper of a date object
var day = new Date(2011, 9, 16)
var dayWrapper = moment(day)
```

#### Bonus for Asp.net MVC users

ASP.NET returns dates in _Json_ as `/Date(1198908717056)/` or `/Date(1198908717056-0700)/`

This will happen often if you try to make an ajax call to an asp.net action and it returns a `JsonResult` that contains `DateTime`

```javascript
var date = moment('/Date(1198908717056-0700)/') // December 28 2007 10:11 PM
```
