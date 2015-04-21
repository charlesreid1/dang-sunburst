///////////////////////////////////////
//
// Sunburst of Orthogonal Dimension
//
// Module/Controller
// 

var a = angular.module("orthogonalApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getBigramData : function() {
            var deferred = $q.defer();

            $http.get('bigrams.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading bigrams.json');
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function OrthogonalController($scope,datafactory) {
    $scope.initialize = function() {
        datafactory.getBigramData().then(
            function(data) { 
                $scope.bigramData = data;
            }
        );
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to OrthogonalController
var c = a.controller("OrthogonalController", ["$scope", "datafactory", OrthogonalController]);

