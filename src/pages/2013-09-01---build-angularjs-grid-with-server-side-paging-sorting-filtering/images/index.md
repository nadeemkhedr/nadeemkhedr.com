---
title: "Build AngularJS Grid with server side paging, sorting & filtering"
date: "2013-09-01T13:07:13.000Z"
tags: ["AngularJs","javascript"]
---


I will be showing how to build a grid that supports server-side paging, sorting & filtering

My goal with this  is that I didn’t want to implement a more complex approach that will be hard to customize later, so what i ended up doing is implementing a solution that will show a list of data in a table like structure and implement a reusable solution for paging, sorting & filtering


There are three major parts in this **Pagination**, **Sorting** & **filtering**
 First, let's look at the HTML that constructs this grid


- In the code above the `filterCriteria` is what will be sent to the server on each action *(sorting, paging & filtering )*, that's why all filter criteria are stored in it, also we will store there the page number & the sort direction *(because on each action we want to send all these info to the server)*

> Because we are implementing the filters that way, in our server what we are doing is checking if the value is null or empty string if so it will ignore it

- In the `headers` collection the `title` is what will be shown, the `value` is what will be sent to the server when sorting


## Sorting

We are iterating over all the headers in our grid then use a custom `sort-by` directive  its function is two things

- Render the title and the sort direction indicator. All of the headers reference the same two variables (`sortdir` & `sortedby`) and each header just has its own title & value, the value is used for two things
 - It will show the arrow on the currently sorted element (by checking the `sortedby` value)
 - It will show the right sorting direction on the item (by checking the `sortdir` value)
- When clicking on the header call the callback function that we passed to `onsort` which is `onSort` in our example and pass to it the sorted by value & the sort direction

###### The following is the code for the `sort-by` directive
```javascript
// sortBy.js
angular.module('MyApp').directive('sortBy', function () {
  return {
    templateUrl: 'sort-by.html',
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      sortdir: '=',
      sortedby: '=',
      sortvalue: '@',
      onsort: '='
    },
    link: function (scope, element, attrs) {
      scope.sort = function () {
        if (scope.sortedby == scope.sortvalue) {
          scope.sortdir = scope.sortdir == 'asc' ? 'desc' : 'asc';
        }
        else {
          scope.sortedby = scope.sortvalue;
          scope.sortdir = 'asc';
        }
        scope.onsort(scope.sortedby, scope.sortdir);
      }
    }
  };
});
```

```html
<!-- sort-by.html -->
<a ng-click="sort(sortvalue)">
  <span ng-transclude=""></span>
  <span ng-show="sortedby == sortvalue">
    <i ng-class="{true: 'icon-arrow-up', false: 'icon-arrow-down'}[sortdir == 'asc']"></i>
  </span>
</a>
```


## Filtering

As you can see in the inputs we are using two custom attributes `on-blur-change` passing it a callback function & `on-enter-blur`

`on-blur-change` will be called when the user blurs away from a textbox but when only the textbox is changed (don’t want to fire a request if the user clicked on a filter and clicked away without doing anything)

`on-enter-blur` will blur away from the element when the user press enter (will call `on-blur-change` call back function if the value is changed)

the reason we are using those instead of the normal angular change event because change will fire on each character added/removed, we want to make an ajax call after the user finish typing not while he is typing

###### The following is the code for the `on-blur-change` directive

```
// onBlurChange.js
angular.module('MyApp').directive('onBlurChange', function ($parse) {
  return function (scope, element, attr) {
    var fn = $parse(attr['onBlurChange']);
    var hasChanged = false;
    element.on('change', function (event) {
      hasChanged = true;
    });

    element.on('blur', function (event) {
      if (hasChanged) {
        scope.$apply(function () {
          fn(scope, {$event: event});
        });
        hasChanged = false;
      }
    });
  };
});
```

We are adding a flag in the change event and will set it to true once its fired, and when the user blur away will check on that flag

###### The following is the code for the `on-enter-blur` directive

```javascript
// onEnterBlur.js
angular.module('MyApp').directive('onEnterBlur', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        element.blur();
        event.preventDefault();
      }
    });
  };
});
```


## Pagination

