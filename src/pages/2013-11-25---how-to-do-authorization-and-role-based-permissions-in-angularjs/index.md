---
title: "How to do Authorization and Role  based permissions in AngularJs"
date: "2013-11-25T01:09:16.000Z"
tags: ["AngularJs","Permissions","Roles"]
---

## We will be adding 3 Layer to implement Authorization in our app

- UI manipulation *(Showing or hiding part of the screens based on the user permission)*
- Routing *(When the user access a route that he doesn’t have permission to will redirect him to an error  route)*
- Http Interceptor *(We will Setup an interceptor that will check when the server returns `401` or `403` and will redirect the user to an error route)*


## How will we implement it ?

1. We want to get all the user permissions before loading our app *(more like a resolve but for every route)*
2. then we will store it *(using a service)*
3. for showing/hiding sections of our app that require special permissions we will use a directive for that
4. Then when we define a route we will add an extra parameter `permission` and give it a value for the permission that it requires
5. then after that we will check in a `routeChangeStart` event to check if the user has permissions for that route *(if any)*,
6. lastly we will set an http interceptor & read the respond status codes if its  `401` or `403` we will redirect the user to an error page

Its a long list, so lets get starting


## How to run the angular app in run time

```javascript
var permissionList;
angular.element(document).ready(function() {
  $.get('/api/UserPermission', function(data) {
    permissionList = data;
    angular.bootstrap(document, ['myApp']);
  });
});
```

### Why would you want to do that ?

*And why use jQuery ? isn’t it evil to do that*

We are doing this because we want to get all the permissions before firing up the angular app *(Like a [resolve](http://docs.angularjs.org/api/ngRoute.$routeProvider" Angular Route") method for every route)*

We want to get all the users' permissions that we will be using as the base for running all the permissions logic

And we are using `$.ajax` because the app at that point is not loaded so we can’t use angular services

### How we are using the data returned ?

Lets see an extended version of the code

```javascript
//app.js
var app = angular.module('myApp', []), permissionList;

app.run(function(permissions) {
  permissions.setPermissions(permissionList);
});

angular.element(document).ready(function() {
  $.get('/api/UserPermission', function(data) {
    permissionList = data;
    angular.bootstrap(document, ['myApp']);
  });
});
```

```javascript
//permissions.js
angular.module('myApp')
  .factory('permissions', function ($rootScope) {
    var permissionList;
    return {
      setPermissions: function(permissions) {
        permissionList = permissions;
        $rootScope.$broadcast('permissionsChanged');
      }
    };
  });
```

What we are doing is after getting the permissions returned from the server is call `setPermissions` on the `permissions` service that will do two things:

- Save the permission list passed to it to an in memory variable
- Broadcast an event that will be listened by our custom directive to re-render it if the permissions changed


## How to show/hide UI elements based on the user permissions

In this part we will be building a directive that will show & hide elements based  on the user permissions, lets get started by seeing an example of what we want to achieve

```html
<!– If the user has edit permission the show a link –>
<div has-permission='Edit'>
  <a href="/#/courses/{{ id }}/edit">{{ name }}</a>
</div>
<div has-permission='!Edit'>
  {{ name }}
</div>
```

As seen in the example above we are using `has-permission` and passing it the permission name, or if we want to check if the user doesn’t have a permission we will prepend it with `!`

How its implemented

```javascript
//hasPermission.js
angular.module('myApp').directive('hasPermission', function(permissions) {
  return {
    link: function(scope, element, attrs) {
      if(!_.isString(attrs.hasPermission)) {
        throw 'hasPermission value must be a string'
      }
      var value = attrs.hasPermission.trim();
      var notPermissionFlag = value[0] === '!';
      if(notPermissionFlag) {
        value = value.slice(1).trim();
      }

      function toggleVisibilityBasedOnPermission() {
        var hasPermission = permissions.hasPermission(value);
        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
          element[0].style.display = 'block';
        }
        else {
          element[0].style.display = 'none';
        }
      }

      toggleVisibilityBasedOnPermission();
      scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
    }
  };
});
```

```javascript
//permissions.js
angular.module('myApp')
.factory('permissions', function($rootScope) {
  var permissionList = [];
  return {
    setPermissions: function(permissions) {
      permissionList = permissions;
      $rootScope.$broadcast('permissionsChanged');
    },
    hasPermission: function (permission) {
      permission = permission.trim();
      return permissionList.some(item => {
        if (typeof item.Name !== 'string') { // item.Name is only used because when I called setPermission, I had a Name property
          return false;
        }
        return item.Name.trim() === permission;
      });
    }
  };
});
```

The `has-permission` is pretty straight forward, it checks if the permission starts with `!` then checks to see if the permission name is found in the permissions list by calling `hasPermission` on the `permissions` service


## Permissions on Routes

What we have done so far is hiding the parts of the UI that the user doesn’t have access to, another part is putting permissions on the angular routes itself, so if the user writes the url by hand the permissions will still work

### How will we do that ?

When we define a route we will add an extra parameter `permission` and give it a value for the permission that it requires then after that we will test in a `routeChangeStart` event to check if the user has permissions for that route

Example of defining a route

```javascript
//app.js
var app = angular.module('myApp', []), permissionList;

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/viewCourses.html',
      controller: 'viewCoursesCtrl'
    })
    .when('/unauthorized', {
      templateUrl: 'views/error.html',
      controller: 'ErrorCtrl'
    })
    .when('/courses/:id/edit', {
      templateUrl: 'views/editCourses.html',
      controller: 'editCourses',
      permission: 'Edit'
    });
});

app.run(function(permissions) {
  permissions.setPermissions(permissionList);
});

angular.element(document).ready(function() {
  $.get('/api/UserPermission', function(data) {
    permissionList = data;
    angular.bootstrap(document, ['myApp']);
  });
});
```

```javascript
//mainApp.js (Parent controller used everywhere)
app.controller('mainAppCtrl', function($scope, $location, permissions) {
  $scope.$on('$routeChangeStart', function(scope, next, current) {
    var permission = next.$$route.permission;
    if(_.isString(permission) && !permissions.hasPermission(permission)) {
      $location.path('/unauthorized');
    }
  });
});
```

## Http Interceptor for checking unauthorized response from the server

This is also straight forward, we are just hooking up an interceptor that will read the response status code, if its `401` or `403` it will redirect it to `unauthorized` page

```javascript
angular.module('myApp')
.factory('authInterceptor', function($q, $location) {
  return {
    responseError(response) {
      if(response.status === 401 || response.status === 403) {
        $location.path('/unauthorized');
      }
      return $q.reject(response);
    }
  };
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
```

That’s about it as you can see its pretty easy to implement and customize, hope this post helps, if you have any questions or something you see can be done better then please leave me a comment
