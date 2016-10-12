angular.module('app')
    .controller('data_config_ctrl', [
        '$rootScope', '$scope', '$http', function($r_scope, $scope, $http) {
            $scope.fields = {
                all: [
                    { report_type: '报案类型' }, { policy_type: '投保产品' }, { hospital_type: '医院类型' },
                    { accident_reason: '出险原因' }, { admissibility_type: '受理类型' }, { compensation_type: '理赔类型' },
                    { subtract_type: '核减类型' }, { rejected_type: '拒赔类型' }, { rejected_nature: '拒赔性质' },
                    { rejected_reason: '拒赔原因' }, { check_subtract_type: '审核核减类型' },
                    { case_source: '案件来源' }, { case_type: '案件类型' }
                ]
            };

            $scope.fn = {
                update: function() {
                    var params = [];
                    $.each($scope.fields, function (field_name) {
                        if (typeof this.new_val == "string" && this.new_val.trim().length > 0) {
                            params.push({
                                field_name: field_name,
                                field_value: this.new_val
                            });
                        }
                    });

                    $http.post('index/update_fields_val?fields_info=' + angular.toJson(params)).then(function(reponse) {
                        if (Number(reponse.data) > 0) {
                            msg('保存成功!');
                        } else {
                            msg(reponse.data);
                        }
                    });
                },
                refresh: function (field) {
                    if (typeof field.new_val == "string" && field.new_val.trim().length > 0) {
                        field.val_array = field.new_val.split('、');
                    } else {
                        field.val_array = [];
                    }
                }
            };

            $.each($scope.fields.all, function () {
                $.each(this, function(field, name) {
                    $scope.fields[field] = {
                        old_val: undefined,
                        new_val: undefined,
                        name: name,
                        val_array: undefined
                    };

                    if ($r_scope.field_values[field]) {
                        //$scope.fields[field].old_val = $r_scope.field_values[field];
                        $scope.fields[field].new_val = $r_scope.field_values[field].join('、');
                        $scope.fields[field].val_array = $r_scope.field_values[field];
                    }
                });
            });
            delete $scope.fields.all;

            window.$r_scope = $r_scope;
        }
    ]);