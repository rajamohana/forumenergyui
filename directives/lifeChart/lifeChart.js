'use strict';
(function(){
  angular.module("directives/lifeChart/lifeChart.html", []).run(["$templateCache", function($templateCache){
    $templateCache.put("directives/lifeChart/lifeChart.html",
    '<div class="graph-container">' +
      '<div id="life-chart-legends" class="chart-legends">' +
        '<div class="rul-legends" ng-if="isRULLegend">' +
          '<div class="checkbox-wrapper">' +
            '<div class="checkbox-btn-group">' +
              '<div class="life-1">' +
                '<label class="checkbox-button today-check">' +
                  '<input type="checkbox" name="SMHValue" ng-model="isRULTodayLine" ng-click="toggleRULTodayLine()">' +
                    '<span>Today <span class="graph-value">{{xvalue}}</span></span>' +
                '</label>' +
              '</div>' +
              '<div class="life-1">' +
                '<label class="checkbox-button health-check">' +
                  '<input type="checkbox" name="check" ng-model="isRULHealthLine" ng-click="toggleRULHealthLine()">' +
                    '<span>Health <span class="graph-value">{{(healthvalue | setDecimal: 3)}}</span></span>' +
                '</label>' +
              '</div>' +
              '<div class="life-1">' +
                '<label class="checkbox-button rul-check">' +
                  '<input type="checkbox" name="check" ng-model="isRULArea" ng-click="toggleRULArea()">' +
                    '<span>RUL <span class="graph-value" ng-if="rulminvalue">min: {{(rulminvalue | setDecimal: 2)}}<span ng-if="rulmaxvalue">,</span></span> &nbsp; <span ng-if="rulmaxvalue"> max: {{(rulmaxvalue | setDecimal: 2) }}</span></span>' +
                '</label>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="deterioration-legends" ng-if="isDeteriotationLegend">' +
          '<div class="checkbox-wrapper">' +
            '<div class="checkbox-btn-group">' +
              '<label class="checkbox-button today-check">' +
                '<input type="checkbox" name="SMHValue" ng-model="isRODTodayLine" ng-click="toggleRODTodayLine()">' +
                  '<span>Today <span class="graph-value">{{xvalue}}</span></span>' +
              '</label>' +
              '<label class="checkbox-button health-check">' +
                '<input type="checkbox" name="check" ng-model="isROD" ng-click="toggleROD()">' +
                  '<span>ROD <span class="graph-value">{{(healthvalue | setDecimal: 3)}}</span></span>' +
              '</label>' +
              '<label class="checkbox-button optimal-check">' +
                '<input type="checkbox" name="check" ng-model="isRODOptimalVal" ng-click="toggleOptimalVal()">' +
                  '<span>Optimal Value</span>' +
                  // <span class="graph-value">{{optimalmin}}</span> &dash; <span class="graph-value">{{optimalmax}}</span>
              '</label>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="life-chart-graph"><svg class="life-graph-{{chartType}}"></svg></div>' +
    '</div>'
    );
  }]);
  angular.module('cyient.lifechart', ['directives/lifeChart/lifeChart.html'])
  .directive('lifeChart', ['_', '$compile', '$timeout', '$document', '$state', '$filter', '$log', function(_, $compile, $timeout, $document, $state, $filter, $log) {
    return {
      restrict: 'E',
      scope: {
        width: '=',
        height: '=',
        todayX: '=',
        todayY: '=',
        data: '=data',
        xvalue: '@',
        trendvalue: '@',
        siteavgvalue: '@',
        healthvalue: '@',
        rulminvalue: '@',
        rulmaxvalue: '@',
        optimalmin: '@',
        optimalmax: '@',
        

        /**
         * NOTE: only two chart types are supported 'RUL' and 'ROD'
         * some ternary operations might be affected if a new type is introduced
         */
        chartType: '@',
      },
      templateUrl: "directives/lifeChart/lifeChart.html",
      link: function(scope, element, attrs, ngModel) {

        var margin = {
          top: 20,
          right: 100,
          bottom: 100,
          left: 55
        },
        padding = 100;

        var width = scope.width;
        var height = scope.height;
        var minOptimalValue = scope.data.minOptimalValue || 0;
        var maxOptimalValue = scope.data.maxOptimalValue || 0;

        scope.inline = 'block';
        if($state.current.name === "cyient.protected.sitedetails.whatifscenario"){
          scope.inline = 'inline-flex';
        }

        var isOptimal = false; // boolean for optimal value rectangle

        if(scope.chartType === 'RUL'){
          // default values
          scope.isRULLegend = true;
          scope.isRULTodayLine = true;
          scope.isRULHealthLine = true;
          scope.isRULTrendLine = false;
          scope.isRULSiteAvgLine = false;
          scope.isRULArea = true;
          isOptimal = false;

          // action functions for checkbox elements in RUL graph
          scope.toggleRULTodayLine = function(){
            scope.isRULTodayLine = !scope.isRULTodayLine;
            scope.isRULTodayLine ? d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'visible') : d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'hidden');
          };
          scope.toggleRULTrendLine = function(){
            scope.isRULTrendLine = !scope.isRULTrendLine;
            scope.isRULTrendLine ? d3.select(element[0]).select('.trendLine').style('visibility', 'visible') : d3.select(element[0]).select('.trendLine').style('visibility', 'hidden');
          };
          scope.toggleRULHealthLine = function(){
            scope.isRULHealthLine = !scope.isRULHealthLine;
            scope.isRULHealthLine ? d3.select(element[0]).select('.healthLine').style('visibility', 'visible') : d3.select(element[0]).select('.healthLine').style('visibility', 'hidden');
          };
          scope.toggleRULSiteAvgLine = function(){
            scope.isRULSiteAvgLine = !scope.isRULSiteAvgLine;
            scope.isRULSiteAvgLine ? d3.select(element[0]).select('.siteAvgLine').style('visibility', 'visible') : d3.select(element[0]).select('.siteAvgLine').style('visibility', 'hidden');
          }
          scope.toggleRULArea = function(){
            scope.isRULArea = !scope.isRULArea;
            scope.isRULArea ? d3.select(element[0]).selectAll('#rul-minArea, #rul-maxArea, #rulMaxLine, #rulAvgLine, #rulMinLine, #life-chart-minLine, #life-chart-minLabel,  #life-chart-avgLine, #life-chart-avgLabel, #life-chart-maxLine, #life-chart-maxLabel').style('visibility', 'visible') : d3.select(element[0]).selectAll('#rul-minArea, #rul-maxArea, #rulMaxLine, #rulAvgLine, #rulMinLine, #life-chart-minLine, #life-chart-minLabel,  #life-chart-avgLine, #life-chart-avgLabel, #life-chart-maxLine, #life-chart-maxLabel').style('visibility', 'hidden');
          };

        } else if(scope.chartType === 'ROD'){
          // default values
          scope.isDeteriotationLegend = true;
          scope.isRODTodayLine = true;
          scope.isRODTrendLine = true;
          scope.isROD = true;
          scope.isRODOptimalVal = true;
          scope.isRODSiteAvgLine = false;
          isOptimal = true;

          // action functions for checkbox elements in deterioration/ROD graph
          scope.toggleRODTodayLine = function(){
            scope.isRODTodayLine = !scope.isRODTodayLine;
            scope.isRODTodayLine ? d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'visible') : d3.select(element[0]).selectAll('#life-chart-todayLine, #life-chart-todayLabel, #life-chart-intersect').style('visibility', 'hidden');
          };
          scope.toggleRODTrendLine = function(){
            scope.isRODTrendLine = !scope.isRODTrendLine;
            scope.isRODTrendLine ? d3.select(element[0]).select('.trendLine').style('visibility', 'visible') : d3.select(element[0]).select('.trendLine').style('visibility', 'hidden');
          };
          scope.toggleROD = function(){
            scope.isROD = !scope.isROD;
            scope.isROD ? d3.select(element[0]).select('.healthLine').style('visibility', 'visible') : d3.select(element[0]).select('.healthLine').style('visibility', 'hidden');
          };
          scope.toggleOptimalVal = function(){
            scope.isRODOptimalVal = !scope.isRODOptimalVal;
            scope.isRODOptimalVal ? d3.select(element[0]).select('.optimalArea').style('visibility', 'visible') : d3.select(element[0]).select('.optimalArea').style('visibility', 'hidden');
          };
          scope.toggleRODSiteAvgLine =  function(){
            scope.isRODSiteAvgLine = !scope.isRODSiteAvgLine;
            scope.isRODSiteAvgLine ? d3.select(element[0]).select('.siteAvgLine').style('visibility', 'visible') : d3.select(element[0]).select('.siteAvgLine').style('visibility', 'hidden');
          };
        }

        function compare(a,b) {
          if (a.xAxis < b.xAxis)
            return -1;
          if (a.xAxis > b.xAxis)
            return 1;
          return 0;
        }

        // render plot
        scope.render = function() {

          if(scope.data){
            var today = scope.today;
            var todayX = scope.todayX;
            var todayY = scope.todayY;
            var healthDataTemp = scope.data.trendGraph || [];
            var healthData = healthDataTemp.concat(scope.data.healthGraph);
          } else {
            return;
          }

          // sort by yAxis
          healthData = _.sortBy(healthData, 'yAxis');

          // sort data by xAxis
          healthData.sort(compare);
            
          // trim off negative/zero values in yAxis
          /*healthData = _.remove(healthData, function(ele) {
            return ele.xAxis < 0 ||ele.yAxis > 0;
          });*/

          // today point
          var todayPoint = healthData.filter(function(ele){
            return ele.xAxis === todayX || ele.yAxis === todayY;
          });

          // trim data off negative `x` and `y` values
          for(var i=healthData.length-1; i >= 0; i--){
            if(healthData[i].xAxis < todayPoint.xAxis && healthData[i].yAxis < 0){
              healthData.splice(i, 1);
            }
          }

          var first_smallest = Number.POSITIVE_INFINITY;
          for (var i in healthData) {
            /* If current element is smaller than first then update both first and second */
            if (healthData[i].yAxis < first_smallest) {
              first_smallest = healthData[i].yAxis;
            }
          }
          // return first largest yAxis value
          var first_largest_yAxis = d3.max(healthData, function(d) { return d.yAxis});

          /* slice original data until today */
          var mainData = [], rulData = [];
          var rulMinData = [], rulMaxData = [];
          var todayIndex = null;
          for (var i = 0, len = healthData.length; i < len; i++){
            if(healthData[i].xAxis === todayX || healthData[i].yAxis === todayY){
              // index of `today` data point in the datum
              todayIndex = healthData.indexOf(healthData[i]);
			        break;
            }
          }
          mainData = healthData.slice(0, todayIndex+1);
          
          var rulData2 = healthData.slice(todayIndex, healthData.length-1);
		  
		  //now adjust the data if any value is more than 1 in yAxis
		  rulData = _.map(rulData2, function(e) {
			  if(e.yAxisMin > 1 || e.yAxisMax > 1) {
				// e.yAxisMin /= 100;
				// e.yAxisMax /= 100;
			  }
			  return e;
		  })

          // if it's an ROD graph, slice off siteAvgData from todayIndex
          if(scope.chartType === 'ROD'){
            // siteAvgData = siteAvgData.slice(0, todayIndex);
          }

          // omit yAxisMin and yAxisMax keys
          _.omit(healthData, ['yAxisMin', 'yAxisMax']);
          _.omit(rulData, ['yAxisMin', 'yAxisMax']);
          // separate yAxisMin and yAxisMax data from rulData
          for(var i in rulData){
            rulMinData.push({ xAxis: rulData[i].xAxis, yAxis: rulData[i].yAxisMin});
            rulMaxData.push({ xAxis: rulData[i].xAxis, yAxis: rulData[i].yAxisMax });
          }
          rulData = _.sortBy(rulData, 'yAxis');
          rulData = _.remove(rulData, function(ele) {
            return ele.xAxis < 0 || ele.yAxis > 0;
          });
          rulData.sort(compare);

          rulMinData = _.sortBy(rulMinData, 'yAxis');
          rulMinData = _.remove(rulMinData, function(ele) {
            return ele.xAxis < 0 || ele.yAxis > 0;
          });
          rulMinData.sort(compare);

          rulMaxData = _.sortBy(rulMaxData, 'yAxis');
          rulMaxData = _.remove(rulMaxData, function(ele) {
            return ele.xAxis < 0 || ele.yAxis > 0;
          });
          rulMaxData.sort(compare);

          var x = d3.scale.linear()
            .domain([0, d3.max([].concat(
              healthData.map(function(d) { return d.xAxis }),
              // siteAvgData.map(function(d) { return d.xAxis }),
              // trendData.map(function(d) { return d.xAxis }),
              rulMinData.map(function(d) { return d.xAxis }),
              rulMaxData.map(function(d) { return d.xAxis }))
            )])
            .range([0, width - margin.right]);

          var yMaxValue = d3.max(
            [].concat(
              healthData.map(function(d) { return d.yAxis }),
              // siteAvgData.map(function(d) { return d.yAxis }),
              // trendData.map(function(d) { return d.yAxis }),
              rulMinData.map(function(d) { return d.yAxis }),
              rulMaxData.map(function(d) { return d.yAxis }),
              [maxOptimalValue])
          );

          var y = d3.scale.linear()
            .domain([0, yMaxValue])
            .range([height / 2, 0]);

          var xTicks = d3.max([].concat(
              healthData.length,
              // siteAvgData.length,
              // trendData.length,
              rulMinData.length,
              rulMaxData.length)
            );

          // count number of decimals after the decimal point
          var countDecimals = function (value) {
            if ((value % 1) != 0){
              return value.toString().split(".")[1].length;
            }
            return 0;
          };

          // var initSec = d3.select("svg")
          // .attr("id", "life-graph-group");
          // if(initSec){
          //   initSec.remove();
          // }
          // define SVG canvas
          var svg = d3.select(element.children()[0]).select("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
            .attr("id", "life-graph-group")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var chartBody = svg.append("g").attr("id", "chart-body");

          var xAxisLine = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(6)
            /*.tickFormat(function(d) {
                // This function is temporary.
                // Will be changed/removed in a short time.

                var startDate = new Date(2003, 1);
                var endDate = new Date(2016, 1);

                // Maps the x-axis values to milliseconds
                var dateScale = d3.scale.linear()
                        .domain(x.domain())
                        .range([startDate.getTime(), endDate.getTime()]);

                // var format = d3.time.format("%e %b' %y");
                var format = d3.time.format("%b' %y");
                // var format = d3.time.format("%Y");
                var str = format(new Date(dateScale(d)))
                // console.log(str);
                return str;
            })*/
            // .ticks(xTicks/35)
            .tickSize(0)
            .tickPadding(8);
            
            
            d3.selectAll(".xAxis>.tick>text")
		      .style("font-size",8);

          var yAxisLine = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(function(d) {
              // if(d>0 && countDecimals(d)<2) { return d * 100; }
              // else { return d * 10; }
              return d;
             })
            .tickSize(5)
            .ticks(5)
            .tickPadding(6);

          // define line
          var line = d3.svg.line()
            .interpolate("linear")
            .x(function(d) {
              return x(d.xAxis);
            })
            .y(function(d) {
              return y(d.yAxis);
            });

          // define area
          //custom interpolator - function(points) { return points.join(""); }
          var area = d3.svg.area()
            .interpolate("monotone")
            .x(function(d) {
              return x(d.xAxis);
            })
            .y0(height)
            .y1(function(d) {
              return y(d.yAxis);
            });

          // render axes
          var xTranslateHeight = height / 2;
          chartBody.append("g")
            .attr("id", "life-chart-xAxis")
            .attr("class", "x lifeChartAxis")
            .attr("transform", "translate(0," + xTranslateHeight + ")")
            .call(xAxisLine);

          chartBody.append("g")
            .attr("id", "life-chart-yAxis")
            .attr("class", "y lifeChartAxis")
            .call(yAxisLine);

          // render vertical grid lines
          chartBody.selectAll("line.horizontalGrid").data(y.ticks(5)).enter()
            .append("line")
            .attr({
              "class": "horizontalGrid",
              "x1": 0,
              "x2": width,
              "y1": function(d) {
                return y(d);
              },
              "y2": function(d) {
                return y(d);
              },
              "fill": "none",
              "shape-rendering": "crispEdges",
              "stroke": "#cbcccd",
              "stroke-width": "1px"
            });

          // return first largest xAxis value
          var first_largest_xAxis = d3.max(healthData, function(d) { return d.xAxis});

          // render optimal area
          scope.optimalmin = $filter('setDecimal')(minOptimalValue, 3);
          scope.optimalmax = $filter('setDecimal')(maxOptimalValue, 3);
          if(minOptimalValue && maxOptimalValue){
            chartBody.append("rect")
            .attr("class", "optimalArea")
            .attr("x", 0)
            .attr("y", y(minOptimalValue))
            .attr("width", width)
            .attr("height", Math.abs(y(maxOptimalValue) - y(minOptimalValue)) )
            .style("visibility", (scope.chartType === 'RUL')? ((false)? 'visible': 'hidden') : ((scope.isRODOptimalVal)? 'visible': 'hidden'))
          }

          // render Health trend line
          var healthLine = chartBody.append("path")
            .datum(mainData)
            .attr("class", function(d) {
              return "lifeChartLine healthLine";
            })
            .attr("d", line);
          var totalLength = healthLine.node().getTotalLength();
          healthLine
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0)
            .attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULHealthLine)? 'visible': 'hidden') : ((scope.isROD)? 'visible': 'hidden'));

          // Adds two circles for min & max points in life-chart
          if (scope.chartType === 'ROD') {
            var minPoint = _.minBy(mainData, 'yAxis');
            var maxPoint = _.maxBy(mainData, 'yAxis');

            chartBody.append("circle")
              .attr("cx", x(minPoint.xAxis))
              .attr("cy", y(minPoint.yAxis))
              .attr("r", 4)
              .attr("stroke", "#65318f")
              .attr("stroke-width", "3px")
              .attr("fill", "#fff")

            chartBody.append("circle")
              .attr("cx", x(maxPoint.xAxis))
              .attr("cy", y(maxPoint.yAxis))
              .attr("r", 4)
              .attr("stroke", "#65318f")
              .attr("stroke-width", "3px")
              .attr("fill", "#fff")
          }

          /*
          var siteAvgLine = chartBody.append("path")
            .datum(siteAvgData)
            .attr("class", function(d) {
              return "lifeChartLine siteAvgLine";
            })
            .attr("stroke", "#d78219")
            .attr("d", line);
          var lineLen = siteAvgLine.node().getTotalLength();
          var dashLen = 10;
          var ddLen = dashLen * 2;
          var darray = dashLen;
          while(ddLen < lineLen){
            darray += "," + dashLen + "," + dashLen;
            ddLen += dashLen * 2;
          }
          siteAvgLine
              .attr("stroke-linecap", "round")
              .attr("stroke-dasharray", darray + "," +lineLen)
              .attr("stroke-dashoffset", lineLen)
            .transition()
              .duration(2000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULSiteAvgLine)? 'visible': 'hidden') : ((scope.isRODSiteAvgLine)? 'visible': 'hidden'));
          */

          /*
          var trendLine = chartBody.append("path")
            .datum(trendData)
            .attr("class", function(d) {
              return "lifeChartLine trendLine";
            })
            .attr("d", line);
          var totalLength = trendLine.node().getTotalLength();
          trendLine
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0)
            .attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULTrendLine)? 'visible': 'hidden') : ((scope.isRODTrendLine)? 'visible': 'hidden'));
            */

           if(scope.data.showMoreLines == true){
            if(scope.data.dataPoints){
              var rulMinData = scope.data.dataPoints["minLine"];
              var rulMaxData = scope.data.dataPoints["maxLine"];
              var rulData = scope.data.dataPoints["avgLine"];
              if(rulMinData && rulMinData.length){
                var len = rulMinData.length;
                for(var i=0; i<len; i++){
                  rulMinData[i].xAxis = parseFloat(rulMinData[i].xAxis).toFixed(2);
                }
              }

              if(rulMaxData && rulMaxData.length){
                var len = rulMaxData.length;
                for(var i=0; i<len; i++){
                  rulMaxData[i].xAxis = parseFloat(rulMaxData[i].xAxis).toFixed(2);
                }
              }

              if(rulData && rulData.length){
                var len = rulData.length;
                for(var i=0; i<len; i++){
                  rulData[i].xAxis = parseFloat(rulData[i].xAxis).toFixed(2);
                }
              }

            }
          }

          if(rulData.length > 0){
            // define line
            var rulLine = d3.svg.line()
              .interpolate("linear")
              .x(function(d) {
                if(d) return x(d.xAxis);
              })
              .y(function(d) {
                if(d) return y(d.yAxis);
              });
              
            var rulArea = chartBody.append("g").attr("id", "rul-area").attr("class", "rulArea");
            rulData = _.map(rulData, function(o) { return _.omit(o, 'yAxisMin'); });
            rulData = _.map(rulData, function(o) { return _.omit(o, 'yAxisMax'); });
            var rulMinArea = [_.head(rulData), _.last(rulData)];
            var rulMaxArea = [_.head(rulData)];
            for(var i in rulMinData){
              rulMinArea.push(rulMinData[i]);
            }
            rulMinArea.sort(compare);
            rulMinArea = _.uniqBy(rulMinArea, 'xAxis');
            for(var i in rulMaxData){
              rulMaxArea.push(rulMaxData[i]);
            }
            rulMaxArea.sort(compare);
            rulMaxArea = _.uniqBy(rulMaxArea, 'xAxis');
            rulMaxArea.push(_.last(rulData));
            rulArea.append("path")
              .datum(rulMinArea)
              .attr("id", "rul-minArea")
              .attr("fill", "#32d1dc")
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("d", rulLine)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
            rulArea.append("path")
              .datum(rulMaxArea)
              .attr("id", "rul-maxArea")
              .attr("fill", "#32d1dc")
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("d", rulLine)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
              
            var rulAvgLine = rulArea.append("path")
              .datum(rulData)
              .attr("id", "rulAvgLine")
              .attr({ "fill": "none", "stroke": "#479fa5", "stroke-width": "2px" })
              .attr("d", rulLine);
            var totalLength = rulAvgLine.node().getTotalLength();
            rulAvgLine
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .delay(1000)
              .duration(1000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
            	.attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
            var rulMaxLine = rulArea.append("path")
              .datum(rulMaxData)
              .attr("id", "rulMaxLine")
              .attr({ "fill": "none", "stroke": "#479fa5", "stroke-width": "1px" })
              .attr("d", rulLine);
            var totalLength = rulMaxLine.node().getTotalLength();
            rulMaxLine
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
            var rulMinLine = rulArea.append("path")
              .datum(rulMinData)
              .attr("id", "rulMinLine")
              .attr({ "fill": "none", "stroke": "#479fa5", "stroke-width": "1px" })
              .attr("d", rulLine);
            var totalLength = rulMinLine.node().getTotalLength();
            rulMinLine
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .delay(1000)
              .duration(2000)
              .ease("linear")
              .attr("stroke-dashoffset", 0)
              .attr("visibility", (scope.isRULArea)? 'visible': 'hidden');
          }

         
          

          // Render line at today. yAxis is ranges from 0 to 1 as per design
          var lineData = [
            {"xAxis": todayX, "yAxis": 0},
            {"xAxis": todayX, "yAxis": 100}
          ];
          /* today-line group */
          var todayGroup = chartBody.append("g").attr("id", "today-group");
          todayGroup.append("path")
            .datum(lineData)
            .attr("id", "life-chart-todayLine")
            .attr("class", "todayLine")
            .attr("d", line);
          todayGroup.append("text")
            .attr("id", "life-chart-todayLabel")
            .attr("class", "lifeChartAxis")
            .attr("transform", "translate(" + x(todayX) + "," + 0 + ")")
            .attr("dx", "5px")
            .attr("dy", "10px")
            .text("Today");
          // render circular intersection dot
          todayGroup.selectAll("dot")
          .data(todayPoint)
          .enter().append("circle")
            .attr("id", "life-chart-intersect")
            .attr("class", "dots")
            .attr("r", "4")
            .attr("cx", function(d) {
                return x(d.xAxis);
            })
            .attr("cy", function(d){
              return y(d.yAxis);
            });
          todayGroup.attr("visibility", (scope.chartType === 'RUL')? ((scope.isRULTodayLine)? 'visible': 'hidden') : ((scope.isRODTodayLine)? 'visible': 'hidden'));

          chartBody.append("rect")
            .attr("id", "chart-rect" + "-" + scope.chartType)
            .attr("fill", "#3ed1db")
            .style("opacity", 1e-6)
            .attr("width", width)
            .attr("height", height / 2)
            .on({
              "mouseover": function(d) {
                showHoverLine();
                scope.$apply();
              },
              "mouseout": function(d) {
                hideHoverLine();
                scope.$apply();
              }
            })
            .on("mousemove", function(d){
              var mouseX = d3.mouse(this)[0];
              var mouseY = d3.mouse(this)[1];
              // NOTE: round number to nearest 100
              // var xPoint = Math.ceil((x.invert(mouseX))/100)*100;

              var xPoint = Number(parseFloat(x.invert(mouseX)).toFixed(2));

              if(scope.chartType === 'ROD'){
                var xPoint = Math.ceil((x.invert(mouseX))/100)*100;
              }
              if((scope.chartType === 'RUL') ? scope.isRULHealthLine : false){
                var healthLinePoint = _.find(healthDataTemp, function(d){
                  return d.xAxis == xPoint;
                });
              }
              // if((scope.chartType === 'RUL')? (scope.isRULSiteAvgLine): (scope.isRODSiteAvgLine)){
              //   var siteAvgLinePoint = _.find(siteAvgData, function(d){
              //     return d.xAxis === xPoint;
              //   });
              // }
              // if((scope.chartType === 'RUL')? (scope.isRULTrendLine): (scope.isRODTrendLine)){
              //   var trendLinePoint = _.find(trendData, function(d){
              //     return d.xAxis === xPoint;
              //   });
              // }
              if((scope.chartType === 'RUL')? (scope.isRULArea): false){
                var RULPoint = _.find(rulData, function(d){
                  return d.xAxis == xPoint;
                });
              }
              if((scope.chartType === 'RUL')? (scope.isRULArea): false){
                var RULMinPoint = _.find(rulMinData, function(d){
                  return d.xAxis == xPoint;
                });
              }
              if((scope.chartType === 'RUL')? (scope.isRULArea): false){
                var RULMaxPoint = _.find(rulMaxData, function(d){
                  return d.xAxis == xPoint;
                });
              }

              if((scope.chartType === 'ROD') && (scope.isROD)){
                var healthLinePoint = _.find(healthData, function(d){
                  return d.xAxis == xPoint;
                });
              }


              if(healthLinePoint){
                hoverLine.attr("x1", x(healthLinePoint.xAxis)).attr("x2", x(healthLinePoint.xAxis));
                healthLineCircle
                  .style("opacity", 1)
                  .attr("cx", x(healthLinePoint.xAxis))
                  .attr("cy", y(healthLinePoint.yAxis));
                scope.xvalue = healthLinePoint.xAxis;
                scope.healthvalue = healthLinePoint.yAxis;
              }

              if((scope.chartType === 'ROD') && (scope.isROD)){
                if(!healthLinePoint){
                  hoverLine.attr("x1", x(todayX)).attr("x2", x(todayX));
                  healthLineCircle
                  .style("opacity", 1)
                  .attr("cx", x(todayX))
                  .attr("cy", y(todayY));
                }
              }
              // if(trendLinePoint){
              //   hoverLine.attr("x1", x(trendLinePoint.xAxis)).attr("x2", x(trendLinePoint.xAxis));
              //   trendLineCircle
              //     .style("opacity", 1)
              //     .attr("cx", x(trendLinePoint.xAxis))
              //     .attr("cy", y(trendLinePoint.yAxis));
              //   scope.xvalue = trendLinePoint.xAxis;
              //   scope.trendvalue = trendLinePoint.yAxis;
              // }
              // if(siteAvgLinePoint){
              //   hoverLine.attr("x1", x(siteAvgLinePoint.xAxis)).attr("x2", x(siteAvgLinePoint.xAxis));
              //   siteAvgLineCircle
              //     .style("opacity", 1)
              //     .attr("cx", x(siteAvgLinePoint.xAxis))
              //     .attr("cy", y(siteAvgLinePoint.yAxis));
              //   scope.xvalue = siteAvgLinePoint.xAxis;
              //   scope.siteavgvalue = siteAvgLinePoint.yAxis;
              // }
              if(RULPoint){
                hoverLine.attr("x1", x(RULPoint.xAxis)).attr("x2", x(RULPoint.xAxis));
                rulAvgCircle
                  .datum(RULPoint)
                  .style("opacity", 1)
                  .attr("cx", function(d){ return x(d.xAxis);})
                  .attr("cy", function(d){ return y(d.yAxis);});
                scope.xvalue = RULPoint.xAxis;
                scope.trendvalue = RULPoint.yAxis;
              }
              if(RULMinPoint){
                hoverLine.attr("x1", x(RULMinPoint.xAxis)).attr("x2", x(RULMinPoint.xAxis));
                rulMinCircle
                  .datum(RULMinPoint)
                  .style("opacity", 1)
                  .attr("cx", function(d){ return x(d.xAxis);})
                  .attr("cy", function(d){ return y(d.yAxis);});
                scope.rulminvalue = RULMinPoint.yAxis;
              }
              if(RULMaxPoint){
                hoverLine.attr("x1", x(RULMaxPoint.xAxis)).attr("x2", x(RULMaxPoint.xAxis));
                rulMaxCircle
                  .datum(RULMaxPoint)
                  .style("opacity", 1)
                  .attr("cx", function(d){ return x(d.xAxis);})
                  .attr("cy", function(d){ return y(d.yAxis);});
                scope.rulmaxvalue = RULMaxPoint.yAxis;
              }
              scope.$apply();
            });
            var hoverLine = chartBody.append('line')
              .attr("id", "hover-line")
              .attr({ 'x1': 10, 'y1': 0, 'x2': 10, 'y2': height/2 })
              .attr('class', 'hoverLine')
              .style("opacity", 1e-6); // hidden by default
            function showHoverLine() {
              hoverLine.style("opacity", 1);
							if(scope.chartType === 'RUL' && scope.isRULHealthLine){
								healthLineCircle.style("opacity", 1);
							} else if(scope.chartType === 'ROD' && scope.isROD){
								healthLineCircle.style("opacity", 1);
							}
							// if(scope.chartType === 'RUL' && scope.isRULTrendLine){
							// 	trendLineCircle.style("opacity", 1);
							// } else if(scope.chartType === 'ROD' && scope.isRODTrendLine){
							// 	trendLineCircle.style("opacity", 1);
							// }
							// if(scope.chartType === 'RUL' && scope.isRULSiteAvgLine){
							// 	siteAvgLineCircle.style("opacity", 1);
							// } else if(scope.chartType === 'ROD' && scope.isRODSiteAvgLine){
							// 	siteAvgLineCircle.style("opacity", 1);
							// }
							if(scope.chartType === 'RUL' && scope.isRULArea){
								rulAvgCircle.style("opacity", 1);
	              rulMinCircle.style("opacity", 1);
	              rulMaxCircle.style("opacity", 1);
							}
            }
            function hideHoverLine() {
              hoverLine.style("opacity", 1e-6);
              healthLineCircle.style("opacity", 1e-6);
              // trendLineCircle.style("opacity", 1e-6);
              // siteAvgLineCircle.style("opacity", 1e-6);
              rulAvgCircle.style("opacity", 1e-6);
              rulMinCircle.style("opacity", 1e-6);
              rulMaxCircle.style("opacity", 1e-6);
              scope.xvalue = null;
              // scope.trendvalue = null;
              // scope.siteavgvalue = null;
              scope.healthvalue = null;
              scope.rulminvalue = null;
              scope.rulmaxvalue = null;
            }

            var healthLineCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 6)
              .attr("fill", "#65318f")
              .style("opacity", 1e-6);
            // var trendLineCircle = chartBody.append("circle")
            //   .attr("cx", 0)
            //   .attr("cy", 0)
            //   .attr("r", 3)
            //   .attr("fill", "#ea148c")
            //   .style("opacity", 1e-6);
            // var siteAvgLineCircle = chartBody.append("circle")
            //   .attr("cx", 0)
            //   .attr("cy", 0)
            //   .attr("r", 3)
            //   .attr("fill", "#d78219")
            //   .style("opacity", 1e-6);
            //TODO: try to reuse one circle point instead of three
            var rulAvgCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "#479fa5")
              .style("opacity", 1e-6);
            var rulMinCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "#479fa5")
              .style("opacity", 1e-6);
            var rulMaxCircle = chartBody.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "#479fa5")
              .style("opacity", 1e-6);

            if(scope.isRULArea){
              var rulMinLastPoint = _.last(rulMinData);
            	var rulAvgLastPoint = _.last(rulData);
            	var rulMaxLastPoint = _.last(rulMaxData);
            	var rulMinLastData = [
            		rulMinLastPoint, {"xAxis": parseFloat(rulMinLastPoint.xAxis).toFixed(2), "yAxis": -25}
            	];
            	var rulAvgLastData = [
            		rulAvgLastPoint, {"xAxis": parseFloat(rulAvgLastPoint.xAxis).toFixed(2), "yAxis": -55}
            	];
            	var rulMaxLastData = [
            		rulMaxLastPoint, {"xAxis": parseFloat(rulMaxLastPoint.xAxis).toFixed(2), "yAxis": -65}
              ];
              
              if(rulMinLastPoint.yAxis > 0 || scope.data.showMoreLines){
                var rulMinLabelLine = chartBody.append("path")
                .datum(rulMinLastData)
                .attr("id", "life-chart-minLine")
                .attr("class", "rulLabelLine")
                .attr("d", line);
                var rulMinLabelLineLength = rulMinLabelLine.node().getTotalLength();
                var xRulMinLabelPos = x(rulMinLastPoint.xAxis) - 30;
                rulMinLabelLine
                  .attr("stroke-dasharray", rulMinLabelLineLength + " " + rulMinLabelLineLength)
                  .attr("stroke-dashoffset", rulMinLabelLineLength)
                .transition()
                  .delay(2000)
                  .duration(2000)
                  .ease("linear")
                .attr("stroke-dashoffset", 0);
                chartBody.append("text")
              		.attr("id", "life-chart-minLabel")
              		.attr("class", "rulLineLabel")
              		.attr("text-anchor", "middle")
              		.attr("transform", "translate(" + xRulMinLabelPos + "," + y(-25) + ")")
                  .attr( "fill-opacity", 0 )
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr( "fill-opacity", 1 )
                  .text(rulMinLastPoint.xAxis + " " + "(min)");
              }
              if(rulAvgLastPoint.yAxis > 0 || scope.data.showMoreLines) {
                var rulAvgLabelLine = chartBody.append("path")
                .datum(rulAvgLastData)
                .attr("id", "life-chart-avgLine")
                .attr("class", "rulLabelLine")
                .attr("d", line);
                var rulAvgLabelLineLength = rulAvgLabelLine.node().getTotalLength();
                var xRulAvgLabelPos = x(rulAvgLastPoint.xAxis) - 30;
                rulAvgLabelLine
                  .attr("stroke-dasharray", rulAvgLabelLineLength + " " + rulAvgLabelLineLength)
                  .attr("stroke-dashoffset", rulAvgLabelLineLength)
                .transition()
                  .delay(2000)
                  .duration(2000)
                  .ease("linear")
                .attr("stroke-dashoffset", 0);
                chartBody.append("text")
              		.attr("id", "life-chart-avgLabel")
              		.attr("class", "rulLineLabel")
              		.attr("text-anchor", "middle")
              		.attr("transform", "translate(" + xRulAvgLabelPos + "," + y(-55) + ")")
                  .attr( "fill-opacity", 0 )
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr( "fill-opacity", 1 )
                  .text(rulAvgLastPoint.xAxis + " " + "(avg)");
              }
              if(rulMaxLastPoint.yAxis > 0 || scope.data.showMoreLines){
                var rulMaxLabelLine = chartBody.append("path")
                .datum(rulMaxLastData)
                .attr("id", "life-chart-maxLine")
                .attr("class", "rulLabelLine")
                .attr("d", line);
                var rulMaxLabelLineLength = rulMaxLabelLine.node().getTotalLength();
                var xRulMaxLabelPos = x(rulMaxLastPoint.xAxis) - 30;
                rulMaxLabelLine
                  .attr("stroke-dasharray", rulMaxLabelLineLength + " " + rulMaxLabelLineLength)
                  .attr("stroke-dashoffset", rulMaxLabelLineLength)
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr("stroke-dashoffset", 0);
                chartBody.append("text")
              		.attr("id", "life-chart-maxLabel")
              		.attr("class", "rulLineLabel")
              		.attr("text-anchor", "middle")
              		.attr("transform", "translate(" + xRulMaxLabelPos + "," + y(-65) + ")")
                  .attr( "fill-opacity", 0 )
                  .transition()
                    .delay(2000)
                    .duration(2000)
                    .ease("linear")
                  .attr( "fill-opacity", 1 )
                  .text((rulMaxLastPoint.xAxis + " " + "(max)"));
              }
            }
          // chartBody.append("text")
          //   .attr("id", "life-chart-todayLabel")
          //   .attr("class", "lifeChartAxis")
          //   .attr("transform", "translate(" + x(todayX) + "," + 0 + ")")
          //   .attr("dx", "5px")
          //   .attr("dy", "10px")
          //   .text("Today");
          // render labels
          if(scope.chartType == 'ROD'){
            chartBody.append("text")
            .attr("id", "life-chart-yLabel")
            .attr("class", "lifeChartLabels")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (-45) + "," + ((height/2)-150) + ") rotate(-90)")
            .text(scope.data.yLabel + ' (%)');
          } else{
            chartBody.append("text")
            .attr("id", "life-chart-yLabel")
            .attr("class", "lifeChartLabels")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (-45) + "," + ((height/2)-50) + ") rotate(-90)")
            .text(scope.data.yLabel + ' (%)');
          }
          

          chartBody.append("text")
            .attr("id", "life-chart-xLabel")
            .attr("class", "lifeChartLabels")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (50) + "," + ((height + padding)/2) + ")")
            .text(scope.data.xLabel);

          //TODO: RUL text
          // chartBody.append("text")
          //   .attr("id", "life-chart-rulLabel")
          //   .attr("class", "lifeChartAxis")
          //   .attr("transform", "translate(" + (width - 100) + "," + (height/3) + ")")
          //   .attr("dx", "5px")
          //   .attr("dy", "10px")
          //   .text("RUL");

        };

        scope.$watch('data', function(newValue) {
          if(newValue){
            $timeout(function() {
              scope.render();
            }, 300);
          }
        }, true);

        // scope.render(scope.data, scope.today);

        // $timeout(function() {
        //   scope.$watch('today', function(newValue) {
        //     if(newValue){
        //       element.removeAttr("life-chart");
        //       $compile(element)(scope);
        //       scope.render(scope.data, scope.today);
        //     }
        //   }, true);
        // }, 3000);

      } // link function ends
    } // return ends
  }]); // directive ends
})();
