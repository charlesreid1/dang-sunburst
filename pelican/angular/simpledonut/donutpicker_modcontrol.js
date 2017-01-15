///////////////////////////////////////
//
// Picker Interactive Sunburst
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

            $http.get('donutpicker.json').success(function(data) {
                deferred.resolve(data);
            }).error(function(){
                console.log('error loading donutpicker.json');
                deferred.reject();
            });

            return deferred.promise;
        }
    }
});

function MainController($scope,datafactory) {

    $scope.initialize = function() {

        // safe first choice.
        $scope.icd10code = "T510";

        datafactory.getPickerData().then(
            function(data) { 
                $scope.pickerData = data;
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

