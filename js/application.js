angular.module('game2048', [])
  .directive('keydownEvents', ['$document', '$rootScope', function($document, $rootScope) {
    return {
      restrict: 'A',
      link: function() {
        $document.on('keydown', function(e) {
          var direction;
          switch (e.which) {
            case 38:
            case 87:
              direction = 'up';
              break;
            case 37:
            case 65:
              direction = 'left';
              break;
            case 40:
            case 83:
              direction = 'down';
              break;
            case 39:
            case 68:
              direction = 'right';
              break;
              
            if (direction) {
              $rootScope.$broadcast('move', direction);
            }
          }
        });
      }
    };
  }])
  .controller('GameController', ["$scope", "$element", function($scope, $element) {
    $scope.data = [
      [0, 2, 4, 8],
      [16, 32, 64, 128],
      [256, 512, 1024, 2048],
      [4096, 8192, 16384, 32768]
    ];
    $scope.$on('move', function(e, direction) {
      console.log(direction);
    });    
  }]);
