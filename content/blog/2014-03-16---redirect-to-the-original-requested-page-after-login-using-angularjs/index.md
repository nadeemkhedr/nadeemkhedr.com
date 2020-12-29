---
title: 'Redirect to the original requested page after login using AngularJs'
date: '2014-03-16T14:32:54.000Z'
tags: ['AngularJs', 'Interceptor']
---

What we want to do is that when the user tries to go to a page and he is not logged in, we want to redirect him back to that page after he login successfully There is two different scenarios that we want to handle

- The user is not logged in to our site and tries to access it _(no cookie stored)_
- When the user is already in our site and he makes a request to the server and the the server  returns unauthorized `401` (in case the user is logged in and the cookie times out)

the idea behind the implementation is simple, what we will be doing is on the app load we will check if the user is logged in _(there is a cookie)_, if not we will save the requested url* (the page that the user originally wanted to go to)* and after that we will redirect the user to the login screen when he login we will redirect him back to the url that he originally requested

the same scenario will happens when the server returns unauthorized header `401` we will apply that using an interceptor that will checks the status code returned from the server if its `401` we will do the same thing as above

```javascript
var app = angular.module('myApp')

//where we will store the attempted url
app.value('redirectToUrlAfterLogin', { url: '/' })

//this service will be responsible for authentication and also saving and redirecting to the attempt url when logging in

app.factory(
  'appAuth',
  function ($location, $cookies, api, redirectToUrlAfterLogin) {
    return {
      login: function (credentials) {
        return api.login(credentials)
      },
      isLoggedIn: function () {
        return !!$cookies.FPSSO //convert value to bool
      },
      saveAttemptUrl: function () {
        if ($location.path().toLowerCase() != '/login') {
          redirectToUrlAfterLogin.url = $location.path()
        } else {
          redirectToUrlAfterLogin.url = '/'
        }
      },
      redirectToAttemptedUrl: function () {
        $location.path(redirectToUrlAfterLogin.url)
      },
    }
  }
)

// When the app loads
app.run(function ($location, appAuth) {
  if (!appAuth.isLoggedIn()) {
    appAuth.saveAttemptUrl()
    $location.path('/login')
  }
})

//Setting up the interceptor to handle when the server returns 401
app
  .config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('securityInterceptor')
  })
  .provider('securityInterceptor', function () {
    this.$get = function ($location, $q, $injector, $cookies) {
      return function (promise) {
        var appAuth = $injector.get('appAuth')
        return promise.then(null, function (response) {
          if (response.status === 401) {
            delete $cookies.FPSSO
            appAuth.saveAttemptUrl()
            $location.path('/login')
          }
          return $q.reject(response)
        })
      }
    }
  })
```

> To use the $cookies service you need to reference the `angular-cookies.js` and when you are defining your module you need to depend on `ngCookies`

<!-- -->

> the `api` service is just a custom service that has a `login()` method, it just makes an ajax request to the server with the credentials passed and then returns a promise

<!-- -->

> we are using [responseInterceptors](http://code.angularjs.org/1.0.8/docs/api/ng.$http#responseinterceptors)  which is fine if your using angular bellow 1.1.4 as of 1.1.4 it is considered _deprecated_ and you should be using [interceptors](http://docs.angularjs.org/api/ng/service/$http#interceptors) which are easier to use

The last piece of our app is the actual login screen, i’ll just show its controller because its pretty simple

```javascript
app.controller('LoginCtrl', function ($scope, $location, api, appAuth) {
  $scope.model = {UserName: "", Password: ""};

  if (appAuth.isLoggedIn()) {
    $location.path(‘/’);
  }

  $scope.submit = function () {
    var credentials = {
      "UserName": $scope.model.UserName,
      "Password": $scope.model.Password
    };
    api.login(credentials).then(function () {
      appAuth.redirectToAttemptedUrl();
    }, function () {
      $scope.ErrorMessage = "Login failed. Incorrect Username or Password";
    });
  };
});
```

That’s about it, whats happening here is when the user login we will redirect him to the page that he was trying to access by calling `appAuth.redirectToAttemptedUrl()`
