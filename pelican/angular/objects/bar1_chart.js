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


ng = a.directive('bar1head', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#bar1_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("bar1 Chart Example")
            .appendTo(h1);

        h1.appendTo(dir);


        var p = $("<p />", { 
            "class" : "normal" })
            .html("The following charts show statistics about death records, classified by ICD 10 code. Select an ICD 10 code to view statistics about gender and manner of death.")
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

ng = a.directive('bar1controls', function($compile) {

    function link(scope, element, attr) { 

        // wait to build the buttons until we've loaded the data,
        // since the buttons come from the data.
        scope.$parent.$watch('pickerData',doStuff);

        function doStuff() { 
            if(!scope.$parent.pickerData) { return; }
            buildButtons(element, scope.$parent);
        }


    };

    function buildButtons(element,pscope) {

        var mydiv = "div#bar1_controls";

        var el = $(mydiv);

        var div = $("<div />");



        // ------------------------------------
        // Add ICD 10 code buttons
        //
        var btn_grp = $("<div />", {
                "id" : "codebtns",
                "class" : "btn-group"
            });

        for( var i = 0; i < pscope.pickerData.length; i++ ) {
            var this_code = pscope.pickerData[i]['code']
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


            // then run the button controllers update function
            pscope.updateCode();

        });
    }

});






///////////////////////////////////////////////
// Panels: 
// Display useful information in a pretty box


ng = a.directive('bar1panel', function($compile) {

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
// bar1 chart
// 
// This is a bar chart for manner of death. 

ng = a.directive('bar1chart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('bar1data',doStuff);
        scope.$parent.$watch('icd10code',doStuff);

        function doStuff() { 
            if(!scope.$parent.bar1data) { return; }
            if(!scope.$parent.icd10code) { return; }
            buildBar(element, scope.$parent);
        }


    };

    function buildBar(element,pscope) {
    
        BarChart.defaultConfig.color = function() {};
        BarChart.defaultConfig.w = 400;
        BarChart.defaultConfig.h = 400;

        var chart = BarChart.chartSetup();

        var cfg = chart.config(); // retrieve default config

        var mydiv = "div#bar1_chart";

        var svg = d3.select(mydiv).append('svg')
          .attr('width', cfg.w + cfg.w + 50)
          .attr('height', cfg.h + cfg.h / 4);



        /////////////////////////////////////////////////////
        // update bar chart
        //
        pscope.updatebar1 = function() {

            var all_data = pscope.bar1data;

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
                // set exception handling:
                // if no icd10code is set, problems occur.
                if(all_data[jj]['className'] == pscope.icd10code) {
                    code = all_data[jj]['className'];
                    data = [all_data[jj]]
                    break;
                }
            }

            if(data==null) {
                console.log("Error. Check that ICD 10 code is in data set: "+pscope.icd10code);
                console.log(pscope.icd10code);
                console.log(all_data);
                return;
            }

            console.log(pscope.icd10code);
            console.log(data);

            // finished; use data
            // ---------------------------------


            ///////////////////////////////////
            // now draw the svg with d3
            //
             
            /////////////
            // clean it up
            //svg.selectAll(".single").remove();
            svg.selectAll(".single").remove();
            svg.selectAll(".axis").remove();
            svg.selectAll(".area").remove();

            svg.append('g')
                .classed('single', 1)
                .datum(data)
                .call(chart);

            // chart is the BarChart object
        }

        pscope.$watch('icd10code',pscope.updatebar1);

    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);




