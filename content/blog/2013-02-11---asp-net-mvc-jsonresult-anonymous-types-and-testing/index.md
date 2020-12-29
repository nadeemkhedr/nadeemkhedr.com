---
title: 'Asp.net MVC JsonResult, Anonymous types and Testing'
date: '2013-02-10T16:05:14.000Z'
tags: ['asp.net-mvc', 'unit-testing']
---

This article is an explanation on how to access the data from a `JsonResult` for using it in your unit testing

The `JsonResult` type has a property called `Data` of type `Object` that you can parse if you have used a concrete object as your data not an anonymous one

**for example:**

### Model

```csharp
public class Person
{
  public int Id { get; set; }
  public string Name { get; set; }
  public string Age { get; set; }
}
```

### Controller Action

```csharp
public JsonResult Index()
{
  //Logic …
  var person = new Person
  {
    Id = 1,
    Name = "Nadeem",
    Age = "24"
  };
  return Json(person);
}
```

### Unit Test

```csharp
[Test]
public void Testing()
{
  var controller = new HomeController();
  var result = controller.Test();
  var data = result.Data as Person; //you can now access the Person properties

 //Assert
}
```

---

This is all good but we get stuck if we want to pass an anonymous object to our `JsonResult` there is no way to cast to something to access an anonymous object properties

the solution is I've made two custom helper methods that we can use to get values from a `JsonResult.Data` object

I'll follow after with an example of using it

### The custom helper:

```csharp
public static class Helper
{
  public static object GetValue(this JsonResult result,string propertyName)
  {
    IDictionary<string, object> wrapper = new System.Web.Routing.RouteValueDictionary(result.Data);
    return wrapper[propertyName];
  }
  public static T GetValue<T>(this JsonResult result, string propertyName)
  {
    return (T) GetValue(result, propertyName);
  }
}
```

## Example:

### Controller Action

```csharp
public JsonResult Index()
{
  //Logic …
  return Json(new {number = 1});
}
```

### Unit Test

```csharp
[Test]
public void Testing()
{
  var controller = new HomeController();

  var result = controller.Index();

  Assert.AreEqual(1, result.GetValue<int>("number"));
}
```

This is how to test a `JsonResult` using  anonymous types

---

## For the fun of it we can make a helper that returns a dynamic type

### The custom helper:

```csharp
public static dynamic ToDynamic(this JsonResult jsonResult)
{
  var expandoObject = new ExpandoObject();
  var expandoCollection = (ICollection<KeyValuePair<string, object>>)expandoObject;
  var dataWrapper = new RouteValueDictionary(jsonResult.Data);
  foreach (var kvp in dataWrapper)
  {
    expandoCollection.Add(kvp);
  }
  dynamic eoDynamic = expandoObject;
  return eoDynamic;
}
```

###Unit Test

```csharp
public void Testing()
{
  var controller = new HomeController();
  var result = controller.Index();
  Assert.AreEqual(1, result.ToDynamic().number);
}
```
