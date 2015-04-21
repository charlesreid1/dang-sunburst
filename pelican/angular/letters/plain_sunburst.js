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
            .text("English Language Letter Frequencies ")
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


        // --------------------------
        // start with title and filler text 

        var row = $("<div />",{
            "class" : "row"
        }).appendTo(el);

        var col1 = $("<div />",{
            "class" : "col-md-4",
            "id" : "sunburst_chart"
        }).appendTo(row);

        var col2 = $("<div />",{
            "class" : "col-md-6 col-md-offset-1",
            "id" : "sunburst_text"
        }).appendTo(row);

        var descr = $("<p />", {
            "class" : "normal"
        }).text("The following sunburst chart contains a single level of information, and shows " +
                "the relative frequencies of letters in the English language. From Wikipedia:")
        .appendTo(col2);
        var quote = $("<blockquote />", {
            "class" : "normal"
        })
        .appendTo(col2);
        var text = $("<p />").text('The frequency of letters in text has been studied for use in cryptanalysis, and frequency analysis in particular, dating back to the Iraqi mathematician Al-Kindi (c. 801–873 CE), who formally developed the method (the ciphers breakable by this technique go back at least to the Caesar cipher invented by Julius Caesar, so this method could have been explored in classical times).')
            .appendTo(quote);
        var source = $("<small />").html('<cite><a href="http://en.wikipedia.org/wiki/Letter_frequency">Wikipedia article on Letter Frequency</a></cite>')
            .appendTo(quote);



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
            .value(function(d) { return d.frequency; });

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

        var color = d3.scale.ordinal()
            .domain(data)
            .range(d3.range(data.length).map(
                    d3.scale.linear()
                    .domain([0, data.length - 1])
                    .range(["steelblue","pink"])
                    .interpolate(d3.interpolateLab))
            );

        // this is where the magic happens
        var g = svg
            .datum(realdata)
            .selectAll("g")
            .data(partition.nodes(node))
            .enter().append("g");

        var path = g.append("path")
            .attr("d",arc)
            .style("fill",function(d) {
                if(d.letter=='root') {
                    return '#ccc';
                } else {
                    return color(d.letter);
                }
            });

        var text = g.append("text")
            .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function(d) { return y(d.y); })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .text(function(d) { 
                if(d.letter!='root') {
                    return d.letter; 
                }
            });

          function computeTextRotation(d) {
                return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
          }

    }

    return {
        link: link,
        restrict: "E",
        scope: {}
    };
});
dir.push(ng);









