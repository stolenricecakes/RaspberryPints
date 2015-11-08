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

    $http({method:'GET',url:'tapService.php'})
     .then(function(response) {
        $scope.tapList = response.data; 
     });
  }]);

  app.controller("EditController", ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {
    var beerId = $routeParams.id;
    $scope.srmAry = [];
    $scope.beer = {name:'dumpsville'};
    $scope.lookup = function(x) {
      for (i = 0; i < $scope.srmAry.length; i++) {
        obj = $scope.srmAry[i];
        if (obj.srm === x) {
           return obj.rgb;
        }
      }
    }

    $scope.srmForeground = function(x) {
        if (x < 15) {
           return "black";
        }      
        else {
           return "white";
        }
    }

    // snag that beer ID and populate the form?
    $http({method:'GET', url:'beerService.php?id=' + beerId})
      .then(function(response) {
      $scope.beer = response.data; 
      $scope.beer.lookup = $scope.lookup;
    }); 

    $http({method:'GET', url:'srmService.php'})
    .then(function(response) {
      $scope.srmAry = response.data; 
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

    $scope.message = "Add to tap " + $scope.tapNum;
    $scope.submessage = "";
    $scope.getColor = function(beer) {
      if (beer.tapNum === "X") {
        return "rgb(" + beer.srmRgb + ")";
      }
      else {
         return "rgb(" + simpleColor(beer.srmRgb) + ")";
      }
    }

    function findOpposite(rgbstr) {
      var rgbArr = rgbstr.split(",");
      var var_r = rgbArr[0] / 255.0;
      var var_g = rgbArr[1] / 255.0;
      var var_b = rgbArr[2] / 255.0;

      var min = Math.min(var_r,var_g,var_b);
      var max = Math.max(var_r,var_g,var_b);
      var del_max = max - min;

      var h = 0;
      var s = 0;
      var l = (max + min) / 2;

      if (del_max != 0) {
        if (l < 0.5) {
           s = del_max / (max + min);
        }
        else {
           s = del_max / (2 - max - min);
        }

        var del_r = (((max - var_r) / 6) + (del_max / 2)) / del_max;
        var del_g = (((max - var_g) / 6) + (del_max / 2)) / del_max;
        var del_b = (((max - var_b) / 6) + (del_max / 2)) / del_max;

        if (var_r == max) {
           h = del_b - del_g;
        }
        else if (var_g == max) {
           h = (1 / 3) + del_r - del_b;
        }
        else if (var_b == max) {
           h = (2 / 3) + del_g - del_r;
        }

        if (h < 0) {
          h += 1;
        }

        if (h > 1) {
          h -= 1;
        }
    }
    //return [h,s,l]; 

    // h,s,l determined... now determine opposite
    var h_bonus = h + 0.5;
    if (h_bonus > 1) {
       h_bonus -= 1;
    }

    // now calc the r,g,b
    var r;  
    var g;
    var b;
    if (s == 0) {
      r = l * 255; 
      g = l * 255; 
      b = l * 255; 
    }
    else {
       var fart;
       var dart;
       if (l < 0.5) {
         fart = l * (1 + s);
       }
       else {
         fart = (l + s) - (s * l);
       }
       dart = 2 * l - fart;
       r = 255 * hue_2_rgb(dart,fart,h_bonus + (1/3));
       g = 255 * hue_2_rgb(dart,fart,h_bonus);
       b = 255 * hue_2_rgb(dart,fart,h_bonus - (1/3));
    }
    return parseInt(r) + "," + parseInt(g) + "," + parseInt(b);
  }

  function hue_2_rgb(v1,v2,vh) {
    if (vh < 0) {
      vh += 1;
    }

    if (vh > 1) {
      vh -= 1;
    }

    if ((6 * vh) < 1) {
      return (v1 + (v2 - v1) * 6 * vh);
    }

    if ((2 * vh) < 1) {
      return (v2);
    }

    if ((3 * vh) < 2) {
      return (v1 + (v2 - v1) * ((2 / 3 - vh) * 6));
    }

    return (v1);
  }
 
  function simpleColor(rgbstr) {
     var d = 0;

     var rgbary = rgbstr.split(",");
     var rgb = { r : rgbary[0], g : rgbary[1], b : rgbary[2]};
     // Counting the perceptive luminance - human eye favors green color... 
     var a = 1 - ( 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)/255;

     if (a < 0.25) {
       d = 0; // bright colors - black font
     }
     else if (a < .50) {
       d = 80; //
     }
     else if (a < .75) {
       d = 170; //
     }
     else {
       d = 255; // dark colors - white font
     }

    return d + "," + d + "," + d;
  }
    

    $http({method:'GET', url:'beerService.php'})
      .then(function(response) {
      $scope.beerList = response.data; 
      for (i = 0; i < $scope.beerList.length; i++) {
        beer = $scope.beerList[i];
        if (beer.tapNum === $scope.tapNum) {
          beer.activeTapClass='alert alert-warning';
          $scope.message = "switch out tap " + $scope.tapNum;
          $scope.submessage = beer.name;
        }
        else if (beer.tapNum) {
          beer.activeTapClass='alert alert-info';
        }
        else {
          beer.tapNum = "X";
        }
      }
    }); 
    
    $scope.associate = function(beer) {
       $http({method:'GET', url:'tapPersist.php', params: { tapNumber: $scope.tapNum, beerId: beer.id}} )
       .then(function(response) {
          // redirect to another controller?
          window.location.href = '/bonus';        
       });
    } 

    $scope.kickIt = function(beer) {
       $http({method:'GET', url:'tapPersist.php', data: { tapNum: $scope.tapNum} })
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
