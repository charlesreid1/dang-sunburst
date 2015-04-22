var ng;
dir = [];

//////////////////////////////////////
// Sunburst Directives
//
// This file defines Angular directives 
// that use D3 to draw sunburst charts.
// 

ng = a.directive('orthogSunburstHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#sunburst_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Sunburst of Orthogonal Dimensions")
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

ng = a.directive('orthogSunburstControls', function($compile) {

    function link(pscope, element, attr) { 

        var el = element[0];

        pscope.counttot_btn = "total";
        pscope.counttot_current = "count";

        
        var div = $("<div />");

        var alrt_t = $("<p />")
            .html("Data is currently binned by [[counttot_current]].")
            .appendTo(div);

        var alrt_p = $("<p />").appendTo(alrt_t);

        var alrt_b = $("<a />", {
                "class" : "btn btn-large btn-default"
            })
            .bind('click',function() {

                if( pscope.counttot_btn=="total" ) {
                    pscope.counttot_btn = "count";
                } else if( pscope.counttot_btn=="count" ) {
                    pscope.counttot_btn = "total";
                }

                if( pscope.counttot_current=="total" ) {
                    pscope.counttot_current = "count";
                } else if( pscope.counttot_current=="count" ) {
                    pscope.counttot_current = "total";
                }

                pscope.$apply();
            })
            .html("Group by [[counttot_btn]]")
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
// Plain Sunburst Chart

ng = a.directive('orthogSunburstChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('orthogData',doStuff);

        function doStuff() { 
            if(!scope.$parent.orthogData) { return }
            updateChart(element, scope.$parent);
        }

    };

    function updateChart(element,pscope) {

        console.log('updating chart');

        var data = pscope.orthogData;
        console.log(data);


        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var el = element[0];

        var txt = $("div#sunburst_chart");


        // --------------------------
        // add display for details 
        // about current mouseover selection
        
        // assemble the tags, 
        // then compile the html
        // select element of interest with angular.element
        // and append the compiled tags
        //
        var br = $("<br />").appendTo(txt);


        var panel = $("<div />", {
                "class" : "panel panel-primary",
                "id" : "selectedPointPanel"
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
                /*"ng-show" : "selectedPoint"*/
            }).appendTo(panelbody);

        var h = $("<h3 />")
            .html("Name: [[selectedPoint.name]]")
            .appendTo(maindiv);

        var p = $("<p />", {
                "class" : "lead"
            })
            .html("Value: [[selectedPoint.value]]")
            .appendTo(maindiv);



        angular.element(txt).prepend($compile(panel)(pscope));




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
        
        var svg = d3.select("div#sunburst_chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");


        // ---------------
        // chart-specific, 
        // data-independent variables:

        // default sort method: count
        var partition = d3.layout.partition()
            .sort(null)
            .value(function(d) { 
                return d.value; 
            });

        var arc = d3.svg.arc()
            .startAngle( function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(   function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        var smallArc_zoom0 = 0.010,
            smallArc_zoom1 = 0.002;

        function stash(d) {
            d.x0 = d.x;
            d.dx0 = d.dx;
        }

        // Tween from zero 
        function arcTweenZero(a, i) {
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



        // When zooming: interpolate the scales.
        function arcTweenZoom(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d, i) {
                return i
                  ? function(t) { return arc(d); }
                  : function(t) { 
                      x.domain(xd(t)); 
                      y.domain(yd(t)).range(yr(t)); 
                      return arc(d); };
            };
        }



        //////////////////////////////////////////
        // On with the show:
        // draw the damn thing.

        // Keep track of the node that is currently being displayed as the root.
        var node;


        svg.selectAll("path").remove();

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
            .enter().append("g");

        // add paths (arcs) to g, and bind click action
        var path = g.append("path")
            .attr("d",arc)
            .style("fill",function(d,i) {
                if(d.name=="root") {
                    return "#ccc";
                } else if(d.depth<2) {
                    return color(d.name);
                } else {
                    return color(d.parent.name);
                }
            })
            .attr("opacity",function(d,i) {
                if(d.depth<2) {
                    return 0.6;
                } else {
                    return 0.8;
                }
            })
            .on("click",click)
            .on('mouseover', function(d){
                pscope.$apply(function(){
                    pscope.selectedPoint = d;
                });
                d3.selectAll('path').classed('active',function(e){
                    var dname = d['name'];
                    var ename = e['name'];
                    return dname==ename;
                });
            })
            .on('mouseout', function(){
                d3.selectAll('g.point').classed('active',false);
            })
            .each(stash);

        // add text labels, and set visibility
        var text = g.append("text")
            .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function(d) { return y(d.y); })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .text(function(d) { 
                return d.letter;
            })
            .attr("visibility",function(d) {
                if(node.level==0) {
                    if(d.dx < smallArc_zoom0) { 
                        return "hidden";
                    } else {
                        return "visible";
                    }
                } else {
                    if(d.letter=="root") { 
                        return "hidden";
                    } else if(d.dx < smallArc_zoom1) { 
                        return "hidden";
                    } else {
                        return "visible";
                    }
                }
            });



        // animate zooming into partition when clicked 
        function click(d) {
            text.transition()
                .attr("opacity", 0);

            node = d;

            path.transition()
                .duration(1000)
                .attrTween("d", arcTweenZoom(d))
                .each("end",function(e,i) {
                    // check if the animated element's data e lies within the visible angle span given in d
                    if (e.x >= d.x && e.x < (d.x + d.dx)) {

                        // get a selection of the associated text element
                        var arcText = d3.select(this.parentNode).select("text");

                        // fade in the text element and recalculate positions
                        arcText.transition().duration(750)
                            .attr("visibility",function(d) {
                                if(node.level==0) {
                                    if(d.dx < smallArc_zoom0) { 
                                        return "hidden";
                                    } else {
                                        return "visible";
                                    }
                                } else {
                                    if(d.letter=="root") { 
                                        return "hidden";
                                    } else if(d.dx < smallArc_zoom1) { 
                                        return "hidden";
                                    } else {
                                        return "visible";
                                    }
                                }
                            })
                            .attr("opacity", 1)
                            .attr("transform", function() { 
                                if(d.dx==e.dx) { 
                                    return "rotate(0)";
                                } else {
                                    return "rotate(" + computeTextRotation(e) + ")" ;
                                }
                            })
                            .attr("x", function(d) { return y(d.y); });

                    }
                });
        }


        function computeTextRotation(d) {
            // if our arc takes up more than half a circle,
            // orient the text horizontally.
            //console.log(x(d.dx) > Math.PI);
            if(x(d.dx) > Math.PI) {
                return 0;
            } else {
                return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
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









