///////////////////////////////////////
//
// Pushpop Interactive Sunburst
//
// Module/Controller
// 

var a = angular.module("pushpopApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getSunburstData: function() {
            var deferred = $q.defer();

            $http.get('pushpop_tree.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading pushpop_tree.json');
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function PushpopController($scope,datafactory) {
    $scope.initialize = function() {
        datafactory.getSunburstData().then(
            function(data) { 
                $scope.sunburstData = data;
            }
        );
        $scope.nslices = 0;
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to PushpopController
var c = a.controller("PushpopController", ["$scope", "datafactory", PushpopController]);

