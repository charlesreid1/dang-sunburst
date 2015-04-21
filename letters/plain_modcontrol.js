var a = angular.module("lettersApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var ldfactory = a.factory('ldfactory', function($http, $q) {

    return {
        getLetterData : function() {
            var deferred = $q.defer();

            $http.get('letter_freq.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function HelloController($scope,ldfactory) {
    $scope.initialize = function() {
        ldfactory.getLetterData().then(
            function(data) { 
                // convert one dictionary to many
                var rat = [];
                Object.keys(data).forEach(function(d){
                    var o = {};
                    o['letter'] = d;
                    o['frequency'] = data[d];
                    rat.push(o);
                });
                
                $scope.letterData = rat;
            }
        );
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to HelloController
var c = a.controller("HelloController", ["$scope", "ldfactory", HelloController]);
