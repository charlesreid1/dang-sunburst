var ng;
dir = [];

//////////////////////////////////////
// Chart Directives
//
// This file defines Angular directives 
// that use D3 to draw charts.
// 

ng = a.directive('staticDonutHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#donut_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Static Donut Chart Example")
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



/*
///////////////////////////////////////////////
// Plain Chart Controls

ng = a.directive('staticDonutControlssliderSunburstControls', function($compile) {

    function link(scope, element, attr) { 

        pscope = scope.$parent;

        var el = $("div#sunburst_controls");

        pscope.countval_btn = "count";
        pscope.countval_current = "magnitude";

        
        var div = $("<div />");

        var alrt_t = $("<p />")
            .html("Data is currently binned by [[countval_current]].")
            .appendTo(div);

        var alrt_p = $("<p />").appendTo(alrt_t);

        var alrt_b = $("<a />", {
                "class" : "btn btn-large btn-default",
                "countval" : ""
            })
            .html("Group by [[countval_btn]]")
            .appendTo(alrt_p);

        angular.element(el).append($compile(div)(pscope));


    }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);
*/



/*

///////////////////////////////////////////////
// Plain Sunburst Control action directive

ng = a.directive("countval", function($compile){
    return function(pscope, element, attrs){
        element.bind("click", function(){

            console.log('clicked countval switch.');

            if( pscope.countval_btn=="magnitude" ) {
                pscope.countval_btn = "count";
            } else if( pscope.countval_btn=="count" ) {
                pscope.countval_btn = "magnitude";
            }

            if( pscope.countval_current=="magnitude" ) {
                pscope.countval_current = "count";
            } else if( pscope.countval_current=="count" ) {
                pscope.countval_current = "magnitude";
            }

            var key = pscope.countval_current;

            console.log('updating filter on key '+key);

            pscope.updateFilter(key)

            pscope.$apply();

        });
    }
});
dir.push(ng);

*/




///////////////////////////////////////////////
// Panels


ng = a.directive('staticDonutPanels', function($compile) {

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

ng = a.directive('staticDonutChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('staticData',doStuff);

        function doStuff() { 
            if(!scope.$parent.staticData) { return }
            buildChart(element, scope.$parent);
        }


    };

    function buildChart(element,pscope) {



        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var chart = $("div#staticdonut_chart");
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
        
        var svg = d3.select("div#staticdonut_chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        // ---------------
        // chart-specific, 
        // data-independent variables:

        // (example: if you have a custom sort method...)

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

        // ------------------
        // if you build it, 
        // you must update it.
        updateChart();


        // ------------------
        // update chart
        function updateChart() {


            var data = pscope.staticData;

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { 
                    return +d.value;
                });

            var g = svg.selectAll(".arc")
                .data(pie(data))
              .enter().append("g")
                .attr("class", "arc");
            
            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return colors[d.data.label]; })
            
            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.data.label; });

        }



    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);



