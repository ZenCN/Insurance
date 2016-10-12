angular.module('app')
    .controller('main_ctrl', [
        '$rootScope', '$scope', '$http', function($r_scope, $scope, $http) {
            $r_scope.collapse = {
                claim_process: false,
                comprehensive_query: true,
                tab: 'claim_process'
            };

            $r_scope.users = {};
            $r_scope.users.action = {
                modify: function() {
                    $http.get('index/get_user?name=' + $r_scope.user.name + '&authority_level=' + $r_scope.user.authority_level).then(function(response) {
                        if (!$.isEmptyObject(response.data)) {
                            $scope.dialog = {
                                state: 'modify',
                                title: "修改用户信息",
                                user: response.data
                            };
                            $('#user_modal').modal('show');
                        } else {
                            msg('未找到该用户信息，请重新登录');
                        }
                    });
                },
                save: function() {
                    var params = {
                        uid: $scope.dialog.user.id,
                        user_name: $scope.dialog.user.name.trim(),
                        password: $scope.dialog.user.password.trim(),
                        authority_level: $scope.dialog.user.authority_level
                    };
                    $http.get('index/modify_user?user_info=' + angular.toJson(params)).then(function(response) {
                        if (response.data > 0) {
                            msg('修改成功！');
                            $('#user_modal').modal('hide');
                            $('.modal-backdrop').fadeOut(800).remove();
                        } else {
                            msg(response.data);
                            throw response.data;
                        }
                    });
                }
            };

            $r_scope.page = {
                inited: false,
                index: 0,
                filtered: [1],
                all_items: [],
                size: 15,
                per_num: 5,
                offset_num: 3,
                record_count: 0,
                turn_to: function(index, position) {
                    if (index < 0) {
                        msg('已经是第一页');
                    } else if (index > (this.all_items.length - 1)) {
                        msg('已经是最后一页');
                    } else {
                        var i = 0, start_index = 0, end_index = 0;
                        angular.forEach($r_scope.page.filtered, function(val, j) {
                            if (val == (index + 1)) {
                                i = j;
                                return false;
                            }
                        });

                        if (i == 0 || i + 1 == $r_scope.page.filtered.length) { //the first one
                            $.each($r_scope.page.all_items, function(i, val) {
                                if (val == (index + 1)) {
                                    return false;
                                }
                            });

                            if (i == 0) {
                                start_index = index - $r_scope.page.offset_num;
                            } else {
                                start_index = index + $r_scope.page.offset_num - ($r_scope.page.per_num - 1);
                            }
                            start_index = start_index >= 0 ? start_index : 0;

                            end_index = start_index + $r_scope.page.per_num;
                            if (end_index + 1 >= $r_scope.page.all_items.length) {
                                start_index = $r_scope.page.all_items.length - $r_scope.page.per_num;
                                end_index = $r_scope.page.all_items.length;
                            }

                            $r_scope.page.filtered = $r_scope.page.all_items.slice(start_index, end_index);
                        }

                        this.index = index;
                        this.load_data(position);
                    }
                },
                load_data: function() {
                    //默认的方法 for case search
                }
            };

            $r_scope.$watch('_case.is_reported', function(to) {
                if (to <= 0) {
                    $r_scope._case.report_type = "";
                }
            });
            $r_scope.$watch('_case.hospital_is_two_public', function(to) {
                if (to > 0) {
                    $r_scope._case.hospital_type = "";
                }
            });

            if ($r_scope.field_values == undefined) {
                $r_scope.field_values = {};
                $http.get('index/get_field_range?t=' + Math.random()).then(function(response) {
                    if (!$.isEmptyObject(response.data)) {
                        $.each(response.data, function(field, val) {
                            $r_scope.field_values[field] = val.split('、');
                        });
                    }
                });
            }
        }
    ]);