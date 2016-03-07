angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $ionicListDelegate, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');
    
  $scope.favorites = $localStorage.getObject('favorites','{}');
    
  $reservationData = {};
  $commentData = {};  

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
  }).then(function(modal){
      $scope.reserveform = modal;
  });
    
  $scope.reserve = function() {
    $scope.reserveform.show(); 
  };

  $scope.closeReserve = function () {
      $scope.reserveform.hide();
  };
  
  $scope.doReserve = function() {
    console.log('Doing reserve', $scope.reservationData);
    // Simulate a reservation delay. 
    $timeout(function() {
      $scope.closeReserve();
    }, 1000); 
  };
  

})

.controller('MenuController', ['$scope', 'dishes','favoriteFactory', 'baseURL', '$ionicListDelegate', '$localStorage',
   function($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $localStorage ) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.favorites = favoriteFactory.getFavorites();
    
    $scope.message = "Loading ...";
    $scope.dishes = dishes;

    $scope.select = function(setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
            $scope.filtText = "mains";
        }
        else if (setTab === 4) {
            $scope.filtText = "dessert";
        }
        else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };
       
    $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        
        $ionicListDelegate.closeOptionButtons();
    }

}])

    .controller('ContactController', ['$scope', function($scope) {

        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

        $scope.sendFeedback = function() {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                feedbackFactory.save($scope.feedback);
                $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                $scope.feedback.mychannel="";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'dish','menuFactory', 'favoriteFactory','baseURL', '$ionicModal','$ionicPopover', '$timeout',             
                                    function($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicModal, $ionicPopover, $timeout) {
            $scope.baseURL = baseURL;
            $scope.dish = {};
            
            $scope.dish = dish;
                                        
            $scope.addFavorite = function(){
                console.log('adding to favorites '+$scope.dish.id);
                favoriteFactory.addToFavorites($scope.dish.id);
                $scope.closePopover();
            };
                                        
             $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
                scope: $scope
              }).then(function(popover) {
                $scope.popover = popover;
              });


              $scope.openPopover = function($event) {
                $scope.popover.show($event);
              };
              $scope.closePopover = function() {
                $scope.popover.hide();
              };
              //Cleanup the popover when we're done with it!
              $scope.$on('$destroy', function() {
                $scope.popover.remove();
              });
              // Execute action on hide popover
              $scope.$on('popover.hidden', function() {
                // Execute action
              });
              // Execute action on remove popover
              $scope.$on('popover.removed', function() {
                // Execute action
              });

            
            $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
                  scope: $scope
              }).then(function(modal){
                  $scope.commentform = modal;
              });

              $scope.showFormComment = function() {
                $scope.commentform.show(); 
              };

              $scope.closeFormComment = function () {
                  $scope.commentform.hide();
              };

              $scope.doComment = function() {
                console.log('Doing comment');
                $scope.submitComment();
                 
              };

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);
                menuFactory.update({id:$scope.dish.id},$scope.dish);
                
   //             $scope.commentForm.$setPristine();
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
                // Simulate a reservation delay.
                $timeout(function() { 
                $scope.closeFormComment();
                $scope.closePopover();
                        }, 500);
            };
                
                                        
        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                $scope.dish.comments.push($scope.mycomment);
        menuFactory.update({id:$scope.dish.id},$scope.dish);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            }
        }])


        .controller('IndexController', ['$scope', 'dish', 'leader', 'promotion', 'baseURL', function($scope, dish, leader, promotion , baseURL) {
                        
                        $scope.baseURL =baseURL;                
                        $scope.leader = leader;
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = dish;
                        $scope.promotion = promotion;
            
                    }])

        .controller('AboutController', ['$scope', 'leaders', 'baseURL',
        function($scope, leaders, baseURL) {
                    $scope.baseURL = baseURL;
                    $scope.leaders = leaders;
                    console.log($scope.leaders);
            
                    }])

        .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory','baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout',
                                            function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

            $scope.baseURL = baseURL;
            $scope.shouldShowDelete = false;
                                                
            $scope.favorites = favorites;

            $scope.dishes = dishes;

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            }

            $scope.deleteFavorite = function (index) {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this item?'
                });
                confirmPopup.then(function(res){
                    if (res) {
                        console.log('Ok to delete');
                        favoriteFactory.deleteFromFavorites(index);
                    }
                    else {
                        console.log('Canceled delete');
                    }
                });
                
                $scope.shouldShowDelete = false;
            }
        }])

        .filter('favoriteFilter', function () {
            return function (dishes, favorites) {
                var out = [];
                console.log('Favorites total: '+favorites.length);
                for (var i = 0; i < favorites.length; i++) {
                    console.log(favorites[i]);
                    for (var j = 0; j < dishes.length; j++) {
                        if (dishes[j].id === favorites[i].id){
                            out.push(dishes[j]);
                            console.log(dishes[j]);
                        }
                    }
                }
                return out;

            }});



