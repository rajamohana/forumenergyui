'use strict';
(function(){
  angular.module("directives/miniLifeChart/miniLifeChart.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("directives/miniLifeChart/miniLifeChart.html",
    "<div><div id=\"mini-lifechart-graph\"><svg class=\"mini-life-canvas\"></svg></div></div>");
  }]);
  angular.module('cyient.miniLifechart', ["directives/miniLifeChart/miniLifeChart.html"])
  .directive('miniLifechart', ['$q', '$timeout', '$log', function($q, $timeout, $log) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        width: '=',
        height: '=',
        todayX: '=',
        todayY: '=',
        smh: '=',
        rul: '=',
        data: '=data',
        dotRadius: "=",
      },
      templateUrl: "directives/miniLifeChart/miniLifeChart.html",
      link: function(scope, element, attrs) {

        var margin = {
          top: 10,
          right: 15,
          bottom: 30,
          left: 10
        };
        // define SVG canvas
        var svg = d3.select(element.children()[0]).select("svg")
          .attr("width", "100%")
          .attr("height", scope.height + margin.bottom)
          .append("g")
            .attr("id", "mini-lifechart-group")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // make the visualization responsive by watching for changes in window size
        window.onresize = function() {
          return scope.$apply();
        };
        scope.$watch(function() {
          return angular.element(window)[0].innerWidth;
        }, function() {
          var innerWidth = angular.element(window)[0].innerWidth;
          if(innerWidth >= 1024 && innerWidth < 1200) {
            scope.width = 95;
          }
          if(innerWidth >= 1200) {
            scope.width = 125;
          }
          return scope.render(scope.data, scope.todayX, scope.todayY);
        });

        scope.render = function(data, todayX, todayY) {

          if(!data){
            return
          }

          var dots = {
            originPos: 0,
            xTodayPos: null,
            yTodayPos: null,
            rulPos: null
          };

          // Trim the graph data
          for (var i = data.length-1; i >= 0; i--){
            if (data[i].yAxis < 0){
              data.splice(i, 1); // remove negative points
            }
          }

          // return first smallest yAxis value
          var first_smallest = Number.POSITIVE_INFINITY;
          for (var i in data) {
            /* If current element is smaller than first then update both first and second */
            if (data[i].yAxis < first_smallest) {
              first_smallest = data[i].yAxis;
            }
          }

          // return first largest xAxis value
          var first_largest = Math.max.apply(Math, data.map(function(o){return o.xAxis;}));
          dots.rulPos = first_largest;

          // return data midpoint of trimmed graph data
          var midpoint = data[Math.round((data.length - 1) / 2)];
          dots.xTodayPos = todayX;

          // add label property and Today label to trimmed data
          for (var j in data) {
            data[j].label = "";
            if(data[j].xAxis === todayX){
              data[j].label = "Today";
              dots.yTodayPos = data[j].yAxis;
            }
          }

          var width = scope.width;
          var height = scope.height;

          var x = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
              return d.xAxis;
            })])
            .range([0, width]);

          var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
              return d.yAxis;
            })])
            .range([height, 0]);

          var xAxisLine = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(0)
            .tickSize(0)
            .tickPadding(12);

          var yAxisLine = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(0)
            .tickSize(0)
            .tickPadding(12);

          svg.selectAll("*").remove();
          var chartBody = svg.append("g");

          // define line to extend axes (as per design)
          var line = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) {
              return x(d.xAxis);
            })
            .y(function(d) {
              return y(d.yAxis);
            });

          var mainArea = function(datum, field) {
            return d3.svg.area()
              .interpolate("monotone")
              .x(function(d) {
                return x(d.xAxis);
              })
              .y0(height)
              .y1(function(d) {
                return y(d[field] || 0);
              })(datum);
          };

          // define RUL area with linear interpolation
          var rulArea = function(datum, field){
            return d3.svg.area()
              .interpolate("linear")
              .x(function(d) {
                return x(d.xAxis);
              })
              .y0(height)
              .y1(function(d) {
                return y(d[field] || 0);
              })(datum);
          };

          var mainData = [];
          var todayIndex = null, mainTickValue = null;
          for (var i = 0, len = data.length; i < len; i++){
            if(data[i].label === "Today"){
              // find index of data point where label is "Today"
              todayIndex = data.indexOf(data[i]);
              mainTickValue = data[todayIndex].xAxis;
            }
          }

          // slice original data until today index
          mainData = data.slice(0, todayIndex+1);

          // define tick values
          var totalTickValue = data[data.length-1].xAxis;
          var secondTickValue = totalTickValue - mainTickValue;

          // filter out data that has labels Today and RUL
          // this data will be used to render the second area
          var data2 = data.filter(function(el) {
            return el.label === "Today" || el.xAxis === first_largest;
          });

          // render X axis
          svg.append("g")
            .attr("class", "x mlifeChartAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisLine);

          // render Y axis
          svg.append("g")
            .attr("class", "y mlifeChartAxis")
            .call(yAxisLine);

          // add main area
          chartBody.append('path')
            .attr('class', 'mArea1')
            .attr('d', mainArea(mainData))
            .attr('opacity', 1)
            .transition().duration(1000)
            .attr('d', mainArea(mainData, 'yAxis'));

          // add second area
          chartBody.append('path')
            .attr('class', 'mArea2')
            .attr('d', rulArea(data2))
            .attr('opacity', 1)
            .transition().duration(2000)
            .attr('d', rulArea(data2, 'yAxis'));

          var mainLine = chartBody.append("path")
            .datum(mainData)
            .attr("class", "mlifeChartLine")
            .transition()
              .duration(3000)
              .attr("d", line);

          var rulLine = chartBody.append("path")
            .datum(data2)
            .attr("class", "mlifeChartLine")
            .style("stroke-dasharray", ("3, 3"))
            .transition()
              .duration(3000)
              .attr("d", line);

          // draw line at today
          var lineData = [
            {"xAxis": dots.xTodayPos, "yAxis": 0},
            {"xAxis": dots.xTodayPos, "yAxis": dots.yTodayPos}
          ];
          var thisWidth;
          var todayLine = chartBody.append("path")
            .datum(lineData)
            .attr("class", "midpointLine")
            .attr("d", line);
            var todayLineLength = todayLine.node().getTotalLength();
            todayLine
              .attr("stroke-dasharray", todayLineLength + " " + todayLineLength)
              .attr("stroke-dashoffset", todayLineLength)
              .transition()
              .duration(1000)
              .ease("linear")
              .attr("stroke-dashoffset", 0);

          // x-axis labels
          chartBody.append("text")
            .attr("id", "main-label")
            .attr("x", 0)
            .attr("y", height + 5)
            .attr("dy", ".85em")
            // .attr("dx", (width-25)/2+5)
            .attr("class", "mlifeChartLabels")
            .text(Math.round(scope.smh));
            // .each(function (d, i) {
            //   thisWidth = this.getComputedTextLength()
            // })
            // .attr("style", "transform:translateX("+ -thisWidth + "px" + ")");

          chartBody.append("text")
            .attr("id", "secondary-label")
            .attr("x", width - 25)
            .attr("y", height + 5)
            .attr("dy", ".85em")
            .attr("class", "mlifeChartLabels")
            .text(Math.round(scope.rul));

          // add 'Today' label
          // svg.append("text")
          //   .attr("id", "today-label")
          //   .attr("transform", "translate(" + (x(dots.xTodayPos)-30) + "," + (y(todayY)-5) + ")")
          //   .attr("class", "mlifeChartLabels")
          //   .text("Today");

        };

        scope.$watch('data', function(newValue) {
          if(newValue){
            scope.render(scope.data, scope.todayX, scope.todayY);
          }
        }, true);

      } // link function ends
    } // return ends
  }]); // directive ends
})();
