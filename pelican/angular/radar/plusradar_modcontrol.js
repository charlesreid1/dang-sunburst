///////////////////////////////////////
//
// plusradar
//
// Module/Controller
// 

var a = angular.module("plusradarApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getplusradardata: function() {
            var deferred = $q.defer();

            var json_file = 'plusradar.json';

            $http.get(json_file).success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading json file: '+json_file);
                deferred.reject();
            });

            return deferred.promise;
        }

    }
});

function plusradarController($scope,datafactory) {

    $scope.initialize = function() {

        //$scope.icd10code="S324";
        //$scope.donutFemale = 0;
        //$scope.donutMale = 0;

        datafactory.getplusradardata().then(
            function(data) { 
                $scope.plusradardata = data;
            }
        );


    }

}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to controller
var c = a.controller("plusradarController", ["$scope", "datafactory", plusradarController]);

