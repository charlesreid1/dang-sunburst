///////////////////////////////////////
//
// radar1
//
// Module/Controller
// 

var a = angular.module("radar1App", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getradar1data: function() {
            var deferred = $q.defer();

            var json_file = 'radar_mon.json';

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

function radar1Controller($scope,datafactory) {

    $scope.initialize = function() {

        $scope.icd10code="S324";
        $scope.donutFemale = 0;
        $scope.donutMale = 0;

        datafactory.getradar1data().then(
            function(data) { 
                $scope.radar1data = data;
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
var c = a.controller("radar1Controller", ["$scope", "datafactory", radar1Controller]);
