///////////////////////////////////////
//
// trulia 
//
// Module/Controller
// 

var a = angular.module("truliaapp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var datafactory = a.factory('datafactory', function($http, $q) {

    return {

    }
});

function truliacontroller($scope,datafactory) {

    $scope.initialize = function() {

        //$scope.truliaData = data;

    }

}

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to truliaController
var c = a.controller("truliacontroller", ["$scope", "datafactory", truliacontroller]);
