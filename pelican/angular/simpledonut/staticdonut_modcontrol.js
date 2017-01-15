///////////////////////////////////////
//
// Static Interactive Sunburst
//
// Module/Controller
// 

var a = angular.module("staticApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getStaticData: function() {
            var deferred = $q.defer();

            $http.get('staticdonut.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading staticdonut.json');
                deferred.reject();
            });

            return deferred.promise;
        },
        getCodeData: function() {
            var deferred = $q.defer();

            $http.get('icd10codes.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading icd10codes.json');
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function StaticController($scope,datafactory) {
    $scope.initialize = function() {
        $scope.icd10code="T401";
        datafactory.getStaticData().then(
            function(data) { 
                $scope.staticData = data;
        });
        datafactory.getCodeData().then(
            function(data) { 
                $scope.icd10codes_all = data;
                var descr = $scope.icd10codes_all[$scope.icd10code];
                $scope.description = descr;
        });
    }
}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to StaticController
var c = a.controller("StaticController", ["$scope", "datafactory", StaticController]);

