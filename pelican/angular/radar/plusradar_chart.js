var ng;
dir = [];

///////////////////////////////////////////////
// plusradar Chart
// 

ng = a.directive('plusradarchart', function($compile) {

    function link(scope, element, attr) {
        console.log('link');

        scope.$parent.$watch('plusradardata',doStuff);

        function doStuff() { 
            if(!scope.$parent.plusradardata) { return; }
            buildplusradar(element, scope.$parent);
        }


    };

    function buildplusradar(element,pscope) {
        console.log('building');

        var mydiv = "div#plusradar_chart";

        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 
        //

        //var el = element[0];
        //$(el).empty();


        /////////////////////////////////////////////////////
        // update radar chart
        //
        pscope.updateplusradar = function() {
            console.log('updating');

            //var all_data = pscope.plusradardata;

            // ----------------------------------
            // Get chart data
            //
            // Here, we have all donut data
            // available to us. 
            //
            // We use the currently-selected ICD 10 code 
            // to filter which donut data is being plotted. 
            //
            // Where to keep track of current code?
            // In the controller (available via pscope).
            // pscope.icd10code
            //

            /*
            var code; 
            var data;
            for( var jj=0; jj < all_data.length; jj++ ) {
                // set excpetion handling:
                // if no icd10code is set, problems occur.
                if(all_data[jj]['className'] == pscope.icd10code) {
                    code = all_data[jj]['className'];
                    data = all_data[jj]
                    break;
                }
            }

            if(data==null) {
                console.log("Error. Check that ICD 10 code is in data set: "+pscope.icd10code);
                console.log(pscope.icd10code);
                console.log(all_data);
                return;
            }
            */

            // finished; use data
            // ---------------------------------


            ///////////////////////////////////
            // now draw the svg with d3
            //
            //

            var data = [
              {"value": 100, "name": "alpha"},
              {"value": 70, "name": "beta"},
              {"value": 40, "name": "gamma"},
              {"value": 15, "name": "delta"},
              {"value": 5, "name": "epsilon"},
              {"value": 1, "name": "zeta"}
            ];
            
            d3plus.viz()
              .container("#viz")
              .data(data)
              .type("pie")
              .id("somethingstupid")
              .size("value")
              .draw()


        }


        // ------------------
        // if you build it, 
        // you must update it.
        pscope.updateplusradar();


    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);

