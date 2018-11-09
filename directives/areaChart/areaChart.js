'use strict';
angular.module('cyient.areachart', [])
.directive('areaChart', ['$window', '$log', function($window, $log) {
    return {
        scope: {
            compressedMode: '=',
            tripVals: "=",
            xlabel: "=",
            ylabel: "=",
            bandMin: "=",
            bandMax: "=",
            height: "@"
        },
        restrict: "AE",
        templateUrl: "directives/areaChart/areachart.html",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.$watch("tripVals", function(newVal, oldVal) {
                render();
            }, true);

            angular.element($window).bind('resize', function() {
                if ($window.innerWidth >= 1024) {
                    render();
                    scope.$digest();
                }
            });

            function render() {

                if (!scope.tripAvgVals && !scope.siteAvgVals && !scope.tripVals) {
                    return;
                }

                d3.select(container).select("svg").text("");

                // Storing key names in variables makes them changing
                // easy later.
                // var tripsAvgXKey = 'xValue', tripsAvgYKey = 'yValue';
                var siteAvgXKey  = 'xValue', siteAvgYKey  = 'yValue';
                // var tripsXKey    = 'xValue', tripsYKey    = 'yValue';

                var containerWidth;
                var barMaxWidth = 10;
                /*
                 * Multiple area-charts in the same page are having same clip ID.
                 * So, prevent the clash by generating it randomly.
                 */
                var clipId = "area-clip-" + _.random(0, 10000);

                // Hacky way of calcuating the width.
                // Find a way to remove the hardcoded number '200'
                if (scope.compressedMode) {
                    containerWidth = $(elem).width() - 250;
                } else {
                    containerWidth = $(elem).width() - 200;
                }

                var margin  = {top: 10, right: 10, bottom: 150, left: 55},
                    margin2 = {top: 180, right: 10, bottom: 20, left: 55},
                    width   = containerWidth + 100,
                    height  = 300 - margin.top - margin.bottom,
                    height2 = 300 - margin2.top - margin2.bottom;

                if (!scope.compressedMode) {
                    height  = height - 10;
                    height2 = height2 - 10;
                }

                if (!scope.compressedMode) {
                	margin2.top += 30;
                	height += 50;
                }

                

                var x  = d3.scale.linear().range([0, width]),
                    x2 = d3.scale.linear().range([0, width]),
                    y  = d3.scale.linear().range([height, 0]),
                    y2 = d3.scale.linear().range([height2, 0]);

                var count = 5;

                if(scope.compressedMode){
                    var xAxis  = d3.svg.axis()
                                .scale(x).orient("bottom").outerTickSize(0)
                                .ticks(5)
                                .tickFormat(function(){
                                    count = count - 1;
                                    return count+"hrs";
                                })
                               
                }  else{
                    var xAxis  = d3.svg.axis()
                                .scale(x).orient("bottom").outerTickSize(0)
                                .ticks(0)
                } 
                
                var xAxisCount = 31;
                var xAxis2 = d3.svg.axis()
                            .scale(x2).orient("bottom").outerTickSize(0)
                            .ticks(30)
                            .tickFormat(function(d) { 
                                xAxisCount = xAxisCount - 1;
                                return xAxisCount;
                            })
                            
                var yAxis  = d3.svg.axis().scale(y).orient("left").outerTickSize(0)
                                    .ticks(scope.compressedMode ? 5 : 6)
                                    .tickFormat(function(d){
                                        var num = d;
                                        if (num >= 1000000000) {
                                            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                                         }
                                         if (num >= 1000000) {
                                            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                                         }
                                         if (num >= 1000) {
                                            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                                         }
                                         return num;
                                    })
                
                var brush = d3.svg.brush()
                    .x(x2)
                    .on("brush", brushed)
                    .extent([0.95, 0.05]);

                // define line
                // var line = d3.svg.line()
                //         .interpolate("monotone")
                //         .x(function(d) { return x(d[siteAvgXKey]) })
                //         .y(function(d) { return y(d[siteAvgYKey])    });

                var line2 = d3.svg.line()
                  .interpolate("monotone")
                  .x(function(d) { return x2(d[siteAvgXKey]) })
                  .y(function(d) { return y2(d[siteAvgYKey]) });


                var svg = d3.select(container).select("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                    svg.append("defs")
                    .append("clipPath")
                        .attr("id", clipId)
                      .append("rect")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", width)
                        .attr("height", height);

                var focus = svg.append("g")
                    .attr("class", "focus-cnt")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var focusGraphs = focus.append("g")
                    .attr("class", "focus-graphs-cnt")
                    .attr( "clip-path", "url(#" + clipId + ")" );

                var context = svg.append("g")
                    .attr("class", "context-cnt")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

                if(scope.compressedMode){
                    var labelx = scope.xlabel+" (last 5 hrs)";
                    var xAxisLabel = focus.append("text")
                        .attr("class", "label-text")
                        .style("text-anchor", "middle")
                        .text(labelx)
                        .attr("transform", function() {
                            var trWidth  = width / 2;
                            var trHeight = scope.compressedMode ? (height + 27) : (height + 65);
                            return "translate(" + trWidth + "," + trHeight + ")";
                        });
                } else{
                    var labelx = scope.xlabel+" (last 30 days)";
                    var xAxisLabel = focus.append("text")
                        .attr("class", "label-text")
                        .style("text-anchor", "middle")
                        .text(labelx)
                        .attr("transform", function() {
                            var trWidth  = width / 2;
                            var trHeight = scope.compressedMode ? (height + 27) : (height + 145);
                            return "translate(" + trWidth + "," + trHeight + ")";
                        });
                }
                

                var yAxisLabel = svg.append("text")
                    .attr("class", "label-text")
                    .attr("dy", "3em")
                    .style("text-anchor", "middle")
                    .text(scope.ylabel)
                    .attr("transform", function () {
                        var trWidth  = scope.compressedMode ? -20 : -30;
                        var trHeight = height / 2;
                        var rAngle   = -90;
                        return "translate(" + trWidth + "," + trHeight + ")"
                                + "rotate(" + rAngle + ")";
                    });

               
                x.domain(d3.extent(
                    [].concat(
                        scope.tripVals.map(function(d) { 
                            return d[siteAvgXKey]; 
                        })
                    )
                ));

                y.domain([0, d3.max(
                    [].concat(
                        scope.tripVals.map(function(d) { return d[siteAvgYKey] }),
                        [scope.bandMax]
                    )
                )]); // +5 to prevent points getting cut
                x2.domain(x.domain());
                y2.domain(y.domain());

                var tripsGroup = focusGraphs.append("g")
                    .attr("class", "trips-grp");
                
                // define line
                var avgLine = d3.svg.line()
                    .interpolate("monotone")
                    .x(function(d) { return x(d[siteAvgXKey]) })
                    .y(function(d) { return y(d[siteAvgYKey]) });

                var siteAvgLine = tripsGroup.append("path")
                    .datum(scope.tripVals)
                    .attr("class", "site-avg-line")
                    .attr("d", avgLine)
                    .attr("fill", "#4bb3ba")

                var totalLength = siteAvgLine.node().getTotalLength();
                var dashing = "2, 2";
                // var dashLength = dashing
                //     .split(/[\s,]/)
                //     .map(function (a) { return parseFloat(a) || 0 })
                //     .reduce(function (a, b) { return a + b });

                // //How many of these dash patterns will fit inside the entire path?
                // var dashCount = Math.ceil( totalLength / dashLength );

                // //Create an array that holds the pattern as often so it will fill the entire path
                // var newDashes = new Array(dashCount).join( dashing + " " );
                // //Then add one more dash pattern, namely with a visible part of length 0 (so nothing) and a white part
                // //that is the same length as the entire path
                // var dashArray = newDashes + " 0, " + totalLength;

                // siteAvgLine
                //     .attr("stroke-dashoffset", totalLength)
                //         .attr("stroke-dasharray", dashArray)	//This is where it differs with the solid line example
                //         .transition().duration(2000).ease("linear")
                //         .attr("stroke-dashoffset", 0);

                             
                focusGraphs.append("g")
                    .selectAll("circle")
                    .data(scope.tripVals)
                    .enter().append("circle")
                    .attr("class", "trip-circles")
                    .attr("r", 3.5)
                    .attr("cx", function(d) { return x(d[siteAvgXKey])})
                    .attr("cy", function(d) {return y(d[siteAvgYKey])})
                    .on("mouseover", function(d) {
                        var xVal = d[siteAvgXKey];
                        showHoverNodes(xVal);
                        scope.$apply();
                    })
                    .on("mouseout", function(d) {
                        hideHoverNodes();
                        scope.$apply();
                    })

                focus.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("y", 9)
                    .attr("x", 1)
                   
                focus.append("g")   
                    .attr("class", "y axis")
                    .call(yAxis);

                context.append("path")
                    .datum(scope.tripVals)
                    .attr("class", "mini-arc")
                    .attr("d", line2);
                
                    
                context.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height2 + ")")
                    .call(xAxis2);

                var brushg = context.append("g")
                    .attr("class", "x brush")
                    .call(brush)

                brushg.selectAll("rect")
                    .attr("y", -6)
                    .attr("height", height2 + 7)


                // Not working. Disabled temporarily
                // brushed();

                addHandles();
                addTransparentRects();

                function addTransparentRects() {

                    var lRect = brushg.insert("rect", ":first-child")
                        .attr("class", "brush-lbgc")
                        .attr("x",  0)
                        .attr("y", -4)
                        .attr("width", 0.05 * width)
                        .attr("height", height2 + 4)

                    var rRect = brushg.insert("rect", ":first-child")
                        .attr("class", "brush-rbgc")
                        .attr("x",  0.95 * width)
                        .attr("y", -4)
                        .attr("width", 0.05 * width)
                        .attr("height", height2 + 4)

                }

                function brushed() {

                    x.domain(brush.empty() ? x2.domain() : brush.extent());

                    var extent = brush.extent();

                    // x.domain(brush.empty() ? x2.domain() : brush.extent());
                    tripsGroup.selectAll(".site-avg-line").attr("d",  avgLine);
                    focus.select(".x.axis").call(xAxis);

                    var lRect = brushg.select(".brush-lbgc")
                        .attr("width", x2(extent[0]))

                    var rRect = brushg.select(".brush-rbgc")
                        .attr("x", x2(extent[1]))
                        .attr("width", width - x2(extent[1]))

                }


                function addHandles() {

                   brushg.selectAll(".resize").append("line")
                        .attr("x1", 0)
                        .attr("y1", -4) // 0 isn't working. Find out why later
                        .attr("x2", 0)
                        .attr("y2", height2)
                        .attr("stroke", "#3A4555")
                        .attr("stroke-width", 1)
                        .attr("fill", "#3A4555")

                    // Handle width & Handle height
                    var hW = 8, hH = 22;

                    brushg.selectAll(".resize").append("rect")
                        .attr("x", -hW / 2)
                        .attr("y", 0)
                        .attr("rx", hW / 2)
                        .attr("ry", hW / 2)
                        .attr("width", hW)
                        .attr("height", hH)
                        .attr("transform", "translate(0," +  (height2 / 2 - hH / 2) + ")")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1)
                        .attr("fill", "#3A4555")

                }

                var hoverLine = focusGraphs.append("line")
                    .attr("class", "hover-line")
                    .style("stroke", "black")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", height)
                    .classed("hide-node", true);
               
                var siteAvgHoverCircle = focusGraphs.append("circle")
                    .attr("class", "siteavg-circles-hover")
                    .attr("r", 3.5)
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .classed("hide-node", true);

                function showHoverNodes(xVal) {
                    scope.xVal = xVal;

                    scope.siteAvgY = _.find(scope.tripVals, function(obj) {
                         return obj[siteAvgXKey] === xVal;
                    })[siteAvgYKey];

                    scope.siteAvgY = parseFloat(scope.siteAvgY).toFixed(2);
                    
                   if(scope.old != scope.siteAvgY){
                        hoverLine.attr("transform", "translate(" + x(xVal) + ",0)");
                        siteAvgHoverCircle.attr("transform", "translate(" + x(xVal) + ", " + y(scope.siteAvgY) + ")");

                        var hideHoveLine = (!scope.showTripsAvg && !scope.showSiteAvg && !scope.showTrips) || false;
                        var hideSiteAvgHoverLine = !scope.showTrips || false;

                        hoverLine.classed("hide-node", hideHoveLine);
                        siteAvgHoverCircle.classed("hide-node", hideSiteAvgHoverLine);

                        scope.old = scope.siteAvgY;
                   }
                   

                }
                function hideHoverNodes() {
                    hoverLine.classed("hide-node", true);
                    // tripAvgHoverCircle.classed("hide-node", true);
                    siteAvgHoverCircle.classed("hide-node", true);
                    
                    scope.xVal     = null;
                    scope.tripAvgY = null;
                    scope.tripY    = null;
                    scope.siteAvgY = null;
                }

                // Checkbox variables
                scope.showTripsAvg = true;
                scope.showTrips = true;
                scope.showOptimalValue = true;
                scope.showSiteAvg = true;

                // Click Handlers
                scope.toggleTripsAvgGraph = function() {
                    if (scope.showTripsAvg) {
                        d3.select(container).select('.trips-avg-line').classed("hide-node", false);
                    } else {
                        d3.select(container).select('.trips-avg-line').classed("hide-node", true);
                        d3.select(container).select('.tripavg-circles-hover').classed("hide-node", true);
                    }
                };
                scope.toggleTripsGraph = function() {
                    if (scope.showTrips) {
                        d3.select(container).select('.trips-grp').classed("hide-node", false);
                    } else {
                        d3.select(container).select('.trips-grp').classed("hide-node", true);
                    }
                };
                scope.toggleOptimalValueGraph = function() {
                    // if (scope.showOptimalValue) {
                    //     d3.select(container).select('.band-rect').classed("hide-node", false);
                    // } else {
                    //     d3.select(container).select('.band-rect').classed("hide-node", true);
                    // }
                };
                scope.toggleSiteAvgGraph = function() {
                    if (scope.showSiteAvg) {
                        d3.select(container).select('.site-avg-line').classed("hide-node", false);
                    } else {
                        d3.select(container).select('.site-avg-line').classed("hide-node", true);
                        d3.select(container).select('.siteavg-circles-hover').classed("hide-node", true);
                    }
                };

                // Default display variables at the top of the graph
                // scope.xVal     = scope.tripAvgVals[0][tripsAvgXKey];
                // scope.tripAvgY = scope.tripAvgVals[0][tripsAvgYKey];
                // scope.siteAvgY = scope.tripAvgVals[0][siteAvgYKey];
                // scope.tripY    = scope.tripAvgVals[0][tripsYKey];

            } // End of render function
        } // End of link function
    }; // End of return object

}]);