We are using the [UI Bootstrap](http://angular-ui.github.io/bootstrap/#/pagination) for angular passing it the page number & a call back when clicked

> the reason we are using a callback function instead of observing the variable `pageNumber`, is because when we filter or sort we manually want to change the `pageNumber` without making an ajax request


# The Controller

```javascript
angular.module('MyApp').controller('GridCtrl', function ($scope, api) {
  $scope.totalPages = 0;
  $scope.customersCount = 0;
  $scope.headers = [{
      title: 'Id',
      value: 'id'
    },{
      title: 'Name',
      value: 'name'
    },{
      title: 'Email',
      value: 'email'
    },{
      title: 'City',
      value: 'city'
    },{
      title: 'State',
      value: 'state'
  }];

  //Will make an ajax call to fill the drop down menu in the filter of the states
  $scope.states = api.states();

  //default criteria that will be sent to the server
  $scope.filterCriteria = {
    pageNumber: 1,
    sortDir: 'asc',
    sortedBy: 'id'
  };

  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
    return api.customers.search($scope.filterCriteria).then(function (data) {
      $scope.customers = data.Customers;
      $scope.totalPages = data.TotalPages;
      $scope.customersCount = data.TotalItems;
    }, function () {
      $scope.customers = [];
      $scope.totalPages = 0;
      $scope.customersCount = 0;
    });
  };

  //called when navigate to another page in the pagination
  $scope.selectPage = function (page) {
    $scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };

  //Will be called when filtering the grid, will reset the page number to one
  $scope.filterResult = function () {
    $scope.filterCriteria.pageNumber = 1;
    $scope.fetchResult().then(function () {
      //The request fires correctly but sometimes the ui doesn't update, that's a fix
      $scope.filterCriteria.pageNumber = 1;
    });
  };

  //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
  $scope.onSort = function (sortedBy, sortDir) {
    $scope.filterCriteria.sortDir = sortDir;
    $scope.filterCriteria.sortedBy = sortedBy;
    $scope.filterCriteria.pageNumber = 1;
    $scope.fetchResult().then(function () {
      //The request fires correctly but sometimes the ui doesn't update, that's a fix
      $scope.filterCriteria.pageNumber = 1;
    });
  };

  //manually select a page to trigger an ajax request to populate the grid on page load
  $scope.selectPage(1);
});
```

# api.js

```javascript
//We are using Restangular here, the code bellow will just make an ajax request to /api/states & /api/customers?{filtercriteria}
angular.module('MyApp')
  .factory('api', function (Restangular) {

    //prepend /api before making any request with restangular
    RestangularProvider.setBaseUrl('/api');
    return {
      states: function () {
        return Restangular.all("states").getList();
      },
      customers: {
        search: function (query) {
          return Restangular.all('customers').getList(query);
        }
      },
    };
  });
```


# The View

```html
<h1>Found ({{customersCount}}) Customers</h1>
<table class="table table-striped">
  <thead>
    <tr>
      <th ng-repeat="header in headers">
        <sort-by onsort="onSort" sortdir="filterCriteria.sortDir" sortedby="filterCriteria.sortedBy" sortvalue="{{ header.value }}">{{ header.title }}</sort-by>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input on-enter-blur on-blur-change="filterResult()" ng-model="filterCriteria.id" type="text" /></td>
      <td><input on-enter-blur on-blur-change="filterResult()" ng-model="filterCriteria.name" type="text" /></td>
      <td><input on-enter-blur on-blur-change="filterResult()" ng-model="filterCriteria.email" type="text" /></td>
      <td><input on-enter-blur on-blur-change="filterResult()" ng-model="filterCriteria.city" type="text" /></td>
      <td>
        <select ng-change="filterResult()" ng-model="filterCriteria.state" ng-options="state for state in states" >
          <option value=""> </option>
        </select>
      </td>
    </tr>
    <tr ng-repeat="customer in customers">
      <td><a href="/#/customer{{customer.id}}">{{customer.id}}</a></td>
      <td>{{customer.name}}</td>
      <td>{{customer.email}}</td>
      <td>{{customer.city}}</td>
      <td>{{customer.state}}</td>
    </tr>
  </tbody>
</table>
<div ng-show="customersCount == 0">
  <h3>No Customers Found</h3>
</div>
<div ng-show="totalPages > 1" class="align-center">
  <pagination num-pages="totalPages" current-page="filterCriteria.pageNumber" max-size="10" class="" boundary-links="true"
 on-select-page="selectPage(page)"></pagination>
</div>
```
