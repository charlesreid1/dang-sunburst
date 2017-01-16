/*
 * author: charles reid
 
var data = [
  {
    groupName: 'group1', // optional, can be used for styling
    values: [
      {label: "asdf", value: 21},
      {label: "qwerty", value: 19},
      {label: "woieru", value: 11},
      {label: "nxcb", value: 13}
    ]
  },
  {
    groupName: 'group2', // optional, can be used for styling
    values: [
      {label: "asdf", value: 21},
      {label: "qwerty", value: 19},
      {label: "woieru", value: 11},
      {label: "nxcb", value: 13}
    ]
  }
];

 */
var BarChart = {

    defaultConfig: {
        containerClass: 'bar-chart',
        w: 600,
        h: 600,
        maxValue: 0,
        color: d3.scale.category10(),
        axisLine: true,
        axisText: true,
        axisJoin: function(d, i) {
          return d.className || i;
        },
        transitionDuration: 300
    },
    chartSetup: function() {

        // default config
        var cfg = Object.create(BarChart.defaultConfig);

        function bar(selection) {

          selection.each(function(both_data) {

            var code = both_data[0]['className'];
            var data = both_data[0]['axes']

            var container = d3.select(this);

            console.log('from a special place:');
            console.log(data);

            //container.empty();

            //container.classed(cfg.containerClass, 1);

            ///////////////////////////////////
            // now draw the svg with d3

            // ---------------
            // the chart itself:

            var margin = {
                top: 10, 
                bottom: 100,

                right: 30, 
                left: 50
            };

            var w = cfg.w;
            var h = cfg.h;

            var barwidth  = w - margin.left - margin.right;
            var barheight = h - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, barwidth], .1);
            
            var y = d3.scale.linear()
                .range([barheight, 0]);
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10)
            
            var svg = container.append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            x.domain(data.map(function(d) { return d.label; }));

            y.domain([0, d3.max(data, function(d) { return d.value; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", function(d,i) {
                    return "translate(0,"+ (barheight) + ")";
                })
                .call(xAxis)
                .selectAll("text")  
                    .attr("class", "x axis label")
                    .attr("transform", "rotate(90)" )
                    .style("text-anchor", "start")
                    .attr("dx", "0.5em")
                    .attr("dy", "-1em");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                    .attr("class", "y axis label")
                    .attr("transform", "rotate(90)")
                    .style("text-anchor", "start")
                    .attr("y", 6)
                    .attr("dy", "3.5em");
                    //.text("Number of Death Records");

            var color = d3.scale.category10();
            svg.selectAll(".bar")
                .data(data)
              .enter().append("rect")
                .attr("class", "bar")
                .attr("fill",function(d,i) { 
                    ///////////////////////////////////
                    // uuuugggghhhhhh fiixxxxx
                    return color(d.label) 
                    ///////////////////////////////////
                })
                .attr("x", function(d) { return x(d.label); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { 
                    var toptobottom = (barheight);
                    var toptobartop = y(d.value);
                    var ht = toptobottom - toptobartop
                    return ht;
                });
            
            function type(d) {
              d.value = +d.value;
              return d;
            }

            // else: "No Data" label

          });
        }

        bar.config = function(value) {
            if(!arguments.length) {
                return cfg;
            }
            if(arguments.length > 1) {
                cfg[arguments[0]] = arguments[1];
            }
            else {
              d3.entries(value || {}).forEach(function(option) {
                cfg[option.key] = option.value;
              });
            }
            return bar;
        };

        return bar;

    },

    draw: function(id, d, options) {
        var chart = BarChart.chart().config(options);
        var cfg = chart.config();

        d3.select(id).select('svg').remove();
        d3.select(id)
          .append("svg")
          .attr("width", cfg.w)
          .attr("height", cfg.h)
          .datum(d)
          .call(chart);
    }


};
