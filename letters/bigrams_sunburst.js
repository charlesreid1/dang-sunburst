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

ng = a.directive('bigramSunburstHead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var h1 = $("<h1 />")
            .appendTo(el);

        var b = $("<b />")
            .text("Sunburst: English Language Bigram Frequencies ")
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

ng = a.directive('bigramSunburstControls', function($compile) {
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

ng = a.directive('bigramSunburstChart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('bigramData',doStuff);

        function doStuff() { 
            if(!scope.$parent.bigramData) { return }
            updateChart(element, scope.$parent.bigramData);
        }

    };

    function updateChart(element,data) {
        console.log('updating chart');

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
            }).text("The following sunburst chart contains two-level information, and shows " +
                    "the relative frequencies of bigrams in the English language. From Peter Norvig's web site on English letter frequency counts:")
            .appendTo(col2);


        var quote = $("<blockquote />", {
                "class" : "normal"
            })
            .appendTo(col2);

        var text = $("<p />")
            .text('Below is a table of all 26 × 26 = 676 bigrams; in each cell the orange bar is proportional to the frequency, and if you hover you can see the exact counts and percentage. There are only seven bigrams that do not occur among the 2.8 trillion mentions: JQ, QG, QK, QY, QZ, WQ, and WZ.')
            .appendTo(quote);

        var source = $("<small />")
            .html('<cite><a href="http://norvig.com/mayzner.html">Peter Norvig on English Letter Frequency Counts</a></cite>')
            .appendTo(quote);


        ///////////////////////////////////
        // drop in an alert to let the user know
        // there is a better version of this plot

            var alrt = $("<div />", {
                    "id" : "myAlert",
                    "class" : "alert alert-dismissible alert-warning fade"
                }).appendTo(col2);
            
            var button = $("<button />", {
                    "class" : "close",
                    "data-dismiss" : "alert"
                })
                .text("x")
                .appendTo(alrt);

            var h4 = $("<h4 />")
                .html("This Chart Is Not Optimal!")
                .appendTo(alrt);

            var p = $("<p />")
                .html("There is a better, interactive version of this page available at the <a href='bigrams2.html'>Bigrams Interactive Sunburst Chart</a> page.")
                .appendTo(alrt);

        window.setTimeout(function() {
            $("#myAlert").addClass("in")
        }, 2000);


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

        node = data;

        var N = 26;
        var color = d3.scale.ordinal()
            .domain([0, N-1])
            .range(d3.range(data.length).map(
                    d3.scale.linear()
                    .domain([0, data.length - 1])
                    .range(["steelblue","pink"])
                    .interpolate(d3.interpolateLab))
            );
        var color = d3.scale.category20c();

        // this is where the magic happens
        var g = svg
            .datum(data)
            .selectAll("g")
            .data(partition.nodes(node))
            .enter().append("g");

        var path = g.append("path")
            .attr("d",arc)
            .style("fill",function(d,i) {
                if(d.letter=='root') {
                    return '#ccc';
                } else {
                    return color((d.children ? d : d.parent).letter); 
                }
            });

        var text = g.append("text")
            .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
            .attr("x", function(d) { return y(d.y); })
            .attr("dx", "6") // margin
            .attr("dy", ".35em") // vertical-align
            .text(function(d) { 
                if(d.letter!='root') {
                    if(d.children) {
                        return d.letter;
                    }
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








