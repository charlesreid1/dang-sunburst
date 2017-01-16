///////////////////////////////////////
//
// chart
//
// 

var a = angular.module("bar1app", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getbar1data: function() {
            var deferred = $q.defer();

            var json_file = 'bar1.json';

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

function bar1controller($scope,datafactory) {

    $scope.initialize = function() {

        $scope.icd10code="S328";
        $scope.donutFemale = 0;
        $scope.donutMale = 0;

        datafactory.getbar1data().then(
            function(data) { 
                $scope.bar1data = data;
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


    /*
    // This does not change the value of this 
    // variable in everyone's parent scope.
    // UUUUGGGGHHHHH. Stupid code.
    $scope.update_icd10code = function(code) {
        $scope.icd10code = code;
        console.log("from update_icd10code:"+$scope.icd10code);
    }
    */

}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to bar1controller
var c = a.controller("bar1controller", ["$scope", "datafactory", bar1controller]);

