var ng;
dir = [];

//////////////////////////////////////
// Sunburst Directives
//
// This file defines Angular directives 
// that use D3 to draw sunburst charts.
// 

///////////////////////////////////////////////
// Plain Ol Sunburst

ng = a.directive('plainSunburst', function($compile) {

    function link(scope, element, attr) {

        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var el = element[0];

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
        
        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");


        // ---------------
        // more chart-specific, 
        // data-independent variables:

        // default sort method: count
        var partition = d3.layout.partition()
            .sort(null)
            .value(function(d) { return 1; });

        var arc = d3.svg.arc()
            .startAngle( function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(   function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

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
            
//--//--//        /*
//--//--//        // When switching data: interpolate the arcs in data space.
//--//--//        function arcTweenData(a, i) {
//--//--//            var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
//--//--//            function tween(t) {
//--//--//                var b = oi(t);
//--//--//                a.x0 = b.x;
//--//--//                a.dx0 = b.dx;
//--//--//                return arc(b);
//--//--//            }
//--//--//            if (i == 0) {
//--//--//             // If we are on the first arc, adjust the x domain to match the root node
//--//--//             // at the current zoom level. (We only need to do this once.)
//--//--//                var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
//--//--//                return function(t) {
//--//--//                    x.domain(xd(t));
//--//--//                    return tween(t);
//--//--//                };
//--//--//            } else {
//--//--//                return tween;
//--//--//            }
//--//--//        }
//--//--//       
//--//--//        // When zooming: interpolate the scales.
//--//--//        function arcTweenZoom(d) {
//--//--//            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
//--//--//                yd = d3.interpolate(y.domain(), [d.y, 1]),
//--//--//                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
//--//--//            return function(d, i) {
//--//--//                return i
//--//--//                  ? function(t) { return arc(d); }
//--//--//                  : function(t) { 
//--//--//                      x.domain(xd(t)); 
//--//--//                      y.domain(yd(t)).range(yr(t)); 
//--//--//                      return arc(d); };
//--//--//            };
//--//--//        }
//--//--//        */
//--//--//
//--//--//
//--//--//        //////////////////////////////////////////
//--//--//        // On with the show:
//--//--//        // draw the damn thing.
//--//--//
//--//--//        // Keep track of the node that is currently being displayed as the root.
//--//--//        var node;
//--//--//
//--//--//        /*
//--//--//        function click(d) {
//--//--//            node = d;
//--//--//            path.transition()
//--//--//              .duration(1000)
//--//--//              .attrTween("d", arcTweenZoom(d));
//--//--//        }
//--//--//        */
//--//--//
//--//--//        // ----------------------
//--//--//        // add drawchart to the scope, 
//--//--//        // so that user can trigger it with a button 
//--//--//        //
//--//--//
//--//--//        function scope.drawChart() {
//--//--//
//--//--//            svg.selectAll("path").remove();
//--//--//
//--//--//
//--//--//
//--//--//
//--//--//            //console.log('year updated: '+pscope.sunburst_yr);
//--//--//
//--//--//            // some things we will always do:
//--//--//            //
//--//--//
//--//--//            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//            // get treeified category structure
//--//--//            // (filters tax return data by year)
//--//--//            //console.log('now we get category tree year data '+pscope.sunburst_yr);
//--//--//            new_treeified = pscope.get_category_tree_yr(
//--//--//                    pscope.taxData,
//--//--//                    pscope.sunburst_yr
//--//--//            );
//--//--//
//--//--//            node = new_treeified;//pscope.treeified;
//--//--//
//--//--//
//--//--//            // // printing new_treeified confirms
//--//--//            // // when we don't do antyhing to it, 
//--//--//            // // we are correctly loading it up,
//--//--//            // // and it is correctly changing with year
//--//--//            // console.log(new_treeified);
//--//--//
//--//--//
//--//--//            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//            // draw the data
//--//--//            // (put the data in the chart)
//--//--//
//--//--//            //console.log('add the new nodes/paths.');
//--//--//        
//--//--//            // creating a new color scale here keeps everything
//--//--//            // ordered and consistent within a given year,
//--//--//            // which is more important than being consistent
//--//--//            // across given years
//--//--//            var color = d3.scale.category20c();
//--//--//
//--//--//            var path = svg
//--//--//                .datum(new_treeified)
//--//--//                .selectAll("path")
//--//--//                .data(partition.nodes)
//--//--//                .enter().append("path")
//--//--//                .attr("d", arc)
//--//--//                .style("fill", function(d) { 
//--//--//                    return color((d.children ? d : d.parent).name); 
//--//--//                });
//--//--//
//--//--//
//--//--//            /*
//--//--//                .on("click", click)
//--//--//                .each(stash0);
//--//--//
//--//--//            path.transition()
//--//--//                .duration(1000)
//--//--//                .attrTween('d',arcTweenZero);
//--//--//
//--//--//            d3.select(self.frameElement).style("height", height + "px");
//--//--//
//--//--//            scope.$watch('totalcount',function(){updateFilter()});
//--//--//
//--//--//            function updateFilter() { 
//--//--//                // load the new data values and animate
//--//--//                path.data(partition.value(scope.totalcount).nodes)
//--//--//                    .transition()
//--//--//                    .duration(1000)
//--//--//                    .attrTween('d',arcTweenData);
//--//--//            }
//--//--//            
//--//--//            path.each(stash);
//--//--//
//--//--//            pscope.treeified = new_treeified;
//--//--//            */
//--//--//
//--//--//        }
//--//--//
//--//--//
//--//--//        /*
//--//--//        //////////////////////////////////////////
//--//--//        // On with the show:
//--//--//        // let's obtain our initial data set
//--//--//        // and put it in the chart.
//--//--//
//--//--//        var pscope = scope.$parent;
//--//--//
//--//--//        // Keep track of the node that is currently being displayed as the root.
//--//--//        var node;
//--//--//
//--//--//        // ----------------------
//--//--//        // watch for updates to year
//--//--//
//--//--//        pscope.$watch('sunburst_yr',function() { updateYear() });
//--//--//
//--//--//        // set initial year
//--//--//        pscope.sunburst_yr = 1999;
//--//--//
//--//--//        function updateYear() {
//--//--//
//--//--//            console.log('year updated: '+pscope.sunburst_yr);
//--//--//
//--//--//            // some things we will always do:
//--//--//
//--//--//            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//            // get treeified category structure
//--//--//            // (filters tax return data by year)
//--//--//            console.log('now we get category tree year data '+pscope.sunburst_yr);
//--//--//            new_treeified = pscope.get_category_tree_yr(
//--//--//                    pscope.taxData,
//--//--//                    pscope.sunburst_yr
//--//--//            );
//--//--//
//--//--//            node = new_treeified;//pscope.treeified;
//--//--//
//--//--//            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//            // draw the data
//--//--//            // (put the data in the chart)
//--//--//
//--//--//
//--//--//            console.log('now we draw the new nodes/paths.');
//--//--//            console.log(new_treeified);
//--//--//            var path = svg.datum(new_treeified).selectAll("path")
//--//--//                .data(partition.nodes,function(z) {
//--//--//                    z.x0 = 0;
//--//--//                    z.dx0 = 0;
//--//--//                    return z;
//--//--//                })
//--//--//                .enter().append("path")
//--//--//                .attr("d", arc)
//--//--//                .style("fill", function(d) { 
//--//--//                    return color((d.children ? d : d.parent).name); 
//--//--//                })
//--//--//                .on("click", click);
//--//--//
//--//--//            path.transition()
//--//--//                .duration(1000)
//--//--//                .attrTween('d',arcTweenData);
//--//--//
//--//--//            d3.select(self.frameElement).style("height", height + "px");
//--//--//
//--//--//            scope.$watch('totalcount',function(){updateFilter(path)});
//--//--//
//--//--//            function updateFilter(path) { 
//--//--//                // load the new data values and animate
//--//--//                path.data(partition.value(scope.totalcount).nodes)
//--//--//                    .transition()
//--//--//                    .duration(1000)
//--//--//                    .attrTween('d',arcTweenData);
//--//--//            }
//--//--//            
//--//--//            pscope.treeified = new_treeified;
//--//--//        }
//--//--//        */
//--//--//
//--//--//
//--//--//        // // // if(virgin) {
//--//--//
//--//--//        // // //     // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // //     // draw the data
//--//--//        // // //     // (put the data in the chart)
//--//--//
//--//--//        // // //     node = pscope.treeified;
//--//--//        // // //     path = svg.datum(pscope.treeified).selectAll("path")
//--//--//        // // //         .data(partition.nodes)
//--//--//        // // //         .enter().append("path")
//--//--//        // // //         .attr("d", arc)
//--//--//        // // //         .style("fill", function(d) { 
//--//--//        // // //             return color((d.children ? d : d.parent).name); 
//--//--//        // // //         })
//--//--//        // // //         .on("click", click);
//--//--//
//--//--//        // // //     //console.log('from virgin:');
//--//--//        // // //     //svg.selectAll("path").each(fakestash);
//--//--//
//--//--//        // // //     d3.select(self.frameElement).style("height", height + "px");
//--//--//        // // //     
//--//--//
//--//--//
//--//--//        // // //     scope.$watch('totalcount', updateFilter);
//--//--//
//--//--//        // // //     function updateFilter() { 
//--//--//        // // //         // load the new data values and animate
//--//--//        // // //         path.data(partition.value(scope.totalcount).nodes)
//--//--//        // // //             .transition()
//--//--//        // // //             .duration(1000)
//--//--//        // // //             .attrTween('d',arcTweenData);
//--//--//        // // //     }
//--//--//
//--//--//        // // //     virgin = false;
//--//--//
//--//--//
//--//--//        // // // } 
//--//--//        // // // console.log('done with virgin.');
//--//--//
//--//--//
//--//--//        // // // //////////////////////////////////////////
//--//--//        // // // //
//--//--//        // // // // DONT WATCH THE DATA
//--//--//        // // // // WATCH THE FILTERS
//--//--//        // // // //
//--//--//        // // // // here, go through process of creating paths
//--//--//        // // // // for initial chart creation.
//--//--//        // // // //
//--//--//        // // // // once these are created, all we do is watch
//--//--//        // // // // for changes in the data, due to total/cout 
//--//--//        // // // // or due to year
//--//--//        // // // //
//--//--//        // // // // we need to fix how we're watching for changes.
//--//--//        // // // // instead of watching the data,
//--//--//        // // // // watch the year.
//--//--//        // // // //
//--//--//        // // // // whose responsibility is it to get the right data?
//--//--//        // // // // ours. we are the directive.
//--//--//        // // // // right. so handle the data filters HERE.
//--//--//        // // // // don't wait for someone else to filter it for you.
//--//--//
//--//--//
//--//--//        // // // pscope.sunburst_yr = 1997;
//--//--//        // // // //updateYear(path);
//--//--//
//--//--//        // // // function updateYear(path) { 
//--//--//
//--//--//        // // //     console.log('year updated: '+pscope.sunburst_yr);
//--//--//
//--//--//
//--//--//        // // //     // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // //     // get treeified category structure
//--//--//        // // //     // (filters tax return data by year)
//--//--//        // // //     console.log('now we get category tree year data '+pscope.sunburst_yr);
//--//--//        // // //     new_treeified = pscope.get_category_tree_yr(
//--//--//        // // //             pscope.taxData,
//--//--//        // // //             pscope.sunburst_yr
//--//--//        // // //     );
//--//--//
//--//--//        // // //     node = new_treeified;//pscope.treeified;
//--//--//
//--//--//
//--//--//        // // //     // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // //     // draw the data
//--//--//        // // //     // (put the data in the chart)
//--//--//        // // //     //
//--//--//        // // //     if(!path) { 
//--//--//        // // //         console.log('now we draw the new nodes/paths.');
//--//--//        // // //         path = svg.datum(new_treeified).selectAll("path")
//--//--//        // // //             .data(partition.nodes)
//--//--//        // // //             .enter().append("path")
//--//--//        // // //             .attr("d", arc)
//--//--//        // // //             .style("fill", function(d) { 
//--//--//        // // //                 return color((d.children ? d : d.parent).name); 
//--//--//        // // //             })
//--//--//        // // //             .on("click", click);
//--//--//
//--//--//        // // //         d3.select(self.frameElement).style("height", height + "px");
//--//--//
//--//--//        // // //         scope.$watch('totalcount', updateFilter);
//--//--//
//--//--//        // // //         function updateFilter() { 
//--//--//        // // //             // load the new data values and animate
//--//--//        // // //             path.data(partition.value(scope.totalcount).nodes)
//--//--//        // // //                 .transition()
//--//--//        // // //                 .duration(1000)
//--//--//        // // //                 .attrTween('d',arcTweenData);
//--//--//        // // //         }
//--//--//
//--//--//
//--//--//
//--//--//
//--//--//
//--//--//
//--//--//
//--//--//        // // //     // Step 1:
//--//--//        // // //     // store the old coordinates from path
//--//--//        // // //     old_xy = {};
//--//--//        // // //     path.each(function(z) { 
//--//--//        // // //         var k = z.name;
//--//--//        // // //         var v = { 'x0' : z.x,
//--//--//        // // //                  'dx0' : z.dx,
//--//--//        // // //         };
//--//--//        // // //         old_xy[k] = v;
//--//--//        // // //     });
//--//--//        // // //     var ks = Object.keys(old_xy);
//--//--//
//--//--//
//--//--//        // // //     // Step 2:
//--//--//        // // //     // generate the new path
//--//--//        // // //     // the datum() binds the new tree's root to the path.
//--//--//        // // //     // then we start adding nodes.
//--//--//
//--//--//        // // //     
//--//--//        // // //     var path = svg.datum(new_treeified).selectAll("path")
//--//--//        // // //         .data(partition.nodes(node), function(z) {
//--//--//
//--//--//        // // //             // Step 3:
//--//--//        // // //             // we have old xy info for this pair,
//--//--//        // // //             // so populate new path with old coordinates
//--//--//        // // //             //
//--//--//        // // //             var io = ks.indexOf(z.name);
//--//--//        // // //             if(io >= 0) { 
//--//--//        // // //                 var xy_info = old_xy[z.name];
//--//--//        // // //                 z.x0  = xy_info.x0;
//--//--//        // // //                 z.dx0 = xy_info.dx0;
//--//--//        // // //             } else {
//--//--//        // // //                 z.x0  = z.x;
//--//--//        // // //                 z.dx0 = z.dx;
//--//--//        // // //             }
//--//--//
//--//--//        // // //             //console.log(z);
//--//--//        // // //             return z;
//--//--//
//--//--//
//--//--//        // // //         }).enter()
//--//--//        // // //         .append("path")
//--//--//        // // //         .attr("d", arc)
//--//--//        // // //         .style("fill", function(d) { 
//--//--//        // // //             return color((d.children ? d : d.parent).name); 
//--//--//        // // //         });
//--//--//
//--//--//        // // //     path.transition()
//--//--//        // // //         .duration(1000)
//--//--//        // // //         .attrTween("d",arcTweenData);
//--//--//
//--//--//        // // //     pscope.treeified = new_treeified;
//--//--//
//--//--//
//--//--//        // // // }
//--//--//
//--//--//
//--//--//
//--//--//        // // // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//
//--//--//        // // // // function chartCallback() {
//--//--//
//--//--//        // // // //     if(!pscope.treeified){ return; }
//--//--//        // // // //     if(!pscope.sunburst_yr){ return; }
//--//--//
//--//--//        // // // //     // default sort method: count
//--//--//        // // // //     //
//--//--//        // // // //     var partition = d3.layout.partition()
//--//--//        // // // //         .sort(null)
//--//--//        // // // //         .value(function(d) { return 1; });
//--//--//        // // // //     
//--//--//        // // // //     var arc = d3.svg.arc()
//--//--//        // // // //         .startAngle( function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
//--//--//        // // // //         .endAngle(   function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
//--//--//        // // // //         .innerRadius(function(d) { return Math.max(0, y(d.y)); })
//--//--//        // // // //         .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
//--//--//        // // // //     
//--//--//        // // // //     // Keep track of the node that is currently being displayed as the root.
//--//--//        // // // //     var node;
//--//--//
//--//--//        // // // //     node = pscope.treeified;
//--//--//        // // // //     var path = svg.datum(pscope.treeified).selectAll("path")
//--//--//        // // // //         .data(partition.nodes)
//--//--//        // // // //         .enter().append("path")
//--//--//        // // // //         .attr("d", arc)
//--//--//        // // // //         .style("fill", function(d) { 
//--//--//        // // // //             return color((d.children ? d : d.parent).name); 
//--//--//        // // // //         })
//--//--//        // // // //         .on("click", click)
//--//--//        // // // //         .each(stash);
//--//--//
//--//--//        // // // //     function click(d) {
//--//--//        // // // //         node = d;
//--//--//        // // // //         path.transition()
//--//--//        // // // //           .duration(1000)
//--//--//        // // // //           .attrTween("d", arcTweenZoom(d));
//--//--//        // // // //     }
//--//--//
//--//--//        // // // //     scope.$watch('totalcount', updateFilter);
//--//--//
//--//--//        // // // //     function updateFilter() { 
//--//--//        // // // //         path.data(partition.value(scope.totalcount).nodes)
//--//--//        // // // //             .transition()
//--//--//        // // // //             .duration(1000)
//--//--//        // // // //             .attrTween('d',arcTweenData);
//--//--//        // // // //     }
//--//--//
//--//--//        // // // //     d3.select(self.frameElement).style("height", height + "px");
//--//--//
//--//--//        // // // //     // Setup for switching data: stash the old values for transition.
//--//--//        // // // //     function stash(d) {
//--//--//        // // // //         d.x0 = d.x;
//--//--//        // // // //         d.dx0 = d.dx;
//--//--//        // // // //     }
//--//--//        // // // //     
//--//--//        // // // //     // When switching data: interpolate the arcs in data space.
//--//--//        // // // //     function arcTweenData(a, i) {
//--//--//        // // // //       var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
//--//--//        // // // //       function tween(t) {
//--//--//        // // // //         var b = oi(t);
//--//--//        // // // //         a.x0 = b.x;
//--//--//        // // // //         a.dx0 = b.dx;
//--//--//        // // // //         return arc(b);
//--//--//        // // // //       }
//--//--//        // // // //       if (i == 0) {
//--//--//        // // // //        // If we are on the first arc, adjust the x domain to match the root node
//--//--//        // // // //        // at the current zoom level. (We only need to do this once.)
//--//--//        // // // //         var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
//--//--//        // // // //         return function(t) {
//--//--//        // // // //           x.domain(xd(t));
//--//--//        // // // //           return tween(t);
//--//--//        // // // //         };
//--//--//        // // // //       } else {
//--//--//        // // // //         return tween;
//--//--//        // // // //       }
//--//--//        // // // //     }
//--//--//        // // // //     
//--//--//        // // // //     // When zooming: interpolate the scales.
//--//--//        // // // //     function arcTweenZoom(d) {
//--//--//        // // // //       var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
//--//--//        // // // //           yd = d3.interpolate(y.domain(), [d.y, 1]),
//--//--//        // // // //           yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
//--//--//        // // // //       return function(d, i) {
//--//--//        // // // //         return i
//--//--//        // // // //             ? function(t) { return arc(d); }
//--//--//        // // // //             : function(t) { 
//--//--//        // // // //                 x.domain(xd(t)); 
//--//--//        // // // //                 y.domain(yd(t)).range(yr(t)); 
//--//--//        // // // //                 return arc(d); };
//--//--//        // // // //       };
//--//--//        // // // //     }
//--//--//        // // // // }
//--//--//
//--//--//        // // // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//--//--//        // // // // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    };

    return {
        link: link,
        restrict: "E",
        scope: {
            totalcount: '=',
            treeified: '='
        }
    };
});
dir.push(ng);









