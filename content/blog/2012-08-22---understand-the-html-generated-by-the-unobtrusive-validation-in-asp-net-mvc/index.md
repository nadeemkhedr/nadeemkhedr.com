---
title: 'Understand the Html generated by the unobtrusive validation in Asp.net MVC'
date: '2012-08-22T07:37:51.000Z'
tags: ['asp.net-mvc', 'jquery', 'jquery.validate', 'unobtrusive-validation']
---

this is part of “**_understanding Asp.net Mvc Unobtrusive Validation_**” series

1. [How the jQuery validate plugin works internally](/how-the-jquery-validate-plugin-works-internally/)
2. Understand the Html generated by the unobtrusive validation in Asp.net MVC
3. [How the unobtrusive jQuery validate plugin works internally in Asp.net MVC](/how-the-unobtrusive-jquery-validate-plugin-works-internally-in-asp-net-mvc/)

What we will be talking about in this article

- The idea of unobtrusive JavaScript
- Difference between normal and unobtrusive validation
- Understanding Unobtrusive validation
- Inputs and their validation rules and how they work
- The validation messages and how they work in the unobtrusive validation

# The idea of unobtrusive JavaScript

Microsoft released its validation module from the first version of Mvc but it has really matured in every version until finally the release of unobtrusive validation in Asp.net Mvc 3

In short even writing modern JavaScript, which is basically JavaScript in a separate js file. we sometimes need data associated with the Html so we write some metadata JavaScript objects inside the Html page itself and will call a function from the external js file passing it the metadata object in the page

one of the goals of unobtrusive JavaScript is to separate JavaScript from Html markup

To read more about this subject check [this article](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript)

---

# Difference between normal and unobtrusive validation

We now will see a Model and the corresponding Html generated using MVC 2 and MVC 3 using unobtrusive validation

**Our Model**

```csharp
public class ValidationModel {
  [Required]
  public string FirstName { get; set; }

  [Required, StringLength(60)]
  public string LastName { get; set; }

  [Range(1, 130)]
  public int Age { get; set; }
}
```

**The View in MVC 2 using html helpers**

```html
<label for="FirstName">FirstName</label>
<input
  id="FirstName"
  class="text-box single-line"
  type="text"
  name="FirstName"
  value=""
/>
<span id="FirstName_validationMessage" class="field-validation-valid"> </span>

<label for="LastName">LastName</label>
<input
  id="LastName"
  class="text-box single-line"
  type="text"
  name="LastName"
  value=""
/>
<span id="LastName_validationMessage" class="field-validation-valid"></span>

<label for="Age">Age</label>
<input id="Age" class="text-box single-line" type="text" name="Age" value="" />
<span id="Age_validationMessage" class="field-validation-valid"></span>

<script type="text/javascript">
  // <![CDATA[
  if (!window.mvcClientValidationMetadata) {
    window.mvcClientValidationMetadata = []
  }
  window.mvcClientValidationMetadata.push({
    Fields: [
      {
        FieldName: 'FirstName',
        ReplaceValidationMessageContents: true,
        ValidationMessageId: 'FirstName_validationMessage',
        ValidationRules: [
          {
            ErrorMessage: 'The FirstName field is required.',
            ValidationParameters: {},
            ValidationType: 'required',
          },
        ],
      },
      {
        FieldName: 'LastName',
        ReplaceValidationMessageContents: true,
        ValidationMessageId: 'LastName_validationMessage',
        ValidationRules: [
          {
            ErrorMessage: 'The LastName field is required.',
            ValidationParameters: {},
            ValidationType: 'required',
          },
          {
            ErrorMessage:
              'The field LastName must be a string with a maximum length of 60.',
            ValidationParameters: { max: 60 },
            ValidationType: 'length',
          },
        ],
      },
      {
        FieldName: 'Age',
        ReplaceValidationMessageContents: true,
        ValidationMessageId: 'Age_validationMessage',
        ValidationRules: [
          {
            ErrorMessage: 'The field Age must be between 1 and 130.',
            ValidationParameters: { min: 1, max: 130 },
            ValidationType: 'range',
          },
          {
            ErrorMessage: 'The Age field is required.',
            ValidationParameters: {},
            ValidationType: 'required',
          },
          {
            ErrorMessage: 'The field Age must be a number.',
            ValidationParameters: {},
            ValidationType: 'number',
          },
        ],
      },
    ],
    FormId: 'form0',
    ReplaceValidationSummary: true,
    ValidationSummaryId: 'validationSummary',
  })
  // ]]>
</script>
```

