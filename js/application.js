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
  .factory('Validator', [function() {
    return {
      countEmptySlot: function(data) {
        var emptySlot = 0;
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            if (data[i][j] === 0) {
              emptySlot++;
            }
          }
        }
        return emptySlot;
      },
      
      checkAvailableMove: function(data) {
        
      }
    }
  }])
  .factory('RandomGenerator', [function() {
    return {
      generateRandomPositions: function(upperLimit, numberOfPositions) {
        if (numberOfPositions > upperLimit || upperLimit <= 0 || numberOfPositions <= 0) {
          throw "Error: data error.";
        }
        
        if (numberOfPositions == 1) {
          return [Math.floor(Math.random() * upperLimit)];
        } else {
          return [3, 4];
        }
      },
      
      generateOneRandomPosition: function(upperLimit) {
        return ;
      },
      
      generateTwoRandomPosition: function(upperLimit) {
        
      },
      
      pickRandomValue: function() {
        return Math.random() * 10 < 9 ? 2 : 4;
      }
    }
  }])
  .factory('Transformer', ['Validator', 'RandomGenerator', function(Validator, RandomGenerator) {
    return {
      fillInSlots: function(data, numberOfSlotsToBeFilledIn) {
        var emptySlot = Validator.countEmptySlot(data);
        
        if (emptySlot >= numberOfSlotsToBeFilledIn) {
          var randomPositions = RandomGenerator.generateRandomPositions(emptySlot, numberOfSlotsToBeFilledIn),
              emptyCounter = 0,
              updatedCounter = 0;
          
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
              if (emptyCounter == randomPositions[updatedCounter]) {
                data[i][j] = RandomGenerator.pickRandomValue();
                updatedCounter++;
                emptyCounter++;
                if (updatedCounter >= numberOfSlotsToBeFilledIn) {
                  break;
                }
              }
              
              if (data[i][j] === 0) {
                emptyCounter++;
              }
            }
            if (updatedCounter >= numberOfSlotsToBeFilledIn) {
              break;
            }
          }
        }
        
        return data;
      },
      
      eliminate: function(data, direction) {
        return data;
      }
    };
  }])
  .controller('GameController', ['$scope', 'Transformer', function($scope, Transformer) {
    $scope.data = Transformer.fillInSlots([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 1);
    $scope.$on('move', function(e, direction) {
      console.log(direction);
    });    
  }]);
