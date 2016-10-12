angular.module('app')
    .controller('search_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function ($r_scope, $scope, $http, $state) {
            var authority_level = Number($.cookie('authority_level'));

            $scope._case = {
                current: app.models.search(),
                inferior: app.models.search()
            };

            var page = function() {
                return {
                    inited: false,
                    index: 0,
                    filtered: [1],
                    all_items: [],
                    size: 15,
                    per_num: 5,
                    offset_num: 3,
                    record_count: 0,
                    turn_to: function (index, position) {
                        position = position ? position : 'current';
                        if (index < 0) {
                            msg('已经是第一页');
                        } else if (index > (this.all_items.length - 1)) {
                            msg('已经是最后一页');
                        } else {
                            var i = 0, start_index = 0, end_index = 0;
                            angular.forEach($scope.page[position].filtered, function (val, j) {
                                if (val == (index + 1)) {
                                    i = j;
                                    return false;
                                }
                            });

                            if (i == 0 || i + 1 == $scope.page[position].filtered.length) { //the first one
                                $.each($scope.page[position].all_items, function (i, val) {
                                    if (val == (index + 1)) {
                                        return false;
                                    }
                                });

                                if (i == 0) {
                                    start_index = index - $scope.page[position].offset_num;
                                } else {
                                    start_index = index + $scope.page[position].offset_num - ($scope.page[position].per_num - 1);
                                }
                                start_index = start_index >= 0 ? start_index : 0;

                                end_index = start_index + $scope.page[position].per_num;
                                if (end_index + 1 >= $scope.page[position].all_items.length) {
                                    start_index = $scope.page[position].all_items.length - $scope.page[position].per_num;
                                    end_index = $scope.page[position].all_items.length;
                                }

                                $scope.page[position].filtered = $scope.page[position].all_items.slice(start_index, end_index);
                            }

                            $scope.page[position].index = index;
                            $scope.page.load_data(position);
                        }
                    },
                    load_data: function() {
                        //默认的方法 for case search
                    }
                };
            };

            $scope.page = {
                current: page(),
                inferior: page()
            };

            $scope.page.load_data = function (position) { //重写load_data
                position = position ? position : 'current';
                var url = position == 'current' ? 'index/self_case' : 'index/inferior_cases';

                $http.get(url, {
                    params: {
                        authority_level: authority_level,
                        page_index: $scope.page[position].index,
                        page_size: $scope.page[position].size,
                        insurant_idcard: $scope._case[position].condition.insurant_idcard,
                        policy_id: $scope._case[position].condition.policy_id,
                        insurant_name: $scope._case[position].condition.insurant_name,
                        t: Math.random()
                    }
                }).then(function (response) {
                    if (angular.isObject(response.data)) {
                        $scope._case[position].search.filter = response.data.cases;
                        $scope._case[position].search.selected = response.data.cases.last();

                        if (response.data.page_count > 0) {
                            $scope.page[position].all_items = [];
                            for (var i = 0; i < response.data.page_count; i++) {
                                $scope.page[position].all_items.push(i + 1);
                            }

                            $scope.page[position].record_count = response.data.record_count;
                            if (!$scope.page[position].inited) {
                                if ($scope.page[position].all_items.length >= $scope.page[position].per_num) {
                                    $scope.page[position].filtered = $scope.page[position].all_items.slice(0, $scope.page[position].per_num);
                                } else {
                                    $scope.page[position].filtered = $scope.page[position].all_items;
                                }
                                $scope.page[position].inited = true;
                            }
                        }
                    } else {
                        msg("index/self_case 请求出错");
                        throw response.data; ;
                    }
                });
            };

            $scope.fn = {
                search: {
                    select: function (_case, position) {
                        position = position ? position : 'current';
                        if (position == 'inferior' && _case.is_submit <= 0) {
                            return;
                        } else if (position == 'current' && _case.is_submit > 0) {
                            return;
                        }
                        $.each($scope._case[position].search.filter, function () {
                            if (this.cid == _case.cid) {
                                this.checked = true;
                            } else {
                                this.checked = false;
                            }
                        });
                        $scope._case[position].search.selected = _case;
                    },
                    from_server: function () {
                        $scope.page.current.inited = false;
                        $scope.page.current.index = 0;
                        $scope.page.load_data();
                    },
                    clear_condition: function (field, position) {
                        if (field != 'insurant_idcard') {
                            $scope._case[position].condition.insurant_idcard = undefined;
                        }
                        if (field != 'policy_id') {
                            $scope._case[position].condition.policy_id = undefined;
                        }
                        if (field != 'insurant_name') {
                            $scope._case[position].condition.insurant_name = undefined;
                        }
                    }
                },
                load_cases: function () {
                    $('#select_case').modal('show');
                    $scope.page.inferior.inited = false;
                    $scope.page.inferior.index = 0;
                    $scope.page.load_data('inferior');
                },
                create: function () {
                    switch (authority_level) {
                        case 1:
                            $http.get('/index/cid?t=' + Math.random()).then(function (response) {
                                if (Number(response.data) > 0) {
                                    var date = new Date();

                                    $r_scope._case = app.models._case({
                                        cid: response.data,
                                        current_state: 1,
                                        is_reported: 1,
                                        report_time: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                                        hospital_is_two_public: 1,
                                        report_user: $.cookie('username'),
                                        case_type: '正常件'
                                    });
                                    $state.go('policy.report');
                                } else {
                                    msg("请求出错");
                                    throw response.data; ;
                                }
                            });
                            break;
                        default:
                            $('#select_case').modal('hide');
                            $('.modal-backdrop').fadeOut(800).remove();
                            $http.get('/index/modify_case?cid=' + $scope._case.inferior.search.selected.cid).then(function (response) {
                                if (angular.isObject(response.data)) {
                                    $r_scope._case = response.data;
                                    $r_scope._case.current_state = authority_level;
                                    $r_scope._case.is_submit = 0;
                                    $r_scope.investigation = undefined;
                                    switch (authority_level) {
                                        case 2:
                                            $r_scope._case.record_user = $.cookie('username');
                                            $state.go('policy.record');
                                            break;
                                        case 3:
                                            $r_scope._case.is_data_holonomic = 1;
                                            $r_scope._case.is_informed = 0;
                                            $r_scope._case.is_diffcult = 0;
                                            $r_scope._case.adjust_user = $.cookie('username');
                                            $r_scope._case.is_diffcult = 0;
                                            $state.go('policy.adjust');
                                            break;
                                        case 4:
                                            $r_scope._case.is_need_communication = 0;
                                            $r_scope._case.communication_result = -1;
                                            $r_scope._case.check_result = 1;
                                            $r_scope._case.check_user = $.cookie('username');
                                            $state.go('policy.check');
                                            break;
                                        case 5:
                                            $r_scope._case.approval_result = 1;
                                            $r_scope._case.approval_user = $.cookie('username');
                                            $state.go('policy.approval');
                                            break;
                                    }
                                } else {
                                    msg("请求出错");
                                    throw response.data;
                                }
                            });
                            break;
                    }
                },
                modify: function () {
                    $http.get('/index/modify_case?cid=' + $scope._case.current.search.selected.cid).then(function (response) {
                        if (angular.isObject(response.data)) {
                            $r_scope._case = response.data;
                            $r_scope.investigation = undefined;
                            switch (authority_level) {
                                case 1:
                                    $state.go('policy.report');
                                    break;
                                case 2:
                                    $state.go('policy.record');
                                    break;
                                case 3:
                                    $state.go('policy.adjust');
                                    break;
                                case 4:
                                    $state.go('policy.check');
                                    break;
                                case 5:
                                    $state.go('policy.approval');
                                    break;
                            }
                        } else {
                            msg("请求出错");
                            throw response.data; ;
                        }
                    });
                }
            };

            $scope.fn.search.from_server();

            window.$r_scope = $r_scope;
        }
    ]);