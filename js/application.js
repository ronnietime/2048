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
          }
          if (direction) {
            $rootScope.$broadcast('move', direction);
          }
        });
      }
    };
  }])
  .factory('Transformer', [function(){
    return {
      generateRandom: function(data, numberOfEmptySlot) {
        return data;
      },
      
      eliminate: function(data, direction) {
        return data;
      }
    };
  }])
  .controller('GameController', ["$scope", 'Transformer', function($scope, Transformer) {
    $scope.data = Transformer.generateRandom(
            Transformer.generateRandom([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 16), 15);
    $scope.$on('move', function(e, direction) {
      console.log(direction);
    });    
  }]);
