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


ng = a.directive('bubbleshead', function($compile) {

    function link(scope, element, attr) {

        var el = element[0];

        $(el).empty();

        var dir = $("div#bubbles_title");

        var h1 = $("<h1 />");

        var b = $("<b />")
            .text("bubble chart example")
            .appendTo(h1);

        h1.appendTo(dir);


        var p = $("<p />", { 
            "class" : "normal" })
            .html("A fancy little bubble chart.")
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

ng = a.directive('bubblescontrols', function($compile) {

    function link(scope, element, attr) { 

        // wait to build the buttons until we've loaded the data,
        // since the buttons come from the data.
        scope.$parent.$watch('bubblesdata',doStuff);

        function doStuff() { 
            if(!scope.$parent.bubblesdata) { return; }
            buildButtons(element, scope.$parent);
        }


    };

    function buildButtons(element,pscope) {

        var mydiv = "div#bubbles_controls";

        var el = $(mydiv);

        var div = $("<div />");


        // ------------------------------------
        // Add ICD 10 code buttons
        //
        var btn_grp = $("<div />", {
                "id" : "codebtns",
                "class" : "btn-group"
            });

        for( var i = 0; i < pscope.bubblesdata.length; i++ ) {
            var this_code = pscope.bubblesdata[i]['labels']
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




            //// then run the donut chart update function
            //pscope.updatebubbles();

            // then run the button controllers update function
            pscope.updateCode();

        });
    }

});






///////////////////////////////////////////////
// Panels: 
// Display useful information in a pretty box


ng = a.directive('bubblespanel', function($compile) {


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
// bubbles Chart
// 
// This is the actual donut chart, of gender ratios.

ng = a.directive('bubbleschart', function($compile) {

    function link(scope, element, attr) {

        scope.$parent.$watch('bubblesdata',doStuff);

        function doStuff() { 
            if(!scope.$parent.bubblesdata) { return; }
            buildbubbles(element, scope.$parent);
        }


    };

    function buildbubbles(element,pscope) {

        var mydiv = "div#bubbles_chart";


        var diameter = 500, //max size of the bubbles
            color    = d3.scale.category20b(); //color category

        var bubble = d3.layout.pack()
            .sort(null)
            .size([diameter, diameter])
            .padding(1.5);
        
        var svg = d3.select(mydiv).append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");



        pscope.updatebubbles = function() { 

            console.log('update bubbles');

            var all_data = pscope.bubblesdata;

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
                if(all_data[i]['labels'] == pscope.icd10code) {
                    code = all_data[i]['labels'];
                    data = all_data[i]['values'];
                    break;
                }
            }

            // finished; use data
            // ---------------------------------

            svg.selectAll("circle").remove()
            svg.selectAll(".bubblelabels").remove()

            /////////////////////////////////////////
            // Create chart
            //
            //

            //bubbles needs very specific format, convert data to this.
            var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

            var g = svg.selectAll("circle")
                    .data(nodes, function(d) {
                        return d.label;
                    })
                    .enter();

            g.append("circle")
                    .attr("r", function(d) {
                        return +d.value*10;
                    })
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
                    .attr("class","node")
                    .style("fill", function(d) { return color(d.label); });
            g.append("text")
                    .text(function(d){ 
                        if( +d.value > 0 ) {
                            return d.label; 
                        }
                    })
                    .attr("class","bubblelabels")
                    .attr("x", function(d){ return d.x; })
                    .attr("y", function(d){ return d.y; })

            /*
            //format the text for each bubble
            circles.append("text")
                //.attr("x", function(d){ return d.x; })
                //.attr("y", function(d){ return d.y; })
                .attr("text-anchor", "middle")
                .text(function(d){ 
                    console.log(d.label);
                    return d.label; })
                .style({
                    "color" : "red",
                    "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                    "font-size": "12px"
                });
            */


        }

        pscope.$watch('icd10code',pscope.updatebubbles);
    }

    return {
        link: link,
        restrict: "E",
        scope: { }
    };
});
dir.push(ng);




// BubbleChart = function(){
// 
//     var diameter;
// 
//     /**
//      * Create a bubble chart
//      * 
//      * @param {data} array of objects with name/value keys
//      * @param {elm} string the element which to put this chart
//      * @param {size} object with width/height keys 
//      * @param {pallet} array | undefined of hex codes for the bubble colors
//      */
//     this.createChart = function(data, elm, size, pallet) {
//         
//         pallet = pallet || ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
//         var domain = [],
//             sorted = [];
//         
//         data = data.sort(function(a, b){ return b.value - a.value});
//         
//         
//         for(var i=0; i<data.length; ++i){
//             domain.push(data[i].value);
//         }
//         
//         var diameter = Math.min(size.width, size.height),
//             color  = d3.scale.ordinal().domain(domain).range(pallet);
// 
//         var bubble = d3.layout.pack()
//             .sort(null)
//             .size([size.width, size.height])
//             .padding(1.5);
// 
//         var svg = d3.select(elm).append("svg")
//             .attr("width", size.width)
//             .attr("height", size.height)
//             .attr("class", "bubble");
// 
//         nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });
// 
//         var circles = svg.selectAll("circle")
//             .data(nodes, function(d){return d.name;})
//             .enter()
//             .append("circle")
//             .attr("r", 0)
//             .style("fill", function(d) { console.log(d); return color(d.value); })
//             .attr("cx", function(d){ return d.x;})
//             .attr("cy", function(d){ return d.y;})
//             .attr("class", "node");
// 
//         circles.transition()
//             .duration(1000)
//             .attr("r", function(d) { return d.r; })
//             .each('end', function(){ display_text();});
//         
//         function display_text() {
//             var text = svg
//                 .selectAll(".text")
//                 .data(nodes, function(d){return d.name;});
// 
//             text.enter().append("text")
//                 .attr("class", "text")
//                 .style("font-size", "10px")
//                 .attr("x", function(d) { return d.x; })
//                 .attr("y", function(d) { return d.y; })
//                 .attr("dy", ".3em")
//                 .attr("text-anchor", "middle")
//                 .text(function(d) { return d.name.substring(0, d.r / 3); });
//         }
// 
//         function hide_text() {
//             var text = svg.selectAll(".text").remove();
//         }
//         
//         this.changeData = function(newData){
//             hide_text();
//             nodes = bubble.nodes({children:newData}).filter(function(d) { return !d.children; });
//             circles = circles.data(nodes);
//             circles.transition().duration(1000)
//             .attr("r", function(d){ return d.r;})
//             .attr("cx", function(d){ return d.x;})
//             .attr("cy", function(d){ return d.y;})
//             .each('end', function(){ display_text();});
//         }
//     }
// 
//     d3.select(self.frameElement).style("height", diameter + "px");
// 
//     return this;
// };
// 
// 
// */
