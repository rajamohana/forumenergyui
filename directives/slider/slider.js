'use strict';
angular.module('cyient.slider', [])
.directive('slider', ['$window', function($window) {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            ticksNumber: '=',
            disabled: '=',
            onSlide: '&'
        },
        link: function(scope, elem, attrs) {

            var container = elem[0];

            scope.ticksNumber = 10;

            render();

            // Reponsive directive. Not the most efficient way,
            // but it works for now without any visible performance problem
            angular.element($window).bind('resize', function() {
                if ($window.innerWidth >= 1024) {
                    render();
                    scope.$digest();
                }
            });

            function render() {

                if (!scope.data) {
                    return;
                }

                d3.select(container).text("");

                var min = scope.data.min;
                var max = scope.data.max;
                var rangeMin = scope.data.start;
                var rangeMax = scope.data.end;
                var currVal = scope.data.current;
                var optimal = scope.data.optimal;
                var units = scope.data.units;

                var stepVal = (scope.data.max - scope.data.min)/10;

                var margin = {
                    top: 0,
                    right: 20,
                    bottom: 0,
                    left: 10
                };

                var width = elem.width() - margin.left - margin.right,
                    height = 70 - margin.bottom - margin.top;

                var x = d3.scale.linear()
                    .domain([min, max])
                    .range([0, width])
                    .clamp(true);

                var xb = d3.scale.linear()
                    .domain([rangeMin, rangeMax])
                    .range([x(rangeMin), x(rangeMax)])
                    .clamp(true);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(scope.ticksNumber)
                    .tickFormat(function(d) {
                        return (d > 0) ? (d) : (d);
                        // return (d > 0) ? (d + units) : (d);
                    })
                    .tickSize(10, 10)
                    .tickPadding(5);

                var svg = d3.select(container).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + -10 + ")");

                if (scope.disabled) {
                    svg.attr("class", "disabled");
                }

                svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (height / 2) + ")")
                    .call(xAxis)
                    .select(".domain")
                    .select(function() {
                        return this.parentNode.appendChild(this.cloneNode(true));
                    })
                    .attr("class", "halo");

                var currValMark = svg.append("g")
                    .attr("class", "curr-val-axis-grp")
                    .attr("transform", "translate(" + xb(scope.data.current) + "," + height / 2  + ")");

                currValMark.append("line")
                    .attr("class", "curr-val-axis-line")
                    .attr("x1", "0")
                    .attr("y1", "0")
                    .attr("x2", "0")
                    .attr("y2", "12")

                currValMark.append("text")
                    .text(scope.data.current)
                    // .text(scope.data.current + '' + units)
                    .attr("text-anchor", "middle")
                    .attr("y", "15")
                    .attr("dy", "0.71em")

                var slider = svg.append("g");

                var brush = d3.svg.brush()
                    .x(xb)
                    .extent([scope.data.current, scope.data.current])
                    .on("brush", brushed);

                slider.attr("class", "slider")
                    .call(brush);

                slider.selectAll(".extent, .resize")
                    .remove();

                slider.select(".background")
                    .attr("height", height);

                var lineData = [
                    { x: x(rangeMin), y: height / 2 },
                    { x: x(rangeMax), y: height / 2 }
                ];

                var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x })
                    .y(function(d) { return d.y });

                slider.append("path")
                    .attr("d", lineFunction(lineData))
                    .attr("class", "brush")
                    .attr("transform", "translate(0, 2)");

                var handle = slider.append("circle")
                    .attr("class", "handle")
                    .attr("transform", "translate(0," + height / 2 + ")")
                    .attr("r", 8);

                slider.insert("line", ":first-child")
                    .attr("class", "boundary-lines")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", 20)
                    .attr("transform", "translate(" + xb(rangeMin) + "," + (height / 2 - 10) + ")");

                slider.insert("line", ":first-child")
                    .attr("class", "boundary-lines")
                    .attr("x1", 10)
                    .attr("y1", 0)
                    .attr("x2", 10)
                    .attr("y2", 20)
                    .attr("transform", "translate(" + (xb(rangeMax) - 10) + "," + (height / 2 - 10) + ")");

                slider.insert("line", ":first-child")
                    .attr("class", "optimal-val")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", 20)
                    .attr("transform", "translate(" + xb(scope.data.optimal) + "," + (height / 2 - 10) + ")")

                slider.call(brush.event)
                    .transition()
                    .duration(750)
                    .call(brush.event);

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(Math.round(scope.data.current) + scope.data.units);
                svg.call(tip);
                handle
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)

                elem.on("$destroy", function() {
                    tip.destroy();
                });

                var firstTimeBrushCall = true;
                function brushed() {
                    var value = brush.extent()[0];

                    if (!d3.event.sourceEvent) {
                        handle.attr("cx", xb(value));
                        return;
                    }

                    value = xb.invert(d3.mouse(this)[0]);
                    brush.extent([value, value]);

                    /* Path for disabled slider */
                    if (scope.disabled) {
                        handle.attr("cx", xb(scope.data.current));
                        return;
                    }

                    /* Path for non-disabled slider */

                    // Discrete step implementation
                    var newVal, valChanged = false;
                    var diff = value - scope.data.current;
                    if (Math.abs(diff) < stepVal) { // If the difference is small enough, don't change anything
                        newVal = scope.data.current;
                    } else if (diff < 0) { // Slider moves left
                        newVal = scope.data.current - stepVal;
                        valChanged = true;
                    } else if (diff > 0) { // Slider moves right
                        newVal = scope.data.current + stepVal;
                        valChanged = true;
                    } else {
                        newVal = scope.data.current
                    }
                    // Making sure the current value is in the bounds
                    newVal = _.clamp(newVal, rangeMin, rangeMax);

                    handle.attr("cx", xb(newVal));

                    scope.data.current = Math.round(newVal);
                    tip.html(Math.round(scope.data.current) + scope.data.units);
                    if(firstTimeBrushCall) {
                        firstTimeBrushCall = false;
                    } else {
                        // do nothing ...
                        // scope.onSlide();
                    }
                    if (valChanged) {
                        scope.$apply();
                    }

                } // End of brushed function

            } // End of render function

        } // End of link function
    }; // End of return statement
}]); // End of directive
