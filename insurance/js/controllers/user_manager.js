angular.module('app')
    .controller('user_manager_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function ($r_scope, $scope, $http, $state) {
            $scope.dialog = {
                state: undefined,
                title: undefined,
                user: {}
            };

            $scope.users = {
                model: function(config) {
                    return $.extend({
                        id: undefined,
                        name: undefined,
                        password: undefined,
                        authority_level: undefined
                    }, config);
                },
                all: {
                    data: [],
                    load: function() {
                        $http.get('index/load_all_users').then(function(response) {
                            if ($.isArray(response.data)) {
                                $scope.users.all.data = response.data;
                                $scope.users.search.result = angular.copy($scope.users.all.data);
                                $scope.users.search.selected = $scope.users.search.result.last();
                            } else {
                                msg(response.data);
                                throw response.data;
                            }
                        });
                    }
                },
                search: {
                    condition: {
                        name: undefined,
                        role: undefined
                    },
                    result: [],
                    selected: undefined,
                    select: function(user) {
                        $.each($scope.users.search.result, function () {
                            if (this.id == user.id) {
                                this.checked = true;
                            } else {
                                this.checked = false;
                            }
                        });
                        $scope.users.search.selected = user;
                    },
                    filter: function () {
                        var result = $scope.users.all.data;
                        if (typeof this.condition.name == "string" && this.condition.name.trim().length > 0) {
                            result = $.grep($scope.users.all.data, function (_this) {
                                return _this.name.indexOf($scope.users.search.condition.name) >= 0;
                            });
                        }else if (typeof this.condition.role == "string") {
                            result = $.grep($scope.users.all.data, function (_this) {
                                return _this.role.indexOf($scope.users.search.condition.role) >= 0;
                            });
                        }
                        $scope.users.search.result = result;
                        $scope.users.search.selected = $scope.users.search.result.last();
                    }
                },
                query_state: function (state) {
                    if (typeof state != "string") {
                        return -1;
                    } else if (state.indexOf('管理') >= 0) {
                        return 0;
                    } else if (state.indexOf('报案') >= 0) {
                        return 1;
                    } else if (state.indexOf('初录') >= 0) {
                        return 2;
                    } else if (state.indexOf('理算') >= 0) {
                        return 3;
                    } else if (state.indexOf('审核') >= 0) {
                        return 4;
                    } else if (state.indexOf('审批') >= 0) {
                        return 5;
                    } else {
                        return -1;
                    }
                },
                action: {
                    save: function() {
                        if (typeof $scope.dialog.user.name != "string" || $scope.dialog.user.name.trim().length == 0) {
                            msg('用户名不能为空');
                        } else if (typeof $scope.dialog.user.password != "string" || $scope.dialog.user.password.trim().length == 0) {
                            msg('密码不能为空');
                        } else if (typeof $scope.dialog.user.role != "string") {
                            msg('岗位不能为空');
                        } else {
                            var params = {
                                uid: $scope.dialog.user.id,
                                user_name: $scope.dialog.user.name.trim(),
                                password: $scope.dialog.user.password.trim(),
                                authority_level: $scope.users.query_state($scope.dialog.user.role)
                            };
                            var url = "";
                            if ($scope.dialog.state == 'create') {
                                url = 'index/add_user?user_info=';
                            } else {
                                url = 'index/modify_user?user_info=';
                            }

                            $http.post(url + angular.toJson(params)).then(function (response) {
                                if (response.data > 0) {
                                    if ($scope.dialog.state == 'create') {
                                        $scope.users.all.data.push($scope.dialog.user);
                                        $scope.users.search.result.push($scope.dialog.user);
                                        msg('保存成功！');
                                    } else {
                                        var index = $scope.users.all.data._find('id', params.uid, 'index');
                                        $scope.users.all.data[index] = $scope.dialog.user;
                                        index = $scope.users.search.result._find('id', params.uid, 'index');
                                        $scope.users.search.result[index] = $scope.dialog.user;
                                        //$scope.users.search.select($scope.dialog.user);
                                        msg('修改成功！');
                                    }
                                    $('#user_modal').modal('hide');
                                    $('.modal-backdrop').fadeOut(800).remove();
                                } else {
                                    msg(response.data);
                                    throw response.data;
                                }
                            });
                        }
                    },
                    create: function () {
                        $scope.dialog = {
                            state: 'create',
                            title: "新增用户",
                            user: $scope.users.model({
                                role: undefined,
                                password: 'sa'
                            })
                        };
                        $('#user_modal').modal('show');
                    },
                    modify: function() {
                        $scope.dialog = {
                            state: 'modify',
                            title: "修改用户信息",
                            user: angular.copy($scope.users.search.selected)
                        };
                        $('#user_modal').modal('show');
                    },
                    drop: function() {
                        if (confirm("是否确认删除该用户？") && $scope.users.search.selected) {
                            $http.post('index/delete_user?uid=' + $scope.users.search.selected.id).then(function (response) {
                                if (response.data > 0) {
                                    $scope.users.all.data = $scope.users.all.data.remove_by('id', $scope.users.search.selected.id);
                                    $scope.users.search.result = $scope.users.search.result.remove_by('id', $scope.users.search.selected.id);
                                    msg('删除成功！');
                                    
                                    $('#user_modal').modal('hide');
                                    $('.modal-backdrop').fadeOut(800).remove();
                                } else {
                                    msg(response.data);
                                    throw response.data;
                                }
                            });
                        }
                    }
                }
            };

            $scope.users.all.load();
        }
]);