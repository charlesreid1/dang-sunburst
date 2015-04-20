var a = angular.module("lettersApp", [], function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        }
    );

var ldfactory = a.factory('ldfactory', function($http) { 

    var obj = {payload: null};

    $http.get('letter_freq.json').success(function(data) {
        // you can do some processing here
        obj.payload = data;
    });    

    return obj;    
});

function HelloController($scope,ldfactory) {
    $scope.initialize = function() {
        var letterData = ldfactory;

        // wait a second for the csv to load
        setTimeout(function() { 
            console.log(letterData.payload);
        }, 1000);
    };
};

// the first few arguments of the list should correspond to the Angular-namespace stuff to feed to HelloController
var c = a.controller("HelloController", ["$scope", "ldfactory", HelloController]);

