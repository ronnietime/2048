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
        var emptySlot = 0,
            i, j;
        for (i = 0; i < data.length; i++) {
          for (j = 0; j < data[i].length; j++) {
            if (data[i][j] === 0) {
              emptySlot++;
            }
          }
        }
        return emptySlot;
      },
      
      checkAvailableMove: function(data) {
        var moveAvailable = false,
            i,
            j,
            marker;
        
        // If there is any empty slot or horizontally adjacent slots with same value, there is possible moving. 
        for (i = 0; i < data.length; i++) {
          marker = data[i][0];
          for (j = 0; j < data[i].length; j++) {
            if (data[i][j] === 0) {
              moveAvailable = true;
            } else {
              if (j > 0) {
                if (data[i][j] === marker) {
                  moveAvailable = true;
                } else {
                  marker = data[i][j];
                }
              }
            }
            
            if (moveAvailable) {
              break;
            }
          }
          if (moveAvailable) {
            break;
          }
        }
        
        if (!moveAvailable) {
          // If there is vertically adjacent slots with same value, there is possible moving.
          for (j = 0; j < data[0].length; j++) {
            marker = data[0][j];
            for (i = 1; i < data.length; i++) {
              if (data[i][j] === marker) {
                moveAvailable = true;
                break;
              } else {
                marker = data[i][j];
              }
            }
            if (moveAvailable) {
              break;
            }
          }
        }
        
        return moveAvailable;
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
          var baseArray = [], 
              i,
              randomNumber,
              temp;
          
          // Fisher–Yates shuffle
          for (i = 0; i < upperLimit; i++) {
            baseArray[i] = i;
          }
          
          for (i = upperLimit - 1; i >= 1; i--) {
            randomNumber = Math.floor(Math.random() * (i + 1));
            temp = baseArray[i];
            baseArray[i] = baseArray[randomNumber];
            baseArray[randomNumber] = temp;
          }
          
          return baseArray.slice(0, numberOfPositions).sort(function(a, b) {return a - b});
        }
      },
      
      pickRandomValue: function() {
        return Math.random() * 10 < 9 ? 2 : 4;
      }
    }
  }])
  .factory('Transformer', ['Validator', 'RandomGenerator', function(Validator, RandomGenerator) {
    function move(data, direction) {
      var rowCount = data.length,
          columnCount = data[0].length,
          moved = false,
          i, j, k;

      switch (direction) {
        case 'up':
          for (j = 0; j < columnCount; j++) {
            for (i = 0; i < rowCount; i++) {
              if (data[i][j] == 0) {
                for (k = i + 1; k < rowCount; k++) {
                  if (data[k][j] != 0) {
                    data[i][j] = data[k][j];
                    data[k][j] = 0;
                    moved = true;
                    break;
                  }
                }
              }
            }
          }
          break;
        case 'down':
          for (j = 0; j < columnCount; j++) {
            for (i = rowCount - 1; i >= 0; i--) {
              if (data[i][j] == 0) {
                for (k = i - 1; k >= 0; k--) {
                  if (data[k][j] != 0) {
                    data[i][j] = data[k][j];
                    data[k][j] = 0;
                    moved = true;
                    break;
                  }
                }
              }
            }
          }
          break;
        case 'left':
          for (i = 0; i < rowCount; i++) {
            for (j = 0; j < columnCount; j++) {
              if (data[i][j] == 0) {
                for (k = j + 1; k < columnCount; k++) {
                  if (data[i][k] != 0) {
                    data[i][j] = data[i][k];
                    data[i][k] = 0;
                    moved = true;
                    break;
                  }
                }
              }
            }
          }
          break;
        case 'right':
          for (i = 0; i < rowCount; i++) {
            for (j = columnCount - 1; j >= 0; j--) {
              if (data[i][j] == 0) {
                for (k = j - 1; k >= 0; k--) {
                  if (data[i][k] != 0) {
                    data[i][j] = data[i][k];
                    data[i][k] = 0;
                    moved = true;
                    break;
                  }
                }
              }
            }
          }
          break;
      }

      return {data: data, moved: moved};

    }

    function merge(data, direction) {
      var rowCount = data.length,
          columnCount = data[0].length,
          merged = false,
          i, j, k;

      switch (direction) {
        case 'up':
          for (j = 0; j < columnCount; j++) {
            for (i = 0; i < rowCount - 1; i++) {
              if (data[i][j] == data[i + 1][j] && data[i][j] != 0) {
                data[i][j] = data[i][j] * 2;
                data[i + 1][j] = 0;
                merged = true;
              }
            }
          }
          break;
        case 'down':
          for (j = 0; j < columnCount; j++) {
            for (i = rowCount - 1; i >= 1; i--) {
              if (data[i][j] == data[i - 1][j] && data[i][j] != 0) {
                data[i][j] = data[i][j] * 2;
                data[i - 1][j] = 0;
                merged = true;
              }
            }
          }
          break;
        case 'left':
          for (i = 0; i < rowCount; i++) {
            for (j = 0; j < columnCount - 1; j++) {
              if (data[i][j] == data[i][j + 1] && data[i][j] != 0) {
                data[i][j] = data[i][j] * 2;
                data[i][j + 1] = 0;
                merged = true;
              }
            }
          }
          break;
        case 'right':
          for (i = 0; i < rowCount; i++) {
            for (j = columnCount - 1; j >= 1; j--) {
              if (data[i][j] == data[i][j - 1] && data[i][j] != 0) {
                data[i][j] = data[i][j] * 2;
                data[i][j - 1] = 0;
                merged = true;
              }
            }
          }
          break;
      }      

      return {data: data, merged: merged};
    }

    return {
      fillInSlots: function(data, numberOfSlotsToBeFilledIn) {
        var emptySlot = Validator.countEmptySlot(data);
        
        if (emptySlot >= numberOfSlotsToBeFilledIn) {
          var randomPositions = RandomGenerator.generateRandomPositions(emptySlot, numberOfSlotsToBeFilledIn),
              emptyCounter = 0,
              updatedCounter = 0;
          
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
              if (data[i][j] === 0) {
                if (emptyCounter == randomPositions[updatedCounter]) {
                  data[i][j] = RandomGenerator.pickRandomValue();
                  updatedCounter++;
                  emptyCounter++;
                  if (updatedCounter >= numberOfSlotsToBeFilledIn) {
                    break;
                  }
                }

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
        console.log(Validator.checkAvailableMove(data));
        if (Validator.checkAvailableMove(data)) {
          var movedResult1 = move(data, direction),
              moved1 = movedResult1.moved,
              movedData1 = movedResult1.data,
              mergedResult = merge(movedData1, direction),
              merged = mergedResult.merged,
              mergedData = mergedResult.data,
              movedResult2 = move(mergedData, direction),
              moved2 = movedResult2.moved,
              movedData2 = movedResult2.data;

          return {data: movedData2, changed: moved1 || merged || moved2}
        } else {
          alert("No more possible movement!");
          return {data: data, changed: false};
        }
      }
    };
  }])
  .controller('GameController', ['$scope', 'Transformer', function($scope, Transformer) {
    $scope.data = Transformer.fillInSlots([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], 2);
    $scope.$on('move', function(e, direction) {
      console.log("data: " + $scope.data);
      var eliminatedResult = Transformer.eliminate($scope.data, direction),
          data = eliminatedResult.data,
          changed = eliminatedResult.changed;
      console.log("data: " + data + ". changed: " + changed + ". direction: " + direction);
      if (changed) {
        data = Transformer.fillInSlots(data, 1);
        console.log("after data: " + data);
      }
      $scope.data = data;
      $scope.$apply($scope.data);

    });
  }]);