**The View in MVC 3 using html helpers & unobtrusive validation**

```html
<label for="FirstName">FirstName</label>
<input
  id="FirstName"
  class="text-box single-line"
  type="text"
  name="FirstName"
  value=""
  data-val="true"
  data-val-required="The FirstName field is required."
/>

<label for="LastName">LastName</label>
<input
  id="LastName"
  class="text-box single-line"
  type="text"
  name="LastName"
  value=""
  data-val="true"
  data-val-length="The field LastName must be a string with a maximum length of 60."
  data-val-length-max="60"
  data-val-required="The LastName field is required."
/>

<label for="Age">Age</label>
<input
  id="Age"
  class="text-box single-line"
  type="text"
  name="Age"
  value=""
  data-val="true"
  data-val-number="The field Age must be a number."
  data-val-range="The field Age must be between 1 and 130."
  data-val-range-max="130"
  data-val-range-min="1"
  data-val-required="The Age field is required."
/>
```

_this code was taken from Brad Wilson [article](http://bradwilson.typepad.com/blog/2010/10/mvc3-unobtrusive-validation.html)_

As we can see the Html inputs generated from MVC 2 don’t have any knowledge about what kind of validation rules that are applied to them.
There is only a big JavaScript object containing all the info of the validation applied to every element on this page

On the other hand if we look at the inputs generated with MVC 3 it looks like they have much more metadata info in them and this is all the info needed for validating these fields in a from of `data-*` attributes and there is no need for a big JavaScript object

```html
<!– Input generated using MVC2 –>
<input
  id="FirstName"
  class="text-box single-line"
  type="text"
  name="FirstName"
  value=""
/>

<!– Input generated using MVC3 –>
<input
  id="FirstName"
  class="text-box single-line"
  type="text"
  name="FirstName"
  value=""
  data-val="true"
  data-val-required="The FirstName field is required."
/>
```

---

# Understanding Unobtrusive validation

## 1- Inputs and their validation rules and how they work

so lets explain what happens with these `data-*` attributes

- MVC outputs the `data-*` attributes based on the validation rules
- `jquery.validate.unobtrusive` will read these rules and translate them in a way
- after the unobtrusive validation translates these rules it will call `validate()` method and pass the rules array with other options to validate it

there are three parts of any unobtrusive rule in any Html element

- The `data-val=”true”` its just a flag that this element has unobtrusive validation attached to it
- The `data-val-rulename=”message”` it does two things first it declares that this element has a rule which is the `data-val-rulename` and the other is the error message which is the value of it
- The `data-val-rulename-additionalvalues=”value”` this for adding additional values required by the validation rule to complete its validation _(Ex. a range validation that must be more than a value and less than a value)_

we can take a closer look at a generated input and explain these `data-*` attributes

```html
<input
  id="Name"
  class="ignore"
  type="text"
  name="Name"
  value=""
  data-val="true"
  data-val-required="*"
  data-val-atleastonerequired="Enter at least Name, Email or Lastname"
  data-val-atleastonerequired-attributes="Email,LName"
/>
```

there are two rules attached to this element

one is the built in `required` attribute and the other is a custom one called `atleastonerequired`

and when the user doesn’t enter any data and press submit a `*` will appear as the validation message indicating the element is required and if the user violated the `atleastonerequired` its validation message would appear instead

## 2-The validation messages and how they work in the unobtrusive validation

Lets start with an example and build from there

```html
<!– Required input using unobtrusive validation –>
<input
  id="FirstName"
  class="text-box single-line"
  type="text"
  name="FirstName"
  value=""
  data-val="true"
  data-val-required="The FirstName field is required."
/>

<!– The input’s validation message placeholder –>
<span
  data-valmsg-replace="true"
  data-valmsg-for="Name"
  class="field-validation-valid help-inline"
/>
```

As we can see there are two `data-*` on the validation placeholder

- `data-valmsg-for` its value is the input’s `name` attribute that this placeholder belongs to , the input & placeholder must be in the same form tag
- `data-valmsg-replace` its `true` by default the difference between `true` and `false` , true will change the text of the placeholder depending on what validation rule was violated if its false it will be static and the content won’t change only the class name will switch on valid and invalid

if there is violation of any of the rules there will be a class name of `field-validation-error` and if there is none the class name will be `field-validation-valid`