'use strict';

angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL","http://localhost:3000/")
        .factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
            return $resource(baseURL + "dishes/:id", null, {
                'update': {
                    method: 'PUT'
                }
            });
 
        }])

        .factory('$localStorage', ['$window', function($window) {
          return {
            store: function(key, value) {
              $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
              return $window.localStorage[key] || defaultValue;
            },
            storeObject: function(key, value) {
              $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key,defaultValue) {
              return JSON.parse($window.localStorage[key] || defaultValue);
            }
          }
        }])


        .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            return $resource(baseURL + "promotions/:id");

        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"leadership/:id");
            
    
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"feedback/:id");
    
        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage', function ($resource, baseURL, $localStorage) {
 //           var favorites = $localStorage.getObject('favorites','{}');

//            var favorites = $localStorage.get('favorites',[]);
            var favArr = $localStorage.get('favorites',[]);
//        .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            var favFac = {};
//            var favorites = [];

            favFac.addToFavorites = function (index) {
                for (var i = 0; i < favArr.length; i++) {
                    if (favArr[i].id == index)
                        return;
                }
                favArr.push({id: index});
//                $localStorage.store('favorites', '{id: '+index+'}');
                $localStorage.storeObject('favorites', favArr);
            };
            
            favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favArr.length; i++) {
                    if (favArr[i].id == index) {
                        favArr.splice(i, 1);
                        $localStorage.storeObject('favorites', favArr);
                    }
                }
            }

            favFac.getFavorites = function () {
                return favArr;
            };

//            return favorites;
              return favFac;
        }])

;
