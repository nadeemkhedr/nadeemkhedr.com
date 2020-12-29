---
title: 'AngularJs Good Unit Test Structure For Controllers & How to test ajax code and Promises'
date: '2013-10-18T05:03:38.000Z'
tags: ['AngularJs', 'javascript', 'unit-testing']
---

The poorly the structure for unit testing the more and more complected it will take to write more unit tests for a simple functioning piece of code, in the end it will feel that your fighting your way against testing, instead it should feel more fun! So I’ll be showing a structure that worked for me very well when working with angular controllers Before going deep with the structure, i’ll be using

- Jasmine _(unit testing)_
- Jasmine spies _(mocking)_
- karma _(because its awesome)_

## Don’t instantiate your controller in the beforeEach _(almost all the time)_

This is by far point number one, because by doing so, you’ll loose so much power in mocking the dependencies that are used when the controller load in your unit test, you will have to write all that code in the `beforeEach` before instantiating the controller *(where its not where it should be, because it will be specific for each unit tests)* If you tried to do that, the `beforeEach` will be the only place to mock out all the dependencies for all the unit tests, because you can’t mock or inject a specific value for any of the dependencies in any of the unit tests, it will be too late the controller will already be instantiated

#### Example:

```javascript
describe('Controller: UsersCtrl', function () {
  var controllerFactory, scope, mockApi;

  function createController() {
    return controllerFactory('UsersCtrl', {
      $scope: scope,
      api: mockApi
    });
  }

  // Load the module that the controller you are testing is in
  beforeEach(module('MyApp'));

  // inject is used for resolving references that you need to
  // use in your tests, don’t use this as a normal beforeEach,
  // this beforeEach is used to resolve references
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    //instead of instantiating the controller using $controller
    //we are saving a reference for it & calling it in the
    //createController function and later will use in each unit test

    controllerFactory = $controller;
  }));

  //The actual before each for setting up common
  //variables, dependencies or functions
  beforeEach(function() {
    mockApi = …. ;
  });

  //Actual test
  it('controller when load should call api.users', function() {
    createController();
    expect(mockApi.users).toHaveBeenCalled();
  });
});
```

To note from the example above there is three `beforeEach`

1. One for specifying the module to be loaded
2. Second using angular.mock.inject to inject dependencies that would be used in the unit tests
3. Third for initialize common functionality that will be used in the unit tests

I really want to separate between the second and the third one, don’t like to merge both of them into one `beforeEach`. The reason is that I like to separate the responsibilities in each `beforeEach` that makes the code cleaner for me

### Note on inject

`inject()` is defined in `angular.mock.inject()`for ease of use its defined also in the global `window` object its in angular.mock.js , so its only used in testing environment the note about the inject its that the _injector unwraps the underscores (\_) from around the parameter names when matching_

Why would that be useful ?

The problem is that we would, most likely  want the variable to have the same name of the reference, if we did that we would have a problem, since the parameter to the `inject()` function would hide the outer variable. To help with this, the injected parameters can, optionally, be enclosed with underscores. These are ignored by the injector when the reference name is resolved.

#### Example:

```javascript
beforeEach(inject(function (_$compile_, _$rootScope_) {
  // The injector unwraps the underscores (_) from around the parameter names when matching
  $compile = _$compile_
  $rootScope = _$rootScope_
}))
```

## Promises & ajax requests and how to mock them

Angular implements a promise/deferred pattern for its ajax stuff, any ajax request will return a promise, also you can create a new promise using the [$q service](http://docs.angularjs.org/api/ng.$q)

#### What’s a promise ?

That’s a big talk in it self, in summary we always love the idea of chaining method calls, but that’s not possible in the async world, we have to write our code in the callback functions of each async action, that’s not fun when there is multiple async actions happening or if you want for example to fire an action if the two previous async actions where successful and another one regardless if the request where successful or failure, you get the idea it get pretty complected pretty fast

A basic promise introduces a `then(successFn, failFn)` of any async object

#### Example:

```javascript
var requestPromise = $http.get('/url')
requestPromise.then(function () {
  //do stuff
})
```

in the example above the `$http.get()` returns a promise, after we made the request we then called `then()` and passed it its first argument as the function to trigger if the request was successful and ignored the second parameter _(don’t want to do anything if the request was failure)_

#### How would we mock that?

If you want to use the `$http` directly inside the controller you can read about [$httpBackend](http://docs.angularjs.org/api/ngMock.$httpBackend)

what I prefer is to put all the ajax code inside external services _(or in the resolve function of the router)_ and call these services from the controller, and then for testing i can mock the object itself and I won’t get into the hassle of using `$httpBackend`

#### Example:

```javascript
angular.module(‘MyApp’)
  .factory(‘api’, function($http) {
    return {
      users: $http.get(‘/users’)
    };
  })
  .controller(‘UsersCtrl’, function(api, anotherService) {
    api.users.then(function(data) {
      anotherService.doSomething(data);
    });
  });
```

We want to test when the `api.users()` is successful, `anotherService.doSomething()` will be called with the data returned from api.users()

```javascript
describe(‘Controller: UsersCtrl’, function () {
  var controllerFactory, scope, $q, mockApi = {}, anotherService = {}, usersData;

  function createController() {
    return controllerFactory('UsersCtrl', {
      $scope: scope,
      api: mockApi,
      anotherService: anotherService
    });
  }

  // Load the module that the controller you are testing is in
  beforeEach(module('MyApp'));

  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    scope = $rootScope.$new();
    controllerFactory = $controller;
    $q = _$q_;
  }));

  //The actual before each for setting up common variables, dependencies or functions

  beforeEach(function() {
    mockApi.users = jasmine.createSpy('users');
    anotherService.doSomething = jasmine.createSpy('doSomething');

    //this will be the return type of the api.users, it will return a promise
    var usersDefer = $q.defer();

    //resolve on a defer and passing it data, will always run
    //the first argument of the then() if you want to test
    //the second one, write reject() instead.
    //but here by default we want to resolve it and pass it
    //an empty object that we can change it’s value in any unit test
    usersDefer.resolve(usersData);

    //defer.promise is actually the object that has the then() method
    mockApi.users.andReturn(usersDefer.promise);
  });

  //Actual test
  it(‘controller when load should call api.users’, function() {
    usersData = [{id: 1,name: 'Joe'}];
    createController();

    //scope.$digest() will fire watchers on current scope,
    //in short will run the callback function in the
    //controller that will call anotherService.doSomething
    scope.$digest();
    expect(anotherService.doSomething).toHaveBeenCalledWith(usersData);
  });
});
```

[This article](http://www.benlesh.com/2013/08/angularjs-watch-digest-and-apply-oh-my.html) explains `$digest` & `$apply` more indepth
