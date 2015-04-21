var a = angular.module("bigramsApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var bifactory = a.factory('bifactory', function($http, $q) {

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

function Bigram2Controller($scope,bifactory) {
    $scope.initialize = function() {
        bifactory.getBigramData().then(
            function(data) { 
                $scope.bigramData = data;
            }
        );
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to Bigram2Controller
var c = a.controller("Bigram2Controller", ["$scope", "bifactory", Bigram2Controller]);
