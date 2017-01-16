///////////////////////////////////////
//
// bubbles
//
// Module/Controller
// 

var a = angular.module("bubblesApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getbubblesdata: function() {
            var deferred = $q.defer();

            var json_file = 'bubbles.json';

            $http.get(json_file).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading json file: '+json_file);
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

function bubblesController($scope,datafactory) {

    $scope.initialize = function() {

        $scope.icd10code="S324";
        $scope.donutFemale = 0;
        $scope.donutMale = 0;

        datafactory.getbubblesdata().then(
            function(data) { 
                $scope.bubblesdata = data;
            }
        );

        datafactory.getCodeData().then(
            function(data) { 
                $scope.icd10codes_all = data;
                var descr = $scope.icd10codes_all[$scope.icd10code];
                $scope.description = descr;
            }
        );


    }

}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to controller
var c = a.controller("bubblesController", ["$scope", "datafactory", bubblesController]);

