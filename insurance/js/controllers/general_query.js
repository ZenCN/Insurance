angular.module('app')
    .controller('general_query_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function ($r_scope, $scope, $http, $state) {
            var authority_level = Number($.cookie('authority_level'));

            $scope._case = {
                current: app.models.search(),
                view: app.models._case()
            };

            $scope.page.load_data = function() { //重写load_data
                $http.get('index/general_query', {
                    params: {
                        page_index: $scope.page.index,
                        page_size: $scope.page.size,
                        insurant_idcard: $scope._case.current.condition.insurant_idcard,
                        policy_id: $scope._case.current.condition.policy_id,
                        insurant_name: $scope._case.current.condition.insurant_name,
                        t: Math.random()
                    }
                }).then(function(response) {
                    if (angular.isObject(response.data)) {
                        $scope._case.current.search.all_cases = response.data.cases;
                        $scope._case.current.search.filter = response.data.cases;

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
                        msg("index/general_query 请求出错");
                        throw response.data;;
                    }
                });
            };

            $scope.fn = {
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
                },
                search: {
                    view: function (_case, position) {
                        position = position ? position : 'current';
                        if (position == 'inferior' && _case.is_submit <= 0) {
                            return;
                        } else if (position == 'current' && _case.is_submit > 0) {
                            return;
                        }
                        $.each($scope._case[position].search.all_cases, function () {
                            if (this.cid == _case.cid) {
                                this.checked = true;
                            } else {
                                this.checked = false;
                            }
                        });
                        $scope._case[position].search.selected = _case;
                    },
                    from_server: function () {
                        $r_scope.page.inited = false;
                        $scope.page.index = 0;
                        $scope.page.load_data();
                    },
                    clear_condition: function (field) {
                        if (field != 'insurant_idcard') {
                            $scope._case.current.condition.insurant_idcard = undefined;
                        }
                        if (field != 'policy_id') {
                            $scope._case.current.condition.policy_id = undefined;
                        }
                        if (field != 'insurant_name') {
                            $scope._case.current.condition.insurant_name = undefined;   
                        }
                    }
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
                }
            };

            $scope.fn.search.from_server();

            window.$r_scope = $r_scope;
        }
    ]);