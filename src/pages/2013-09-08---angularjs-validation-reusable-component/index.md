---
title: "AngularJs Validation Make A Reusable Component"
date: "2013-09-08T13:07:13.000Z"
tags: ["AngularJs","javascript","validation"]
---


The problem is the code required for bootstrapping an angular form is quite a lot


## The normal angular way of writing a form with validation messages


```html
<form name="myForm">
  <div class="control-group" ng-class="{'error' : myForm.userId.$invalid && myForm.userId.$dirty}">
    <label class="control-label" >User Id</label>
    <input type="text" name="userId" ng-model="userId" required ng-pattern="/^id_[0-9]+$/" />
    <div class="custom-error" ng-show="myForm.userId.$dirty && myForm.userId.$invalid">Invalid:
      <span ng-show="myForm.userId.$error.required">User id is required.</span>
      <span ng-show="myForm.userId.$error.pattern">User id doesn't respect the pattern.</span>
    </div>
  </div>
</form>
```

- To reference the field status (`valid`, `dirty`) you access it by `{formname}.{field name}`
- `$dirty` means the field has been changed, the idea of checking on it is that we don’t want to show the validation messages when the form first loads

The problem with this  is that there is too much duplicate checking on every validation message on every element


## The new way after using custom directives for writing a form

```html
<form submit-valid="submiForm()" name='customer-form' novalidate>
  <field ng-model='customer.FirstName' type='text' label='First Name:' required>
    <validator key='required'>First name is required</validator>
  </field>
  <input type="submit" value="submit" />
</form>
```

### The field directive

The beauty of this is a couple of things

- The code required for bootstrapping a form is much much less and is CLEAN
- The `field` directive is easy to extend, you can easily put other directives on it and they will be applied to the input directly (custom `date-picker` for example or custom validation directive or even a `class` attribute)

### The submit-valid Directive

Normally in angular the validation message for a field will only appear after the field is changed dirty & is invalid

What we want is that the validation message appears when the field is invalid and dirty ***OR when the form has been attempted to be submitted & is invalid***

`submit-valid` takes a function and it will fire on* form submit* but only if the form is `valid` In short its exactly like ***ng-submit*** but with two extra features

- Like i said it will fire the callback function **only** if the form is **valid**
- It will also track a value on a form, `attempt` and when the form has been tried to be submitted it will set it to `true`

The `field` directive respects the value of the `attempt` variable on the form **if its there** , so now if you put `submit-valid` on a form when trying to submit it, the validation messages for the invalid fields will appear

### Use Textarea or Select

The `field` directives works on `Input`, `textarea` & `select`

To use `textarea` or `select` you specify a `template` property on the `field` directive with value of `textarea` or `select` and pass the same extra parameters that you would pass to either of them (`ng-options` for `select` for example)


## Resources

The field directive was made by [Pete Bacon Darwin](https://github.com/petebacondarwin "Github") and its original example is [here](http://plnkr.co/edit/3zMsNnpNfOFwExSqLj2I?p=preview "plnkr"), I just modified it to work with the `submit-valid` directive

[The plnkr for the code](http://plnkr.co/edit/lOCQi7 "plnkr")
