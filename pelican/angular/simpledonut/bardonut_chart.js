var ng;
dir = [];




//////////////////////////////////////
// Chart Directives
//
// This file defines Angular directives 
// that use D3 to draw charts.
// 





///////////////////////////////////////
// Header Directives:
//
// Print out instructions, title, etc.


ng = a.directive('bardonuthead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#donut_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Donut Picker Chart Example")
            .appendTo(h1);

        h1.appendTo(dir);


        var p = $("<p />", { 
            "class" : "normal" })
            .html("The following charts show statistics about death records, classified by ICD 10 code. Select an ICD 10 code to view statistics about gender and manner of death.")
            .appendTo(dir);
        

    }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);






///////////////////////////////////////////////
// Chart Controls Directives

ng = a.directive('bardonutcontrols', function($compile) {

    function link(scope, element, attr) { 

        // wait to build the buttons until we've loaded the data,
        // since the buttons come from the data.
        scope.$parent.$watch('pickerData',doStuff);

        function doStuff() { 
            if(!scope.$parent.pickerData) { return; }
            buildButtons(element, scope.$parent);
        }


    };

    function buildButtons(element,pscope) {

        var mydiv = "div#donut_controls";

        var el = $(mydiv);

        var div = $("<div />");



        // ------------------------------------
        // Add ICD 10 code buttons
        //
        var btn_grp = $("<div />", {
                "id" : "codebtns",
                "class" : "btn-group"
            });

        for( var i = 0; i < pscope.pickerData.length; i++ ) {
            var this_code = pscope.pickerData[i]['code']
            var code = $("<a />", {
                            "class" : "btn btn-code btn-large btn-primary",
                            "changecode" : "",
                            "id" : "btn_"+this_code,
                            "code" : this_code,
                        })
                        .html( this_code )
                        .appendTo(btn_grp);
        }


        // to make buttons in this btn group active, 
        // you have to use D3's classed() method 
        // after you add the elements to the document
        // (i.e., after you call $compile)

        angular.element(el).append($compile(btn_grp)(pscope));


        pscope.updateCode = function() {

            // -----------------------------
            // make button for active icd 10 code

            d3.selectAll("a.btn-code").classed('active',false);
            var btnlabel = "a#btn_"+pscope.icd10code;
            d3.selectAll(btnlabel).classed('active',true);

        };

        pscope.$watch('icd10code',pscope.updateCode);


    }
    return {
        restrict: "E",
        link: link,
        scope: {}
    }
});
dir.push(ng);


//////////////////////////////////
// Action directive:
// What to do when the user changes the ICD 10 code
// by clicking an ICD 10 code button

ng = a.directive("changecode", function($compile) {

    return function(pscope, element, attrs){
        element.bind("click", function(){

            // first, update the scope variable 
            // that holds the current icd 10 code
            // (no need to load any new data)


            // This is the ICD 10 code the user has selected.
            var this_code = attrs['code'];
            var this_description = pscope.icd10codes_all[this_code]

            //console.log('Changed icd 10 code, updating description:');
            //console.log(this_code);
            //console.log(this_description);


            // !!!!!!!!!!!!!!!!!!!!!!!!
            // NOTE
            // The lines below - this $apply() method - 
            // this is the way you change the variable
            // at the controller level, and get the 
            // various watchers to detect changes.
            // !!!!!!!!!!!!!!!!!!!!!!!!!!
            pscope.$apply(function() {
                pscope.icd10code = this_code; 
            });

            pscope.$apply(function() {
                pscope.description = this_description;
            });


            //// This is some weak-sauce, 
            //// its not even changing value of variable
            //pscope.update_icd10code(attrs['code']);
            //// ...
            //// .......
            //// seriously.
            //// all we needed was just
            ////   pscope.$apply()
            //// 
            //// smh.




            // then run the donut chart update function
            pscope.updateDonut();

            // then run the button controllers update function
            pscope.updateCode();

        });
    }

});






///////////////////////////////////////////////
// Panels: 
// Display useful information in a pretty box


