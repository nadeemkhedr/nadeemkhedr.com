---
title: 'CSV how to upload and read from it , in a clean way using Asp.net MVC'
date: '2013-07-06T16:05:14.000Z'
tags: ['asp.net-mvc']
---

What we will be using

- [FileHelpers](http://www.filehelpers.com/ 'FileHelpers') _(for parsing the CSV file)_ you can download it with nuget
- Asp.net MVC 3

## The Goal

I want to upload a CSV file to the server and read it as a collection of objects

**The Goal is turning these records to a List of objects with int Id and string Name**

Lets get right into it

## Viewing the form

### Home Controller

```csharp
public ViewResult Show()
{
  return View();
}
```

### Show.cshtml

```html
@using (Html.BeginForm("ProcessCsv", "HomeController", FormMethod.Post, new {
enctype = "multipart/form-data" })) {
<h2>Import Using CSV</h2>
<div class="control-group">
  <div class="controls">
    <input
      id="model"
      type="file"
      accept="csv"
      name="model"
      data-val="true"
      data-val-required="File is required"
    />
  </div>
</div>
<input class="btn btn-primary" type="submit" value="Import" />
}
```

Lets talk about the view for a little bit, First in the form tag the attribute `enctype = “multipart/form-data”` is a must if the form contains a file upload

> `multipart/form-data` is a type of encoding the form and you should use it when you have a file upload so the server can understand it

As you can see i wrote manually the `data-*` attributes that will trigger the Asp.net unobtrusive validations , because there is no html helpers for input `type="file"`

```html
<input
  id="model"
  type="file"
  accept="csv"
  name="model"
  data-val="true"
  data-val-required="File is required"
/>
```

i made it required by writing `data-val=true` & `data-val-required=msg` and only accepts `csv` files

> `accept` will make the input only accepts csv files (jquery.validate uses the accept attribute to validate the element)

## Posting data from the form

### Home Controller

```csharp
public ViewResult ProcessCsv(EventItem[] model)
{
  return View();
}
```

### Model

```csharp
[DelimitedRecord(",")]
[IgnoreFirst(1)]
public class EventItem
{
  public int Id { get; set; }
  public string Name { get; set; }
}
```

> The two attributes `DelimitedRecord` & `IgnoreFirst` are FileHelpers attributes they are configrations to map between the CSV and our model

You must now be saying there is something wrong happening because in our view we uploaded a file , how the action takes `EventItem[]` as a parameter instead of `HttpPostedFileBase`

The secret is because we implemented a **custom model binder** that will do exactly that

### The Model Binder

```csharp
public class CsvModelBinder<T> : DefaultModelBinder where T : class
{
  public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
  {
    var csv =   bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
    var file = ((csv.RawValue as HttpPostedFileBase[]) ?? Enumerable.Empty<HttpPostedFileBase>()).FirstOrDefault();

    if (file == null || file.ContentLength < 1)
    {
      bindingContext.ModelState.AddModelError(
        "",
        "Please select a valid CSV file"
      );
      return null;
    }

    using (var reader = new StreamReader(file.InputStream))
    {
      try
      {
        var engine = new FileHelperEngine<T>();
        return engine.ReadStream(reader);
      }
      catch (Exception c)
      {
        bindingContext.ModelState.AddModelError(bindingContext.ModelName, c.Message);
        return null;
      }
    }
  }
}
```

### In Global.ascx.cs

```csharp
ModelBinders.Binders.Add(typeof(EventItem[]), new CsvModelBinder<EventItem>());
```

We made a generic **CSV model binder** and in our `global.ascx.cs` we will map the model that we will use as a CSV model to the CSV model binder and give it that model as its type.

The model binder logic is that it will turn the file to a `StreamReader`, then will try to read it using the `FileHelper` if it throws an exception _(the files types are not correct, or other reason)_ will add an error to the `ModelState` so in the controller we can check if its valid using `ModelState.IsValid`
