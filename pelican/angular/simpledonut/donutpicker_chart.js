var ng;
dir = [];




//////////////////////////////////////
// Chart Directives
//
// This file defines Angular directives 
// that use D3 to draw charts.
// 

ng = a.directive('donutPickerHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#donut_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Donut Picker Chart Example")
            .appendTo(h1);

        h1.appendTo(dir);
        

    }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);






///////////////////////////////////////////////
// Chart Controls

ng = a.directive('donutPickerControls', function($compile) {

    function link(scope, element, attr) { 

        var mydiv = "div#donut_controls";

        pscope = scope.$parent;

        var el = $(mydiv);

        var div = $("<div />");

        // ------------------------------------
        // Add ICD 10 code picker
        var btn_grp = $("<div />", {
                "id" : "codebtns",
                "class" : "btn-group"
            });

        var code1 = $("<a />", {
                "class" : "btn btn-code btn-large btn-primary",
                "changecode" : "",
                "id" : "btn_T510",
                "code" : "T510"
            })
            .html("T510")
            .appendTo(btn_grp);

        var code2 = $("<a />", {
                "class" : "btn btn-code btn-large btn-primary",
                "changecode" : "",
                "id" : "btn_Y14",
                "code" : "Y14"
            })
            .html("Y14")
            .appendTo(btn_grp);

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
            pscope.update_icd10code(attrs['code']);

            // then run the donut chart update function
            updateChart();

            // then run the button controllers update function
            pscope.updateCode();

        });
    }

});






///////////////////////////////////////////////
// Panels


ng = a.directive('donutPickerPanels', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        var pscope = scope.$parent;


        // --------------------------
        // add display for details 
        // about current mouseover selection
        
        // assemble the tags, 
        // then compile the html
        // select element of interest with angular.element
        // and append the compiled tags
        //
        var br = $("<br />").appendTo(el);

        var panel = $("<div />", {
                "class" : "panel panel-primary",
                "id" : "mouseoverPointPanel"
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
            .html("ICD 10 Code: T401")//[[mouseoverPoint.name]]")
            .appendTo(maindiv);

        /*
        var p = $("<p />", {
                "class" : "lead"
            })
            .html("Value: [[mouseoverPoint.magnitude | number:0]]")
            .appendTo(maindiv);
        */

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
// Chart

ng = a.directive('donutPickerChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('pickerData',doStuff);

        function doStuff() { 
            if(!scope.$parent.pickerData) { 
                console.log("No data loaded!");
                return;
            }
            buildChart(element, scope.$parent);
        }


    };

    function buildChart(element,pscope) {

        var mydiv = "div#donutpicker_chart";

        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var chart = $(mydiv);
        chart.empty();

        ///////////////////////////////////
        // now draw the svg with d3

        // ---------------
        // the chart itself:

        var margin = {
            top:    10, 
            right:  40, 
            bottom: 10, 
            left:   40
        };

        var width   = 400 - margin.right - margin.left,
            height  = 400 - margin.top   - margin.bottom;
        
        var radius = Math.min(width, height) / 2;
        
        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);
        
        var y = d3.scale.sqrt()
            .range([0, radius]);
        
        var svg = d3.select(mydiv).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        // ---------------
        // chart-specific, 
        // data-independent variables
        //
        // Example: 
        // * sort method
        // * tween function
        // * colors (maybe)
        //



        // Sunburst needs these to be functions,
        // donut chart does not.
        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        var colors = {
            "M" : "#5687d1",
            "F" : "#e377c2",
            "None" : "#bbbbbb"
        };

        // if animating, more stuff goes here.


        updateChart = function() { 

            var all_data = pscope.pickerData;

            // ----------------------------------
            // Get pie chart data
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
            for( var i=0; i < pscope.pickerData.length; i++ ) {
                if(pscope.pickerData[i]['code'] == pscope.icd10code) {
                    code = pscope.pickerData[i]['code'];
                    data = pscope.pickerData[i]['donut'];
                }
            }
            // finished; use data
            // ---------------------------------
            

            var g = svg.datum(data)
                    .selectAll("g")
                    .data(data)
                    .enter();


            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { 
                    return +d.value;
                });

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter();

                // !!!!!!!!!!!!!!!!!!                                         
                // note: if you add .append("g") 
                // to the above var g,                                        
                // drawing the arcs will only                                 
                // work the first time you do it,                             
                // after that they'll disappear
                // and g will be an array of nulls.                           
                // so don't do this!                                          
                //
                // .append("g");                                              
                // !!!!!!!!!!!!!!!!!! 

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { 
                    return colors[d.data.label]; 
                });
            
            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.data.label; });

        }



        // ------------------
        // if you build it, 
        // you must update it.
        updateChart();

        // UUUUUUUGGGGHHHH 
        // This does not detect changes in icd10code.
        // have to call updateChart manually in the changecode action directive.
        //
        //pscope.$watch('icd10code',updateChart);

    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);