ng = a.directive('bardonutpanel', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        var pscope = scope.$parent;

        // --------------------------
        // add display for details 
        
        // assemble the tags, 
        // then compile the html
        // select element of interest with angular.element
        // and append the compiled tags
        //
        var br = $("<br />").appendTo(el);

        var panel = $("<div />", {
                "class" : "panel panel-primary",
                "id" : "first"
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
            .html("ICD 10 Code: [[icd10code]]")
            .appendTo(maindiv);

        var de = $("<p />", { 
            "class" : "lead" })
            .html("Description: [[description]]")
            .appendTo(maindiv);

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
// Donut Picker Chart
// 
// This is the actual donut chart, of gender ratios.

ng = a.directive('donutpickerchart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('pickerData',doStuff);

        function doStuff() { 
            if(!scope.$parent.pickerData) { return; }
            buildDonut(element, scope.$parent);
        }


    };

    function buildDonut(element,pscope) {

        var mydiv = "div#donutpicker_chart";

        /////////////////////////////////////////
        // Create chart
        //
        // data has not been loaded yet.
        // start by initializing variables 
        // that don't depend on the data. 

        var el = element[0];
        $(el).empty();


        ///////////////////////////////////
        // now draw the svg with d3

        // ---------------
        // the chart itself:

        var margin = {
            top:    10, 
            right:  10, 
            bottom: 10, 
            left:   10
        };

        var w = 300,
            h = 300;

        var width   = w - margin.right - margin.left,
            height  = h - margin.top   - margin.bottom;
        
        var radius = Math.min(width, height) / 2;
        
        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);
        
        var y = d3.scale.sqrt()
            .range([0, radius]);
        
        var svg = d3.select(mydiv)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");


        // ---------------
        // chart-specific, 
        // data-independent variables
        //
        // Example: 
        // * sort method
        // * tween function
        // * colors (maybe)
        //

        // This would be nice. but, donutMale and donutFemale aren't working.
        // And once they are working, they aren't positioned correctly.
        // And adding them as d3 text elements makes them... not appear.
        // Just shoe-horning in the value on the pie chart label. Better anyway.
        /////////var text = svg.append("text")
        /////////    .attr("class", "title")
        /////////    .attr('transform', 'translate(90,0)') 
        /////////    .attr("x", w - 70)
        /////////    .attr("y", 10)
        /////////    .attr("font-size", "12px")
        /////////    .attr("fill", "#404040")
        /////////    .html("Females: [[donutFemale]]<br />Males: [[donutMale]]");


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

        // if animating, more stuff goes here.

        pscope.updateDonut = function() { 

            var all_data = pscope.pickerData;

            // ----------------------------------
            // Get pie chart data
            //
            // Here, we have all donut data
            // available to us. 
            //
            // We use the currently-selected ICD 10 code 
            // to filter which donut data is being plotted. 
            //
            // Where to keep track of current code?
            // In the controller (available via pscope).
            // pscope.icd10code
            //
            var code; 
            var data;
            for( var i=0; i < all_data.length; i++ ) {

                // set excpetion handling:
                // if no icd10code is set, problems occur.
                if(all_data[i]['code'] == pscope.icd10code) {
                    code = all_data[i]['code'];
                    data = all_data[i]['donut'];
                    break;
                }
            }
            // finished; use data
            // ---------------------------------



            // ----------------------------
            // Start with counts of 
            // donut chart males/females
            
            var donutFemale = 0,
                donutMale = 0;
            
            for(var i=0; i<data.length; i++) { 
                if(data[i].label=="M"){
                    donutMale = data[i].value;
                }
                if( data[i].label=="F") {
                    donutFemale = data[i].value;
                }
            }

            ////////////////
            // UUUUGGGGGGGGHHHHHHHHHHHH
            //
            // can't use pscope.$apply() here.
            //
            // ?????
            // 
            // also, this does not update these variables.
            // WTFH
            //pscope.donutFemale = donutFemale;
            //pscope.donutMale = donutMale;

            // ----------------------------


            var g = svg.datum(data)
                    .selectAll("g")
                    .data(data)
                    .enter();


            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { 
                    return +d.value;
                });

            var g = svg.selectAll(".arc")
                .data(pie(data))
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

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { 
                    return colors[d.data.label]; 
                });
            

            // clear away old labels
            svg.selectAll("text").remove();


            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function(d) { 
                    if (d.data.value > 0) {
                        if(d.data.label=="M") {
                            fancylabel = "Males";
                        } else if(d.data.label=="F") {
                            fancylabel = "Females";
                        }
                        var biglabel = fancylabel + ": " + d.data.value;
                        return biglabel; 
                    }
                });

        }



        // ------------------
        // if you build it, 
        // you must update it.
        pscope.updateDonut();

        pscope.$watch('icd10code',pscope.updateDonut);

    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);



///////////////////////////////////////////////
// Manner of Death Bar Chart
// 
// This is a bar chart for manner of death. 

ng = a.directive('modbarchart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('pickerData',doStuff);
        scope.$parent.$watch('icd10code',doStuff);

        function doStuff() { 
            if(!scope.$parent.pickerData) { return; }
            if(!scope.$parent.icd10code) { return; }
            buildBar(element, scope.$parent);
        }


    };

    function buildBar(element,pscope) {
    
        //
        // If you draw any parts of the bar plot 
        // outside of the updateBar() function,
        // the bar plot will not actually change.
        //

        pscope.updateBar = function() { 

            //console.log('in update bar');

            var mydiv = "div#modbar_chart";

            /////////////////////////////////////////
            // Create chart
            //
            // data has not been loaded yet.
            // start by initializing variables 
            // that don't depend on the data. 

            var chart = $(mydiv);
            chart.empty();

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

            var w = 400;
            var h = 400;

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
            
            var svg = d3.select(mydiv)
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            /////////////////
            // Data-specific stuff


            // Start by loading the data
            //
            var all_data = pscope.pickerData;

            var code; 
            var data;
            for( var i=0; i < all_data.length; i++ ) {

                // set excpetion handling:
                // if no icd10code is set, problems occur.
                if(all_data[i]['code'] == pscope.icd10code) {
                    code = all_data[i]['code'];
                    data = all_data[i]['modbars'];
                    break;
                }

            }

            //// data looks good
            //console.log(data);

            if( data!=null ){


                // if you wanna show categories that are zero,
                // modify your data. too complicated to fill in here.

                x.domain(data.map(function(d) { return d.label; }));

                y.domain([0, d3.max(data, function(d) { return d.value; })]);

                //svg.selectAll("path").remove();

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
                        .attr("dy", "3.5em")
                        .text("Number of Death Records");


                var color2 = d3.scale.category20b();

                svg.selectAll(".bar")
                    .data(data)
                  .enter().append("rect")
                    .attr("class", "bar")
                    .attr("fill",function(d,i) { 
                        return color2(d.label) 
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

            }

        }

        // ------------------
        // if you build it, 
        // you must update it.
        pscope.updateBar();

    }


    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);
