'use strict';
angular.module('cyient.histogram', [])
.directive('histogram', [function() {
    return {
        scope: {
            data: "=",
            toolTipValue: "=",
        },
        restrict: "AE",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.$watch("data", function(newVal, oldVal) {
                render();
            }, true);


            function render() {

                d3.select(container).text("");

                var containerWidth = elem.width();
                var containerHeight = elem.height();

                var margin = {top: 10, right: 10, bottom: 24, left: 55},
                    width = containerWidth - margin.left - margin.right,
                    height = containerHeight - margin.top - margin.bottom;

                var formatPercent = d3.format(".0%");

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5)
                    .tickFormat(formatPercent);

                var svg = d3.select(container).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var data = scope.data;

                x.domain(data.map(function(d) { return d.xValue; }));
                y.domain([0, d3.max(data, function(d) { return d.yValue; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.xValue); })
                    .attr("width", x.rangeBand())
                    .attr("y", function (d, i) {
                      return height;
                    })
                    .attr("height", 0)
                      .transition()
                      .duration(2000)
                      .delay(function (d, i) {
                        return i * 50;
                      })
                    .attr("y", function(d) {
                      return y(d.yValue);
                    })
                    .attr("height", function(d) {
                      return height - y(d.yValue);
                    });
            } // End of render function

        } // End of link function
    }; // End of return object

}]);
