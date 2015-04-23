///////////////////////////////////////
//
// Sunburst of Nested Dimension
//
// Module/Controller
// 

var a = angular.module("nestApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getNestData : function() {
            var deferred = $q.defer();

            $http.get('nest_tree.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading nest_tree.json');
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function NestController($scope,datafactory) {
    $scope.initialize = function() {
        datafactory.getNestData().then(
            function(data) { 
                $scope.nestData = data;
            }
        );
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to NestController
var c = a.controller("NestController", ["$scope", "datafactory", NestController]);
