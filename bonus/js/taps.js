(function() {
  var app = angular.module('taps',['ngRoute']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
     .when('/edit/:id', {
       templateUrl: 'edit.html',
       controller: 'EditController'
     })
     .when('/add/:tapNum', {
       templateUrl: 'add.html',
       controller: 'AddController' 
     })
     .otherwise({
       templateUrl: 'taplist.html',
       controller: 'TapsController'
     });
  }]);

  app.controller("TapsController", ['$scope','$http', function($scope,$http) {
    $scope.tapList = data;

    $http({method:'GET',url:'http://pi1/bonus/tapService.php'})
     .then(function(response) {
        $scope.tapList = response.data; 
     });
  }]);

  app.controller("EditController", ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    var beerId = $routeParams.id;
    $scope.beer = {name:'dumpsville'};

    // snag that beer ID and populate the form?
    $http({method:'GET', url:'http://pi1/bonus/beerService.php?id=' + beerId})
      .then(function(response) {
      $scope.beer = response.data; 
    }); 

    $scope.save = function(beer) {
       // for some reason the $http angular service is retarded when it comes to posts.   you can override
       // its behavior to make it act reasonable instead of expecting the backend to parse a json blob
       // but, why not just use jQuery? 
       var params = jQuery.param(beer);
       jQuery.post('tapEdit.php', params, function(result) {
          window.location.href = '/bonus';        
       }); 
    } 
  }]);

  app.controller("AddController", ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    $scope.beerList = [];
    $scope.tapNum = $routeParams.tapNum;

    $http({method:'GET', url:'http://pi1/bonus/beerService.php'})
      .then(function(response) {
      $scope.beerList = response.data; 
      for (i = 0; i < $scope.beerList.length; i++) {
        beer = $scope.beerList[i];
        if (beer.tapNum === $scope.tapNum) {
          beer.activeTapClass='alert alert-warning';
        }
        else if (beer.tapNum) {
          beer.activeTapClass='alert alert-info';
        }
      }
    }); 
    
    $scope.associate = function(beer) {
       $http({method:'GET', url:'http://pi1/bonus/tapPersist.php', params: { tapNumber: $scope.tapNum, beerId: beer.id}} )
       .then(function(response) {
          // redirect to another controller?
          window.location.href = '/bonus';        
       });
    } 

    $scope.kickIt = function(beer) {
       $http({method:'GET', url:'http://pi1/bonus/tapPersist.php', data: { tapNum: $scope.tapNum} })
       .then(function(response) {
          // redirect to another controller?
          window.location.href = '/bonus';        
       });
    }

    $scope.toggleDetails = function(beer) {
      if (beer.visibleDetails) {
         beer.visibleDetails = '';
      } 
      else {
         beer.visibleDetails = beer.notes;
      }
    }
  }]);

  var data = [
     {"tapNum": 1, "beer": {"name":"haughty jerkface","ibu":40.5,"abv":6.7,"srm":2.5,"notes":"this is good","og": 1.066, "fg": 1.010}},
     {"tapNum": 2, "beer": {}},
     {"tapNum": 3, "beer": {}},
     {"tapNum": 4, "beer": {}},
     {"tapNum": 5, "beer": {}},
     {"tapNum": 6, "beer": {}},
     {"tapNum": 7, "beer": {}},
     {"tapNum": 8, "beer": {}}
  ];
})();
