'use strict';
angular.module('cyient.donut', [])
.directive('donut', [function() {
    return {
        scope: {
            type: '=',
            mode: '=',
            data: '=',
            numVal: '=',
            numLabel: '=',
            totalVal: '=',
            bottomLabel: '=',
            valLabel: '=',
            colorLabel: '='
        },
        restrict: "AE",
        link: function(scope, elem, attrs) {

            var container = elem[0];

            var width = elem.width(),
                height = elem.width(),
                radius = width / 2;

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d[scope.valLabel] });

            var arc = d3.svg.arc()
                .innerRadius(radius - 10)
                .outerRadius(radius);

            var svg = d3.select(container).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
				.attr("class", function() {
					if (radius < 50) {
						return "small-donut";
					}
				})
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var path = svg.selectAll("path")
                .data(pie(scope.data))
              .enter().append("path")
                .attr("fill", function(d) { return d.data[scope.colorLabel] })
                .attr("d", arc)
                .transition()
                .duration(1500)
                .attrTween('d', function(d) {
                   var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                   return function(t) {
                       d.endAngle = i(t);
                     return arc(d);
                   }
                });

            if (scope.type === 'type1') {
                var textGroup = svg.append("g")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(0, 15)")
                if (scope.mode === 'small') {
                    textGroup.append("text")
                        .attr("transform", "translate(0, -16)")
                        .attr("fill", "#2aaef9")
                        .attr("font-family", "OpenSansSemiBold")
                        .attr("font-size", 20)
                        .text(scope.numVal);
                    textGroup.append("line")
                        .attr("shape-rendering", "crispEdges")
                        .attr("stroke-width", "1")
                        .attr("stroke", "#72787e")
                    	.attr("x1", -10)
                    	.attr("y1", 0)
                    	.attr("x2", 10)
                    	.attr("y2", 0)
                    	.attr("transform", "translate(0, -12)")
                    textGroup.append("text")
                        .attr("font-size", 10)
                        .text(scope.totalVal);
                } else if (scope.mode === 'big') {
                    var upperGroup = textGroup.append("g")
                        .attr("transform", "translate(0, -25)");
                    upperGroup.append("text")
                        .attr("transform", "translate(0, 5)")
                    	.attr("font-family", "OpenSansSemiBold")
                        .attr("fill", "#2aaef9")
                        .attr("font-size", 35)
                        .text(scope.numVal);
                    // upperGroup.append("line")
                    //     .attr("stroke-width", "1")
                    // 	.attr("fill", "#000")
                    // 	.attr("x1", -10)
                    // 	.attr("y1", 0)
                    // 	.attr("x2", 10)
                    // 	.attr("y2", 0)
                    // 	.attr("transform", "translate(0, -15)")
                    // upperGroup.append("text")
                    //     .text("343");
                    textGroup.append("text")
                        .attr("font-size", "12")
                        .text(scope.totalVal + " across site");
                }
            } else if (scope.type === 'type2'){
                var textGroup = svg.append("g")
                    .attr("text-anchor", "middle")
                    .attr("transform", "translate(0, 8)")
                textGroup.append("text")
                    .attr("class", "overload-text")
                    .text(scope.numVal)
            }

            // var textGroup = svg.append("g")
            //     .attr("transform", "translate(0, 15)");
//				.attr("transform", function() {
//					if(radius < 50) {
//						return "translate(0, 15)";
//					} else {
//						return "translate(0, 20)"
//					}
//				});

            // var upperText = textGroup.append("g")
            //     .attr("class", "upper-text")
            //     .attr("text-anchor", "middle")
            //     .attr("transform", "translate(0, -20)")

            // upperText.append("text")
            //     .attr("class", "upper-left-text")
            //     .attr("transform", "translate(0, 5)")
            //     // .attr("text-anchor", "end")
            //     .text(scope.numVal)
            // upperText.append("text")
            //     .attr("class", "upper-right-text")
            //     // .attr("text-anchor", "start")
// //                .attr("transform", "translate(0, 20)")
				// .attr("transform", function() {
					// if(radius < 50) {
						// return "translate(0, 20)";
					// } else {
						// return "translate(0, 25)"
					// }
				// })
            //     .text(scope.numLabel);

//            var lowerText = textGroup.append("text")
//                .attr("class", "lower-text")
//                .attr("text-anchor", "middle")
//                .text(scope.bottomLabel);

        }
    };
}]);
