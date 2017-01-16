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


ng = a.directive('radar1head', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#radar1_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("Radar Chart Example")
            .appendTo(h1);

        h1.appendTo(dir);


        var p = $("<p />", { 
            "class" : "normal" })
            .html("A fancy little radar chart.")
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

ng = a.directive('radar1controls', function($compile) {

    function link(scope, element, attr) { 

        // wait to build the buttons until we've loaded the data,
        // since the buttons come from the data.
        scope.$parent.$watch('radar1data',doStuff);

        function doStuff() { 
            if(!scope.$parent.radar1data) { return; }
            buildButtons(element, scope.$parent);
        }


    };

    function buildButtons(element,pscope) {

        var mydiv = "div#radar1_controls";

        var el = $(mydiv);

        var div = $("<div />");



        // ------------------------------------
        // Add ICD 10 code buttons
        //
        var btn_grp = $("<div />", {
                "id" : "codebtns",
                "class" : "btn-group"
            });

        for( var i = 0; i < pscope.radar1data.length; i++ ) {
            var this_code = pscope.radar1data[i]['code']
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


ng = a.directive('radar1panel', function($compile) {

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
// radar1 Chart
// 
// This is the actual donut chart, of gender ratios.

ng = a.directive('radar1chart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('radar1data',doStuff);

        function doStuff() { 
            if(!scope.$parent.radar1data) { return; }
            buildDonut(element, scope.$parent);
        }


    };

    function buildDonut(element,pscope) {

        var mydiv = "div#radar1_chart";

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






        /////////////////////////////////////////////////////
        // update radar chart
        pscope.updateDonut = function() {

            var all_data = pscope.radar1data;


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
                    data = all_data[i]['modbars'];
                    break;
                }
            }

            //console.log(data);

            // finished; use data
            // ---------------------------------




            // --------------------------------------
            // Now we are ready to draw the damn chart.

            var cfg = {
                radius: 5,
                w: w,
                h: h,
                factor: 1,
                factorLegend: .85,
                levels: 3,
                maxValue: 0,
                radians: 2 * Math.PI,
                opacityArea: 0.5,
                ToRight: 5,
                TranslateX: 80,
                TranslateY: 30,
                ExtraWidthX: 100,
                ExtraWidthY: 100,
                color: d3.scale.category10()
            };

            cfg.maxValue = Math.max(cfg.maxValue, d3.max(data.map(function(o){return o.value;})));
            var allAxis = (data.map(function(i, j){ return i.label}));
            var total = allAxis.length;
            var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
            var Format = d3.format('%');

            d3.select(mydiv).select("svg").remove();

            //console.log(allAxis);

            //Circular segments
            for(var j=0; j<cfg.levels-1; j++){
                var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
                svg.selectAll(".levels")
                    .data(allAxis)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                    .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                    .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
                    .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
                    .attr("class", "line")
                    .attr("class", "mylines")
                    .style("stroke", "grey")
                    .style("stroke-opacity", "0.75")
                    .style("stroke-width", "0.3px")
                    .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
            }
            
            //Text indicating at what % each level is
            for(var j=0; j<cfg.levels; j++){
                var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
                svg.selectAll(".levels")
                    .data([1]) //dummy data
                    .enter()
                    .append("svg:text")
                    .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
                    .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
                    .attr("class", "legend")
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px")
                    .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
                    .attr("fill", "#737373")
                    .text(Format((j+1)*cfg.maxValue/cfg.levels));
            }

            var axis = svg.selectAll(".axis")
                    .data(allAxis)
                    .enter()
                    .append("g")
                    .attr("class", "axis");

            axis.append("line")
                .attr("x1", cfg.w/2)
                .attr("y1", cfg.h/2)
                .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-width", "1px");

            axis.append("text")
                .attr("class", "legend")
                .text(function(d){return d})
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .attr("dy", "1.5em")
                .attr("transform", function(d, i){return "translate(0, -10)"})
                .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
                .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});



            series = 0;

            // for each series...
            //
            //
            // what is this stupid nodes thing 
            // and where does it come from
            // and why doesn't it show up 
            // because this is the key to getting this 
            // whole stupid chart to work

            dataValues = [];

            //svg.selectAll(".mylines")
            svg.selectAll(".nodes")
                .data(y, function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(i, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                        cfg.h/2*(1-(parseFloat(Math.max(i, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                        //
                        // j.value is undefined, causing nans.
                        //cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                        //cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                });
            dataValues.push(dataValues[0]);


            console.log(dataValues);


            svg.selectAll(".area")
                .data(dataValues)
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-series"+series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points",function(d) {
                        var str="";
                        for(var pti=0;pti<d.length;pti++){
                            str=str+d[pti][0]+","+d[pti][1]+" ";
                        }
                        return str;
                    })
                .style("fill", function(j, i){return cfg.color(series)})
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d){
                        z = "polygon."+d3.select(this).attr("class");
                        svg.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1); 
                        svg.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);
                    })
                .on('mouseout', function(){
                        svg.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
                    });





            //svg.selectAll(".mylines")
            svg.selectAll(".nodes")
                .data(y,function(d) {
                    console.log('hello?');
                })
                .enter()
                .append("svg:circle")
                .attr("class", "radar-chart-series"+series)
                .attr('r', cfg.radius)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                        console.log('hello?');
                        dataValues.push([
                            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
                            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                        ]);
                        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                    })
                .attr("cy", function(j, i){
                        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                    })
                .attr("data-id", function(j){return j.axis})
                .style("fill", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d){
                        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                        newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                        
                        tooltip
                            .attr('x', newX)
                            .attr('y', newY)
                            .text(Format(d.value))
                            .transition(200)
                            .style('opacity', 1);
                            
                        z = "polygon."+d3.select(this).attr("class");
                        svg.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", 0.1); 
                        svg.selectAll(z)
                            .transition(200)
                            .style("fill-opacity", .7);
                    })
                .on('mouseout', function(){
                        tooltip
                            .transition(200)
                            .style('opacity', 0);
                        svg.selectAll("polygon")
                            .transition(200)
                            .style("fill-opacity", cfg.opacityArea);
                    })
                .append("svg:title")
                .text(function(j){return Math.max(j.value, 0)});

        }

        pscope.$watch('icd10code',pscope.updateDonut);

    }



        /*




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


    */



    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);



