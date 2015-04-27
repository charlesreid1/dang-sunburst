var ng;
dir = [];

//////////////////////////////////////
// Sunburst Directives
//
// This file defines Angular directives 
// that use D3 to draw sunburst charts.
// 

ng = a.directive('sliderSunburstHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#sunburst_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Slider Interactive Sunburst")
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
// Plain Sunburst Controls

ng = a.directive('sliderSunburstControls', function($compile) {

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



///////////////////////////////////////////////
// Sunburst Panels


ng = a.directive('sliderSunburstPanels', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

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
            }).text("Mouseover Active Arc")
            .appendTo(panelhead);



        var panelbody = $("<div />", {
                "class" : "panel-body"
            }).appendTo(panel);

        var maindiv = $("<div />", {
                /*"ng-show" : "mouseoverPoint"*/
            }).appendTo(panelbody);

        var h = $("<h3 />")
            .html("Name: [[mouseoverPoint.name]]")
            .appendTo(maindiv);

        var p = $("<p />", {
                "class" : "lead"
            })
            .html("Value: [[mouseoverPoint.magnitude | number:0]]")
            .appendTo(maindiv);


        angular.element(el).prepend($compile(panel)(pscope));




        // --------------------------
        // add display for details 
        // about current clicked selection
        
        // assemble the tags, 
        // then compile the html
        // select element of interest with angular.element
        // and append the compiled tags
        //

        var panel = $("<div />", {
                "class" : "panel panel-warning",
                "id" : "clickedPointPanel"
            });

        var panelhead = $("<div />", {
                "class" : "panel-heading"
            }).appendTo(panel);
        
        var h3 = $("<h3 />", {
                "class" : "panel-title"
            }).text("Selected Arc")
            .appendTo(panelhead);



        var panelbody = $("<div />", {
                "class" : "panel-body"
            }).appendTo(panel);

        var maindiv = $("<div />", {
                /*"ng-show" : "clickedPoint"*/
            }).appendTo(panelbody);

        var h = $("<h3 />")
            .html("Name: [[clickedPoint.name]]")
            .appendTo(maindiv);

        var p = $("<p />", {
                "class" : "lead"
            })
            .html("Value: [[clickedPoint.magnitude | number:0]]")
            .appendTo(maindiv);


        // this is where you add the slider
        var input = $("<input />", {
            "id" : "TheSlider",
            "type" : "range",
            "min" : "1", 
            "max" : "300",
            "class" : "slider",
            "ng-model" : "clickedPoint.magnitude"
        }).appendTo(maindiv);

        //onchange??
        //
        //where to set up watch for clickedPoint.magnitude?
        //how to make sure that the link that points to in the tree
        //is actually updated when clickedPoint.magnitude is updated?

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
// Sunburst Chart

ng = a.directive('sliderSunburstChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('sunburstData',doStuff);

        function doStuff() { 
            if(!scope.$parent.sunburstData) { return }
            console.log('in doStuff() because sunburstData');
            buildChart(element, scope.$parent);
        }


    };

    function buildChart(element,pscope) {

        console.log('in buildChart()');

        var data = pscope.sunburstData;

        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var chart = $("div#sunburst_chartchart");
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
        
        var svg = d3.select("div#sunburst_chartchart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        // ---------------
        // chart-specific, 
        // data-independent variables:

        // default sort method
        var partition = d3.layout.partition()
            .sort(null)
            .value(function(d) { 
                if( pscope.countval_current=="magnitude" ) {
                    return d.magnitude;
                } else { 
                    return 1;
                }
            });

        var arc = d3.svg.arc()
            .startAngle( function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(   function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        var smallArc_zoom0 = 0.010,
            smallArc_zoom1 = 0.002;

        // -------------------------
        // convenience functions for drawing chart
        //
        //function stash(d) {
        //    d.x0 = d.x;
        //    d.dx0 = d.dx;
        //}

        // Tween from zero 
        function arcTweenZero(node, arc, a, i) {
            var oi = d3.interpolate({x: 0, dx: 0}, a);
            function tween(t) {
                var b = oi(t);
                a.x0  = 0;//b.x;
                a.dx0 = 0;//b.dx;
                return arc(b);
            }
            if (i == 0) {
                // If we are on the first arc, adjust the x domain to match the root node
                // at the current zoom level. (We only need to do this once.)
                var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
                return function(t) {
                    x.domain(xd(t));
                    return tween(t);
                };
            } else {
                return tween;
            }
        }


        // When switching data: interpolate the arcs in data space.                  
        function arcTweenData(node, arc, a, i) {
            var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);                          
            function tween(t) {                                                        
              var b = oi(t);                                                           
              a.x0 = b.x;                                                              
              a.dx0 = b.dx;                                                            
              return arc(b);                                                           
            }                                                                          
            if (i == 0) {                                                              
             // If we are on the first arc, adjust the x domain to match the root node 
             // at the current zoom level. (We only need to do this once.)             
              var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);         
              return function(t) {                                                     
                x.domain(xd(t));                                                       
                return tween(t);                                                       
              };                                                                       
            } else {                                                                   
              return tween;                                                            
            }                                                                          
        }                                                                            

        // if you build it, 
        // you must update it.
        updateChart();

        // chart will be built/updated if user updates data.
        // chart will be updated if user clicks on a point.
        pscope.$watch('clickedPoint',function(){ 
            if(!pscope.clickedPoint) { return };
            console.log('clickedPoint changed'); 
        });

        pscope.$watch('clickedPoint.magnitude',function(){ 
            if(!pscope.clickedPoint) { return };
            console.log('clickedPoint.magnitude changed'); 
            pscope.clickedPoint.value = +pscope.clickedPoint.magnitude;
            updateChart();
        });


        function updateChart() {

            console.log('in updateChart()');


            //////////////////////////////
            // deal with the slider first:
            // show it if user has clicked an 
            // outer slice of the sunburst,
            // don't show it otherwise
            d3.select("input#TheSlider").style("visibility",function(z) {
                if(pscope.clickedPoint) { 
                    if(!(pscope.clickedPoint.name in ['A','B','C','D','E'])) {
                        return "visible";
                    } else {
                        return "hidden";
                    }
                } else {
                    return "hidden";
                }
            });



            //////////////////////////////////////////
            // On with the show:
            // draw the damn thing.

            // Keep track of the node that is currently being displayed as the root.
            var node;

            svg.selectAll("path").remove();
            svg.selectAll("text").remove();

            node = data;

            //var N = 26;
            //var color = d3.scale.ordinal()
            //    .domain([0, N-1])
            //    .range(d3.range(data.length).map(
            //            d3.scale.linear()
            //            .domain([0, data.length - 1])
            //            .range(["steelblue","pink"])
            //            .interpolate(d3.interpolateLab))
            //    );
            var color = d3.scale.category10();

            // this is where the magic happens
            //
            // bind the data to the g elements

            var g = svg
                .datum(data)
                .selectAll("g")
                .data(partition.nodes(node))
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

            // add paths (arcs) to g, and bind click action
            var path = g.append("path")
                .attr("d",arc)
                .style("fill",function(d,i) {
                    if(d.name=="root") {
                        return "#ccc";
                    } else if(!d.children) {
                        return color(d.parent.name);

                    } else {
                        return color(d.name);
                    }
                })
                .attr("opacity",function(d,i) {
                    return 0.8;
                    //if(d.depth<2) {
                    //    return 0.6;
                    //} else {
                    //    return 0.8;
                    //}
                })
                .on("click",function(d) {
                    pscope.$apply(function(){
                        pscope.clickedPoint = d;
                    });

                    d3.selectAll('path').classed('activeclicked',function(e){
                        var dname = d['name'];
                        var ename = e['name'];
                        return dname==ename;
                    });
                })
                .on('mouseover', function(d){
                    pscope.$apply(function(){
                        pscope.mouseoverPoint = d;
                    });
                    d3.selectAll('path').classed('activehover',function(e){
                        var dname = d['name'];
                        var ename = e['name'];
                        return dname==ename;
                    });
                })
                .on('mouseout', function(){
                    d3.selectAll('g.point').classed('active',false);
                });

            // add text labels, and set visibility
            var text = g.append("text")
                .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
                .attr("x", function(d) { return y(d.y); })
                .attr("dx", "6") // margin
                .attr("dy", ".35em") // vertical-align
                .text(function(d) { 
                    if(d.name!="root") {
                        return d.name;
                    }
                })
                .attr("visibility",function(d) {
                    if(d.name=="root") {
                        return "hidden";
                    } else {
                        return "visible";
                    }
                });



            function computeTextRotation(d) {
                // if our arc takes up more than half a circle,
                // orient the text horizontally.
                if(x(d.dx) > Math.PI) {
                    return 0;
                } else {
                    return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
                }
            }


            // watch for user clicking total/count switch
            //
            // this changes how arc lengths are computed
            // (based on value or based on count)
            // 
            // update how arc lengths are computed
            // and how data is binned
            //
            // value = arc length proportional to value field
            // count = arc length uniform for each count 
            //
            pscope.updateFilter = function(key) { 

                console.log('in updatefilter');

                // load the new data values and animate

                var valuef;
                if(key=="magnitude") { 
                    valuef = function(v) { return v.magnitude };
                } else {
                    valuef = function() { return 1 };
                }

                console.log( partition.value(valuef).nodes );

                // because underlying data does not change,
                // we can pass partition.value(valuef).nodes, 
                // which is a function, 
                // to operate on our existing path data.
                console.log(path.data);

                path.data(partition.value(valuef).nodes)
                    .transition()
                    .duration(1000)
                    .attrTween('d',function(d,i) { 
                        arcTweenData(node,arc,d,i);
                    })
                    .each("end",function(e,i) {

                        // get a selection of the associated text element
                        var arcText = d3.select(this.parentNode).select("text");

                        // fade in the text element and recalculate positions
                        arcText.transition().duration(750)
                            .attr("transform", function() { 
                                return "rotate(" + computeTextRotation(e) + ")" ;
                            })
                            .attr("x", function(d) { return y(d.y); });
                    });
            }

        }

    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);


