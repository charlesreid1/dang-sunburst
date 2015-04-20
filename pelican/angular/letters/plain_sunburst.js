var ng;
dir = [];

// hipster jesus api
// for some hipster ipsum
var hipster_ipsum = function(N,tagname) {
    $.getJSON('http://hipsterjesus.com/api?paras='+N+'&html=true', function(data) {
        $(tagname).html( data.text );
    });
};

//////////////////////////////////////
// Sunburst Directives
//
// This file defines Angular directives 
// that use D3 to draw sunburst charts.
// 

ng = a.directive('plainSunburstHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var h1 = $("<h1 />")
            .appendTo(el);
        var b = $("<b />")
            .text("English Language Letter Frequencies")
            .appendTo(h1);
        var descr = $("<p />", {
            "class" : "lead"
        }).text("Pickled Pitchfork tattooed, health goth ex Schlitz non tempor fap nostrud chia master cleanse. Slow-carb irony cornhole sustainable taxidermy shabby chic. Voluptate trust fund American Apparel, keffiyeh Brooklyn ullamco before they sold out seitan banh mi mumblecore YOLO XOXO ad. Crucifix excepteur before they sold out heirloom post-ironic labore, pop-up bicycle rights minim cold-pressed et meh sint four dollar toast Schlitz. Forage migas banh mi fixie deserunt irony. Marfa odio anim, kogi do chambray elit XOXO beard single-origin coffee McSweeney's normcore. Dolor Vice aliquip, leggings selfies Godard Marfa.")
        .appendTo(el);

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

ng = a.directive('plainSunburstControls', function($compile) {
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

ng = a.directive('plainSunburstChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('letterData',doStuff);

        function doStuff() { 
            if(!scope.$parent.letterData) { return }
            updateChart(element, scope.$parent.letterData);
        }

    };

    function updateChart(element,data) {

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


        //////////////////////////////////////////
        // On with the show:
        // just draw the damn thing.

        // Keep track of the node that is currently being displayed as the root.
        var node;

        svg.selectAll("path").remove();

        var realdata = {};
        realdata['letter'] = 'root';
        realdata['children'] = data;

        node = realdata;

        var color = d3.scale.category20c(); 

        // this is where the magic happens
        var path = svg
            .datum(realdata)
            .selectAll("path")
            .data(partition.nodes(node))
            .enter().append("path")
            .attr("d", arc)
            .style("fill", function(d) { 
                if(d.letter=='root') {
                    return '#ccc';
                };
                return color(Math.round(Math.random()*20));
            });

    }

    return {
        link: link,
        restrict: "E",
        scope: {}
    };
});
dir.push(ng);









