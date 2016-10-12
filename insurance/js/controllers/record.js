angular.module('app')
    .controller('record_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function ($r_scope, $scope, $http, $state) {
            $scope.fn = {
                save: function (submit) {
                    if (submit) {
                        $scope._case.is_submit = 1;
                    }

                    var url = 'index/save_case?case_=' + angular.toJson($scope._case);
                    if ($r_scope.investigation) {
                        url += '&investigation=' + angular.toJson($scope.investigation);
                    }

                    $http.post(url)
                        .then(function (response) {
                            if (Number(response.data) > 0) {
                                $scope._case.id = response.data;
                                if (submit) {
                                    msg("保存并提交成功!");
                                    $r_scope._case.record_submit_time = tools.get_today();
                                } else {
                                    msg("保存成功!");
                                }
                            } else {
                                msg("请求出错");
                                throw response.data; ;
                            }
                        });
                },
                invest: {
                    start: function () {
                        $('#investModal').modal('show');
                        $r_scope.investigation = $r_scope.investigation || app.models.investigation({
                            cid: $r_scope._case.cid
                        });
                    },
                    save: function () {
                        $('#investModal').modal('hide');
                        $('.modal-backdrop').fadeOut(800).remove();
                        //$scope._case.is_investigate = 1;
                    }
                },
                reset: function () {
                    if (confirm("确定要重置吗？")) {
                        var date = new Date();
                        $scope._case = app.models._case({
                            id: $scope._case.id,
                            cid: $scope._case.cid,
                            current_state: 1,
                            report_time: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                        });
                    }
                }
            };
        }
]);