var ng;
dir = [];

//////////////////////////////////////
// Sunburst Directives
//
// This file defines Angular directives 
// that use D3 to draw sunburst charts.
// 

ng = a.directive('bigram2SunburstHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var h1 = $("<h1 />")
            .appendTo(el);

        var b = $("<b />")
            .text("Interactive Sunburst: Bi-gram Frequencies")
            .appendTo(h1);

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

ng = a.directive('bigram2SunburstControls', function($compile) {
    function link(scope, element, attr) { }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);





///////////////////////////////////////////////
// Plain Sunburst Chart

ng = a.directive('bigram2SunburstChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('bigramData',doStuff);

        function doStuff() { 
            if(!scope.$parent.bigramData) { return }
            updateChart(element, scope.$parent);
        }

    };

    function updateChart(element,pscope) {

        console.log('updating chart');

        var data = pscope.bigramData;


        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var el = element[0];


        // --------------------------
        // start with title and filler text 

        var row = $("<div />",{
                "class" : "row"
            }).appendTo(el);

        var col1 = $("<div />",{
                "class" : "col-sm-6",
                "id" : "sunburst_chart"
            }).appendTo(row);

        var col2 = $("<div />",{
                "class" : "col-sm-6",
                "id" : "sunburst_text"
            }).appendTo(row);

        var descr = $("<p />")
            .text("This chart adds interactivity - clicking on partitions on the chart will zoom in to that partition.")
            .appendTo(col2);


        // --------------------------
        // add display for details 
        // about current mouseover selection
        
        // assemble the tags, 
        // then compile the html
        // select element of interest with angular.element
        // and append the compiled tags


        var panel = $("<div />", {
                "class" : "panel panel-primary"
            });



        var panelhead = $("<div />", {
                "class" : "panel-heading"
            }).appendTo(panel);
        
        var h3 = $("<h3 />", {
                "class" : "panel-title"
            }).text("Selected Bi-Gram")
            .appendTo(panelhead);



        var panelbody = $("<div />", {
                "class" : "panel-body"
            }).appendTo(panel);

        var maindiv = $("<div />", {
                /*"ng-show" : "selectedPoint"*/
            }).appendTo(panelbody);

        var h = $("<h3 />")
            .html("Bi-gram: [[selectedPoint.letter]]")
            .appendTo(maindiv);

        var p = $("<p />", {
                "class" : "lead"
            })
            .html("Letter: [[selectedPoint.letter1]] <br />" +
                  "Total Count: [[selectedPoint.total]]")
            .appendTo(maindiv);



        angular.element(col2).append($compile(panel)(pscope));





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
                return d.total; 
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
        var color = d3.scale.category20c();

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
                if(d.letter=='root') {
                    return '#ccc';
                } else {
                    return color((d.children ? d : d.parent).letter); 
                }
            })
            .on("click",click)
            .on('mouseover', function(d){
                if(d.letter!="root") {
                    pscope.$apply(function(){
                        pscope.selectedPoint = d;
                    });
                }
                d3.selectAll('path').classed('active',function(e){
                    var dlet = d['letter'];
                    var elet = e['letter'];
                    return dlet==elet;
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









