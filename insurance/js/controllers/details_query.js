angular.module('app')
    .controller('details_query_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function ($r_scope, $scope, $http, $state) {
            $scope._case = {};

            $scope.page.load_data = function() { //重写load_data
                $http.get('index/details_query', {
                    params: {
                        start_time: $scope.search.condition.report_time.start,
                        end_time: $scope.search.condition.report_time.end,
                        page_index: $scope.page.index,
                        page_size: $scope.page.size,
                        t: Math.random()
                    }
                }).then(function(response) {
                    if (angular.isObject(response.data)) {
                        $scope.search.result = response.data.cases;

                        if (response.data.page_count > 0) {
                            $r_scope.page.all_items = [];
                            for (var i = 0; i < response.data.page_count; i++) {
                                $r_scope.page.all_items.push(i + 1);
                            }

                            $r_scope.page.record_count = response.data.record_count;
                            if (!$r_scope.page.inited) {
                                if ($r_scope.page.all_items.length >= $r_scope.page.per_num) {
                                    $r_scope.page.filtered = $r_scope.page.all_items.slice(0, $r_scope.page.per_num);
                                } else {
                                    $r_scope.page.filtered = $r_scope.page.all_items;
                                }
                                $r_scope.page.inited = true;
                            }
                        }
                    } else {
                        msg("index/details_query 请求出错");
                        throw response.data;;
                    }
                });
            };

            $scope.search = {
                condition: {
                    report_time: {
                        start: tools.get_one_day(-15),
                        end: tools.get_today()
                    },
                    fields: {
                        all: [
                            'insurant_name', 'insurant_habitation', 'accident_time',
                            'report_time', 'hospital_type', 'invoice_amount',
                            'deductible_amount', 'subtract_amount', 'compensation_type',
                            'compensation_amount'
                        ],
                        excel_config: {
                            insurant_name: {
                                index: 1
                            },
                            insurant_habitation: {
                                index: 2
                            },
                            accident_time: {
                                index: 3
                            },
                            report_time: {
                                index: 5
                            },
                            hospital_type: {
                                index: 6
                            },
                            invoice_amount: {
                                index: 7
                            },
                            deductible_amount: {
                                index: 8
                            },
                            subtract_amount: {
                                index: 9
                            },
                            compensation_type: {
                                index:10
                            },
                            compensation_amount: {
                                index:11
                            },
                        },
                        selected: undefined,
                        select_toggle: function (field) {
                            var target = event.target || event.srcElement;

                            if (field == 'all') {
                                if (target.checked) {
                                    $scope.search.condition.fields.selected = angular.copy($scope.search.condition.fields.all);
                                } else {
                                    $scope.search.condition.fields.selected = [];
                                }
                            } else {
                                if (target.checked) {
                                    this.selected.push(field);
                                } else {
                                    $.each(this.selected, function (i, name) {
                                        if (name == field) {
                                            $scope.search.condition.fields.selected.splice(i, 1);
                                            return false;
                                        }
                                    });
                                }
                            }
                        }
                    }
                },
                result: [],
                from_server: function() {
                    $r_scope.page.inited = false;
                    $scope.page.index = 0;
                    $scope.page.load_data();
                },
                export: function () {
                    var url = 'index/exportdetailsqueryresults?start_time=' + $scope.search.condition.report_time.start + '&end_time=' + $scope.search.condition.report_time.end;
                    var arr = [];
                    angular.forEach($scope.search.condition.fields.all, function(field) {
                        if (!$scope.search.condition.fields.selected.exist(field)) {
                            arr.push($scope.search.condition.fields.excel_config[field].index);   
                        }
                    });
                    url += '&hide_cols=';
                    if (arr.length > 0) {
                        url += arr.join(',');
                    } else {
                        url += 'none';
                    }
                    window.open(url);
                },
                query_name: function (field_name, field_val, is_submit) {
                    field_val = Number(field_val);
                    switch (field_name) {
                        case 'current_state':
                            if (is_submit) {
                                field_val++;
                            }
                            switch (field_val) {
                                case 1:
                                    return "报案";
                                case 2:
                                    return "初录";
                                case 3:
                                    return "理算";
                                case 4:
                                    return "审核";
                                case 5:
                                    return "审批";
                                default:
                                    return "已结案";
                            }
                        case 'check_result':
                            switch (field_val) {
                                case 0:
                                    return "建议拒赔";
                                case 1:
                                    return "建议给付";
                                case 2:
                                    return "核减";
                                default:
                                    return "未知";
                            }
                        case 'communication_result':
                            switch (field_val) {
                                case 0:
                                    return "未沟通";
                                case 1:
                                    return "正在沟通";
                                case 2:
                                    return "沟通通过";
                                default:
                                    return "未知";
                            }
                        case 'approval_result':
                            switch (field_val) {
                                case 0:
                                    return "同意拒赔";
                                case 1:
                                    return "审批同意";
                                case 2:
                                    return "核减";
                                default:
                                    return "未知";
                            }
                    }
                },
                view_case: function (cid) {
                    $('#view_case').modal('show');
                    $http.get('/index/modify_case?cid=' + cid).then(function (response) {
                        if (angular.isObject(response.data)) {
                            $scope._case.view = response.data;
                        } else {
                            msg("请求出错");
                            throw response.data; ;
                        }
                    });
                }
            }

            $scope.search.condition.fields.selected = angular.copy($scope.search.condition.fields.all);
            $scope.search.from_server();
        }
]);