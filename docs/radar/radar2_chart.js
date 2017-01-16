var ng;
dir = [];




//////////////////////////////////////
// Chart Directives
//
// This file defines Angular directives 
// that use D3 to draw charts.
// 





///////////////////////////////////////
// Header Directives:
//
// Print out instructions, title, etc.


ng = a.directive('radar2head', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#radar2_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Radar Chart Example")
            .appendTo(h1);

        h1.appendTo(dir);


        var p = $("<p />", { 
            "class" : "normal" })
            .html("A fancy little radar chart.")
            .appendTo(dir);
        

    }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);






///////////////////////////////////////////////
// Chart Controls Directives

ng = a.directive('radar2controls', function($compile) {

    function link(scope, element, attr) { 

        // wait to build the buttons until we've loaded the data,
        // since the buttons come from the data.
        scope.$parent.$watch('radar2data',doStuff);

        function doStuff() { 
            if(!scope.$parent.radar2data) { return; }
            buildButtons(element, scope.$parent);
        }


    };

    function buildButtons(element,pscope) {

        var mydiv = "div#radar2_controls";

        var el = $(mydiv);

        var div = $("<div />");


        // ------------------------------------
        // Add ICD 10 code buttons
        //
        var btn_grp = $("<div />", {
                "id" : "codebtns",
                "class" : "btn-group"
            });

        for( var i = 0; i < pscope.radar2data.length; i++ ) {
            var this_code = pscope.radar2data[i]['className']
            var code = $("<a />", {
                            "class" : "btn btn-code btn-large btn-primary",
                            "changecode" : "",
                            "id" : "btn_"+this_code,
                            "code" : this_code,
                        })
                        .html( this_code )
                        .appendTo(btn_grp);
        }


        // to make buttons in this btn group active, 
        // you have to use D3's classed() method 
        // after you add the elements to the document
        // (i.e., after you call $compile)

        angular.element(el).append($compile(btn_grp)(pscope));


        pscope.updateCode = function() {

            // -----------------------------
            // make button for active icd 10 code

            d3.selectAll("a.btn-code").classed('active',false);
            var btnlabel = "a#btn_"+pscope.icd10code;
            d3.selectAll(btnlabel).classed('active',true);

        };

        pscope.$watch('icd10code',pscope.updateCode);


    }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);


//////////////////////////////////
// Action directive:
// What to do when the user changes the ICD 10 code
// by clicking an ICD 10 code button

ng = a.directive("changecode", function($compile) {

    return function(pscope, element, attrs){
        element.bind("click", function(){

            // first, update the scope variable 
            // that holds the current icd 10 code
            // (no need to load any new data)


            // This is the ICD 10 code the user has selected.
            var this_code = attrs['code'];
            var this_description = pscope.icd10codes_all[this_code]

            //console.log('Changed icd 10 code, updating description:');
            //console.log(this_code);
            //console.log(this_description);


            // !!!!!!!!!!!!!!!!!!!!!!!!
            // NOTE
            // The lines below - this $apply() method - 
            // this is the way you change the variable
            // at the controller level, and get the 
            // various watchers to detect changes.
            // !!!!!!!!!!!!!!!!!!!!!!!!!!
            pscope.$apply(function() {
                pscope.icd10code = this_code; 
            });

            pscope.$apply(function() {
                pscope.description = this_description;
            });


            //// This is some weak-sauce, 
            //// its not even changing value of variable
            //pscope.update_icd10code(attrs['code']);
            //// ...
            //// .......
            //// seriously.
            //// all we needed was just
            ////   pscope.$apply()
            //// 
            //// smh.




            //// then run the donut chart update function
            //pscope.updateradar2();

            // then run the button controllers update function
            pscope.updateCode();

        });
    }

});






///////////////////////////////////////////////
// Panels: 
// Display useful information in a pretty box


ng = a.directive('radar2panel', function($compile) {


    function link(scope, element, attr) {



        var el = element[0];

        var pscope = scope.$parent;

        // --------------------------
        // add display for details 
        
        // assemble the tags, 
        // then compile the html
        // select element of interest with angular.element
        // and append the compiled tags
        //
        var br = $("<br />").appendTo(el);

        var panel = $("<div />", {
                "class" : "panel panel-primary",
                "id" : "first"
            });

        var panelhead = $("<div />", {
                "class" : "panel-heading"
            }).appendTo(panel);
        
        var h3 = $("<h3 />", {
                "class" : "panel-title"
            }).text("Current ICD 10 Code")
            .appendTo(panelhead);



        var panelbody = $("<div />", {
                "class" : "panel-body"
            }).appendTo(panel);

        var maindiv = $("<div />", {
            }).appendTo(panelbody);

        var h = $("<h3 />")
            .html("ICD 10 Code: [[icd10code]]")
            .appendTo(maindiv);

        var de = $("<p />", { 
            "class" : "lead" })
            .html("Description: [[description]]")
            .appendTo(maindiv);

        angular.element(el).prepend($compile(panel)(pscope));

    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);






///////////////////////////////////////////////
// radar2 Chart
// 
// This is the actual donut chart, of gender ratios.

ng = a.directive('radar2chart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('radar2data',doStuff);

        function doStuff() { 
            if(!scope.$parent.radar2data) { return; }
            buildradar2(element, scope.$parent);
        }


    };

    function buildradar2(element,pscope) {

        var mydiv = "div#radar2_chart";

        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 
        //



        var el = element[0];
        $(el).empty();



        /////////////////////////////////////////////////////
        // update radar chart
        //
        pscope.updateradar2 = function() {

            var all_data = pscope.radar2data;

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

            // finished; use data
            // ---------------------------------


            ///////////////////////////////////
            // now draw the svg with d3
            //

            d3.select(mydiv).selectAll(".uv-chart-div").remove();

            var graphdef = {
                categories : ['mycode'], 
                dataset : {
                    // This is the most idiotic implementation ever.
                    // The key, above, is a string. Great. We have string variables.
                    // But the key below *cannot* be a string.
                    // Really??? What genius came up with this one?
                    mycode : [
                        { name : '2009', value : 55+Math.random() },
                        { name : '2010', value : 61+Math.random() },
                        { name : '2011', value : 93+Math.random() },
                        { name : '2012', value : 96+Math.random() },
                        { name : '2013', value : 120+Math.random() }
                    ]
                }
            }
            var chart = uv.chart('Bar', graphdef, {
                effects : {duration : 3.0},
                meta : { position : '#radar2_chart' },
                legend : { showlegends : false }
            });

        }

        pscope.$watch('icd10code',pscope.updateradar2);


    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);


