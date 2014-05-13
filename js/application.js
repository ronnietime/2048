angular.module('game2048', [])
  .directive('keydownEvents', ['$document', '$rootScope', function($document, $rootScope) {
    return {
      restrict: 'A',
      link: function() {
        $document.on('keydown', function(e) {
          console.log('Key down: ' + e.which);
          switch (e.which) {
            case 38:
            case 87:
              $rootScope.$broadcast('moveUp');
              break;
            case 37:
            case 65:
              $rootScope.$broadcast('moveLeft');
              break;
            case 40:
            case 83:
              $rootScope.$broadcast('moveDown');
              break;
            case 39:
            case 68:
              $rootScope.$broadcast('moveRight');
              break;
          }
        });
      }
    };
  }])
  .controller('GameController', ["$scope", "$element", function($scope, $element) {
    $scope.$on('moveUp', function() {
      console.log('move up');
    });
    
    $scope.$on('moveLeft', function() {
      console.log('move left');
    });
    
    $scope.$on('moveDown', function() {
      console.log('move down');
    });
    
    $scope.$on('moveRight', function() {
      console.log('move right');
    });
    
  }]);
