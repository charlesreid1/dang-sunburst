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
            


            x.domain(data.map(function(d) { return d.label; }));

            y.domain([0, d3.max(data, function(d) { return d.value; })]);

            container.append("g")
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

            container.append("g")
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
            container.selectAll(".bar")
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




/*
 * A special bar chart 
 * from Mike Bostock
 *
 * http://bl.ocks.org/mbostock/3885304

original data is a TSV in this format:

 letter    frequency
 A    .08167
 B    .01492
 C    .02782
 D    .04253
 E    .12702
 F    .02288
 G    .02015
 H    .06094
 I    .06966
 J    .00153
 K    .00772
 L    .04025
 M    .02406
 N    .06749
 O    .07507
 P    .01929
 Q    .00095
 R    .05987
 S    .06327
 T    .09056
 U    .02758
 V    .00978
 W    .02360
 X    .00150
 Y    .01974
 Z    .00074


Alternative 1:
(Use this one!)
--------------
Single series/univariate bar chart:

 [
    {
        'letter' : 'A',
        'frequency' : 0.08167
    },
    {
        'letter' : 'B',
        'frequency' : 0.01492
    }
    ...
]

(A bit verbose, but good to stick with this
because it's a structure D3 likes.)

Alternative 2: 
(XXXXXX don't use XXXXXXX)
----------------

{
    'letter' : ['A','B','C','D', .... ],
    'frequency' : [0.08167, 0.01492, ... ]
}

More compact, but requires some untangling.
Not keen on doing this with Javascript.

 */
var BostockBarChart = {

    defaultConfig: {
        containerClass: 'bostock-bar-chart',
        parentDiv: 'bar2_chart',
        w: 400,
        h: 400,
        maxValue: 0,
        color: d3.scale.category10(1),
        hovercolor: d3.scale.category10(2)
    }, //end defaultConfig

    /* static chart, easy peasy */
    chart: function() {


        // default config
        var cfg = Object.create(BostockBarChart.defaultConfig);


        function bar(selection) {

            data = selection.data()[0];

            var container = d3.select(this);

            // ---------8<-----------
            // commence copy and paste from 
            // http://bl.ocks.org/mbostock/3310560

            var margin = {top: 20, right: 30, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1, 0.2);

            var y = d3.scale.linear()
                .range([height, 0]);

            var svg = container.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // function(error, data) 
            //   if (error) throw error;
            
            x.domain( data.map(function(d) { return d.letter; }));
            y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.svg.axis().scale(x).orient("bottom"));
            
            svg.append("g")
                .attr("class", "y axis")
                .call(d3.svg.axis().scale(y).orient("left"));
            /*
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", "0.71em")
                  .attr("text-anchor", "end")
                  .text("Frequency");
           */ 

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.label); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d.value); })
                  .attr("height", function(d) { return height - y(d.value); });


            svg.selectAll(".bar")
                .attr("fill","steelblue");
            svg.selectAll(".bar:hover")
                .attr("fill","darkred");

            function type(d) {
                d.frequency = +d.frequency;
                return d;
            }

            // ---------8<-----------

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

    }, //end chart()

    draw: function(id, d, options) {
        var chart = BostockBarChart.chart().config(options);
        var cfg = chart.config();

        d3.select(id).select('svg').remove();
        d3.select(id)
          .append("svg")
          .attr("width", cfg.w)
          .attr("height", cfg.h)
          .datum(d)
          .call(chart);
    }

}//end BostockBarChart
























