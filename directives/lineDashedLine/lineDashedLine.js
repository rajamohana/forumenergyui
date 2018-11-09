'use strict';
angular.module('cyient.lineDashedLine', [])
.directive('lineDashedLine', [function() {
    return {
        scope: {
            data: "="
        },
        restrict: "AE",
        templateUrl: "directives/lineDashedLine/linedashedline.html",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.$watch("data", function(newVal, oldVal) {
                render();
            }, true);

            var xKey = 'xValue', yKey = 'yValue';

            function render() {

                var failures = scope.data;

                d3.select(container).select("svg").text("");

                var containerWidth = elem.width();
                var containerHeight = elem.height();

                var parseDate = d3.time.format("%Y%m%d").parse;

                var margin = {top: 10, right: 10, bottom: 150, left: 55},
                    width = containerWidth - margin.left - margin.right,
                    height = containerHeight - margin.top - margin.bottom;

                var x = d3.time.scale().range([0, width]),
                    y = d3.scale.linear().range([height, 0]),
                    color = d3.scale.category10();

                var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(d3.time.format("%d %b"));

                var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x(d[xKey]); })
                    .y(function(d) { return y(d[yKey]); });

                var svg = d3.select(container).select("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                color.domain(d3.keys(failures[0]).filter(function(key) { return key !== "date"; }));

                x.domain([
                    d3.min(failures, function(c) { return d3.min(c.values, function(v) { return v[xKey]; }); }),
                    d3.max(failures, function(c) { return d3.max(c.values, function(v) { return v[xKey]; }); })
                ]);

                y.domain([
                    0,
                    d3.max(failures, function(c) { return d3.max(c.values, function(v) { return v[yKey]; }); })
                ]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                var failure = svg.selectAll(".failure")
                    .data(failures)
                    .enter().append("g")
                    .attr("class", "failure");

                failure.append("path")
                    .attr("class", "line")
                    .style("stroke-dasharray", function(d,i) {
                        if (i % 2 === 0)
                            return ("1, 0");
                        else 
                            return ("2, 5");
                    })
                    .attr("d", function(d) { return line(d.values); })
                    .style("fill", "none")
                    .style("stroke", function(d) { return color(d.name); });

                var focus = svg.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("circle")
                    .attr("r", 4.5);

                focus.append("text")
                    .attr("x", 9)
                    .attr("dy", ".35em");

            } // End of render function
            
        } // End of link function
    }; // End of return object
}]); // End of directive
