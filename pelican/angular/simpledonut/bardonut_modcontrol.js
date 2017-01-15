///////////////////////////////////////
//
// Picker 
//
// Module/Controller
// 

var a = angular.module("pickerApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {
        getPickerData: function() {
            var deferred = $q.defer();

            var json_file = 'bardonut_allcategories.json';

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

function MainController($scope,datafactory) {

    $scope.initialize = function() {

        $scope.icd10code="S328";

        datafactory.getPickerData().then(
            function(data) { 
                $scope.pickerData = data;
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

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to PickerController
var c = a.controller("mainController", ["$scope", "datafactory", MainController]);

