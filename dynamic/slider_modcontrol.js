///////////////////////////////////////
//
// Slider Interactive Sunburst
//
// Module/Controller
// 

var a = angular.module("sliderApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getSunburstData: function() {
            var deferred = $q.defer();

            $http.get('slider_tree.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading slider_tree.json');
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function SliderController($scope,datafactory) {
    $scope.initialize = function() {
        datafactory.getSunburstData().then(
            function(data) { 
                $scope.sunburstData = data;
            }
        );
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to SliderController
var c = a.controller("SliderController", ["$scope", "datafactory", SliderController]);
