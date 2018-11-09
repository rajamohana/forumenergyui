'use strict';
(function(){
    angular.module('cyient.insights', [
        'cyient.areachart',
        'cyient.barcharthoriz',
        'cyient.donut',
        'cyient.onfinishrender',
        'cyient.popup',
        'cyient.scrolltowhen'
    ])
        .controller('Insights', Insights);

    Insights.$inject = ['$scope', '$location', '$cookies', '$timeout', 'InsightsService', '$log', '$window', '$rootScope'];
    function Insights($scope, $location, $cookies, $timeout, InsightsService, $log, $window, $rootScope){
    	$rootScope.currentState = "insights";
    	$scope.ins = {};
        $window.scrollTo(0, 0);
        // default data
        // $scope.siteData = $cookies.getObject('siteData')[0];
        var loginData = $cookies.getObject('loginData');
        var params=$location.search();
        var userId = loginData.userId;
        var siteId = params.siteId;

        $scope.truckId = params.truckId;
        $scope.partName = params.partName;
        $scope.categories = params.categories;
        $scope.categoryId = params.categoryId;
        $scope.variableName = params.variableName;
        $scope.assetType = params.assetType;

        $scope.popupData = {};

        // $scope.variableName = 'Average Payload Tonns';

        $scope.currIndex = _.findIndex($scope.categories, function(category) {
            return category === $scope.categoryName;
        });
        if ($scope.currIndex === -1) {
            $scope.currIndex = 0;
        }

        $scope.goToState = function(str){
            $location.path(str);
        }

        $scope.changeCategory = function(index) {
            $scope.currIndex = index;
            $scope.getCategoryData($scope.categories[$scope.currIndex]);
        };

        $scope.firstTimeCall = true;
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $timeout(function() {
                $scope.firstTimeCall = false;
            }, 2000);
        });

        $scope.showGraphPopup = function(variable){
            $log.log(variable);
            var userId = loginData.userId;
            var siteId = siteId;
            var categoryId = $scope.categoryId;
            var assetId = $scope.truckId;
            var assetType = $scope.assetType;
            var sensorName = [variable.name];

            InsightsService.getDaysData(userId, siteId, categoryId, assetType, assetId, sensorName).then(function(data){
                var variableData = data[0];
                $scope.popupData.minOptimal = variableData.minOptimal;
                $scope.popupData.maxOptimal = variableData.maxOptimal;
                $scope.popupData.xLabel = variableData.xLabel;
                $scope.popupData.yLabel = variableData.yLabel;
                $scope.popupData.popupLineGraph = variableData.variableGraph;
                var nowDate = Date.now();

                var len = variableData.variableGraph.length;
                for(var j = len; j > 0; j--) {
                    nowDate = nowDate - (5 * 36000 * 1000);	
                    $scope.popupData.popupLineGraph[j-1].xValue = nowDate;	
                }
                variable.showPopup = true;
            });
            
        };

        $scope.closePopup = function(variable){
            variable.showPopup = false;
            $scope.popupData = {};
        }

        $scope.getCategoryData = function(categoryName) {
            var userId = loginData.userId;
            var siteId = siteId;
            var categoryId = $scope.categoryId;
            var assetId = $scope.truckId;
            var assetType = $scope.assetType;
            var sensorNames = _.chain($scope.categories).filter(function (sensor) {
                                return sensor;
                            })
                            .map(function (sensor) {
                                return sensor.name;
                            })
                            .uniq()
                            .value();
            
            InsightsService.getData(
                userId,
                siteId,
                assetId,
                categoryId,
                assetType,
                sensorNames
            )
                .then(function(data) {
                if(data.status === "ERROR"){
                    return
                } else {
                    $scope.variables = data.map(function(variable) {

                        var result = {};

                        // result.name = variable.variableName.replace(/_|-/g, "
						// ");
                        result.name = variable.variableName;
                        result.displayName = categoryName.filter(function(sensor){
                            return sensor.name == result.name;
                        })
                        result.paramtype = variable.paramtype;
                        result.duration = variable.duration;
                        result.varTrend = variable.varTrend;

                        // result.trucks = {
                        // min: variable.trucks.min,
                        // max: variable.trucks.max,
                        // avg: variable.trucks.avg,
                        // };

                        // result.site = {
                        // min: variable.site.min,
                        // max: variable.site.max,
                        // avg: variable.site.avg,
                        // };

                        // Parsing area-chart
                        // result.trendGraph = variable.trendGraph;
                        // result.siteAvgGraph = variable.siteAvgGraph;
                        
                        // result.Graph = variable.Graph;

                        result.lineGraph = variable.variableGraph;
                        var nowDate = Date.now();

                        var len = result.lineGraph.length
                        for(var j =  len; j > 0; j--) {
                            // if(j < 18000) {
                                nowDate = nowDate - (10 * 1000);
                                result.lineGraph[j-1].xValue = nowDate;
                            // } else {
                            // nowDate = nowDate - 36000 * 1000;
                            // graphData[j].xValue = nowDate;
                            // }
                            // graphData[j].yValue = Math.random(80, 100)*100;
                        }

                        // $log.log(graphData);
                        result.Graph = result.lineGraph;

                        result.minOptimal = variable.minOptimal;
                        result.maxOptimal = variable.maxOptimal;
                        result.xLabel = variable.xLabel;
                        result.yLabel = variable.yLabel;

                        if (variable.paramtype === 'Total') {

                            result.totalObj = variable.totalObj;

                        } else if (variable.paramtype === 'Avg') {

                            result.avgObj = variable.avgObj;

                        } else if (variable.paramtype === 'Overload') {

                            result.overLoadObj = variable.overLoadObj;

                        }
                        return result;
                    });
                }

            }, function(err) {
                $log.warn(err);
            })
        }; // End of getCategoryData function

       
        
        $scope.navigateToOverview = function() {
            $location.path("/assetdetails").search({"truckId": $scope.truckId,"assetType":$scope.assetType});            
        };

        $scope.getCategoryData($scope.categories);

    }; // End of controller
})(); // End of IFFE
