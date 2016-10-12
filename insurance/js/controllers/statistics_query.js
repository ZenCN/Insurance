angular.module('app')
    .controller('statistics_query_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function ($r_scope, $scope, $http, $state) {
            $scope.search = {
                condition: {
                    report_time: {
                        start: tools.get_one_day(-15),
                        end: tools.get_today()
                    }
                },
                result: [],
                from_server: function () {
                    $('#chart_bt').highcharts({
                        chart: {
                            type: 'pie',
                            options3d: {
                                enabled: true,
                                alpha: 45,
                                beta: 0
                            }
                        },
                        title: {
                            text: $scope.search.condition.report_time.start + '~' + $scope.search.condition.report_time.end + '案件处理情况'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.y}件</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                depth: 35,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}'
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: '案件个数',
                            data: [
                                        ['报案', 5],
                                        ['初录', 6],
                                        ['理算', 6],
                                        ['审核', 8],
                                        ['审批', 3],
                                        {
                                            name: '已结案',
                                            y: 2,
                                            sliced: true,
                                            selected: true
                                        }
                                    ]
                        }]
                    });
                }
            };
        }
]);