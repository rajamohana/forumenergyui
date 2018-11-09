'use strict';
angular.module('cyient.progressarc', [])
    .directive('progressArc', [function () {
        return {
            scope: {
                progress: "="
                , type: "@", // Possible values: "type1", "type2"
                label: "@", // Optional. Default value: "Health"
                radius: "=", // Optional. Default value: 85
                radiusDiff: "=", // Optional. Default value: (radius - 8)
                avg: "="
                , hidePointer: "="
            }
            , restrict: "AE"
            , link: function (scope, elem, attrs) {

                    function render() {
                        var container = elem[0];
                        var outerRadius = scope.radius || 85;
                        var innerRadius = outerRadius - (scope.radiusDiff || 8);

                        var width = 2 * outerRadius + 5
                            , height = outerRadius + 30
                            , degrees = 1 * Math.PI;

                        var label = scope.label || "Health";

                        // Colors for Arcs & Text
                        var foregroundColor = (scope.type === "type1") ? "#ffdd33" : "#f7941e";
                        var backgroundColor = "#e1e1de";
                        var textColor = (scope.type === "type1") ? "#fff" : "#000";

                        // Converts progress values to radians
                        var radianScale = d3.scale.linear()
                            .domain([0, 100])
                            .range([-Math.PI / 2, Math.PI / 2])
                            .clamp(true);

                        // Converts progress values to degrees
                        var degreeScale = d3.scale.linear()
                            .domain([0, 100])
                            .range([-180, 180])
                            .clamp(true);

                        var progressStartAngle = radianScale(0);
                        var progressEndAngle = radianScale(scope.progress);

                        var avgArcStartAngle = radianScale(scope.avg - 1);
                        var avgArcEndAngle = radianScale(scope.avg + 1);

                        var backgroundArc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(progressStartAngle)
                            .endAngle(Math.PI / 2);

                        var foregroundArc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(progressStartAngle);

                        var avgArc = d3.svg.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius)
                            .startAngle(avgArcStartAngle)
                            .endAngle(avgArcEndAngle);

                        var svg = d3.select(container).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr("class", "progress-arc")
                            .append("g")
                            .attr("transform", "translate(0, 10)");

                        var meter = svg.append("g")
                            .attr("class", "season-progress")
                            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

                        var background = meter.append("path")
                            .datum({
                                endAngle: Math.PI / 2
                            })
                            .style("fill", backgroundColor)
                            .attr("d", backgroundArc);

                        var foreground = meter.append("path")
                            .datum({
                                endAngle: progressStartAngle
                            })
                            .style("fill", foregroundColor)
                            .attr("class", "foreground")
                            .attr("d", foregroundArc);

                        foreground.transition()
                            .duration(2000)
                            .delay(750)
                            .ease("linear")
                            .attrTween("d", function (d) {
                                var interpolate = d3.interpolate(d.endAngle, progressEndAngle)
                                return function (t) {
                                    d.endAngle = interpolate(t);
                                    return foregroundArc(d);
                                };
                            });

                        var avgMark = meter.append("path")
                            .datum({
                                endAngle: progressEndAngle
                            })
                            .style("fill", "#fff")
                            .style("opacity", 0)
                            .attr("d", avgArc)

                        // Pointer Height & Pointer Displacement
                        var pHeight = (scope.type === "type1") ? 23 : 12;
                        var pDisp = (scope.type === "type1") ? 20 : 8;

                        var pointer = meter.append("g")
                            .attr("transform", function (d) {
                                return "translate(" + avgArc.centroid(d) + ")";
                            })
                            .append("svg:image")
                            .attr("xlink:href", "svg/pointer.svg")
                            .attr("x", -4)
                            .attr("y", -pDisp)
                            .attr("width", 8)
                            .attr("height", pHeight)
                            .attr("transform", "rotate(" + (degreeScale(scope.avg) / 2) + ")")

                        var tip = d3.tip()
                            .attr('class', 'd3-tip')
                            .offset([-10, 0])
                            .html("Site Avg: " + Math.round(scope.avg));
                        svg.call(tip);
                        pointer
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide)

                        if (scope.hidePointer) {
                            pointer.attr("display", "none");
                        }

                        var progressText = meter.append("text")
                            .attr("text-anchor", "middle")
                            .attr("dy", "-.35em")
                            .attr("font-size", "35")
                            .style("fill", textColor)
                            .attr("class", "progress-percent")
                            .text(Math.round(scope.progress) + "%");

                        var textGroup = svg.append("g")
                            .attr("transform", "translate(" + 0 + "," + (outerRadius + 15) + ")")
                            .attr("width", outerRadius)
                            /*.style("fill", textColor)*/
                            .attr("font-size", "17")
                            .attr("y", "5");

                        var zeroText = textGroup.append("text")
                            .attr("text-anchor", "left")
                            .attr("x", "0")
                            .attr("class", "startpoint")
                            .text("0");

                        var hundredText = textGroup.append("text")
                            .attr("text-anchor", "end")
                            .attr("x", 2 * outerRadius + 5)
                            .attr("class", "endpoint")
                            .text("100");

                        var healthText = textGroup.append("text")
                            .attr("text-anchor", "middle")
                            .attr("x", outerRadius)
                            .attr("class", "progress-health")
                            .text(label);

                        elem.on("$destroy", function () {
                            tip.destroy();
                        });
                    } // End of render function

                    scope.$watch('progress', function (newValue) {
                        if (newValue) {
                            d3.select(elem[0]).selectAll('svg.progress-arc').remove(); // Prevent duplicate nodes
                            render();
                        }
                    });

                } // End of link function
        }; // End of return statement
}]) // End of directive
    .directive("smProgressArc", [function () {
        return {
            scope: {
                progress: "="
            }
            , restrict: "AE"
            , link: function (scope, elem, attrs) {

                    var container = elem[0];

                    var width = 28; // Measured from given designs

                    var outerRadius = width / 2;
                    var innerRadius = 0.7 * outerRadius;

                    // Maps progress percentages to angles
                    var radianScale = d3.scale.linear()
                        .domain([0, 100])
                        .range([-Math.PI / 2, Math.PI / 2])
                        .clamp(true);

                    var svg = d3.select(container)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", width / 2)
                        .append("g")
                        .attr("transform", "translate(" + (width / 2) + "," + (width / 2) + ")");

                    var arc = d3.svg.arc()
                        .innerRadius(outerRadius)
                        .outerRadius(innerRadius)
                        .startAngle(radianScale(0))
                        .endAngle(radianScale(100));

                    svg.append("path")
                        .attr("class", "arc")
                        .attr("d", arc)
                        .attr("fill", "#c4c7ce");

                    arc.endAngle(radianScale(scope.progress));

                    svg.append("path")
                        .attr("d", arc)
                        .attr("fill", "#f7941e");

                } // End of link function
        }; // End of return statment
}]); // End of directive