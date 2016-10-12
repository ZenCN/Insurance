angular.module('app')
    .controller('report_ctrl', [
        '$rootScope', '$scope', '$http', '$state', function($r_scope, $scope, $http, $state) {
            $scope.fn = {
                check: {
                    is_reported: function() {

                    }
                },
                save: function (submit) {
                    if (submit) {
                        $scope._case.is_submit = 1;
                    } else {
                        $scope._case.is_submit = 0;
                    }

                    if ($scope._case.insurant_idcard && $scope._case.insurant_idcard.length == 18) {
                        var date = new Date();
                        var year = date.getFullYear();
                        var birthday_year = parseInt($scope._case.insurant_idcard.substr(6, 4));
                        $scope._case.insurant_age = year - birthday_year;
                    } else {
                        $scope._case.insurant_age = 0;
                    }


                    $http.post('index/save_case?case_=' + angular.toJson($scope._case))
                        .then(function(response) {
                            if (Number(response.data) > 0) {
                                $r_scope._case.id = response.data;
                                if (submit) {
                                    msg("保存并提交成功!");
                                    $r_scope._case.report_submit_time = tools.get_today();
                                } else {
                                    msg("保存成功!");
                                }
                            } else {
                                msg("请求出错");
                                throw response.data;;
                            }
                        });
                },
                reset: function() {
                    if (confirm("确定要重置吗？")) {
                        var date = new Date();
                        $scope._case = app.models._case({
                            id: $scope._case.id,
                            cid: $scope._case.cid,
                            current_state: 1,
                            is_reported: 1,
                            report_time: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                        });
                    }
                }
            };
        }
]);