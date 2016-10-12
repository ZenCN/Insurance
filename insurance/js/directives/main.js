angular.module('app')
    .directive('sideMenu', [
        '$ocLazyLoad', function ($ocLazyLoad) {
            return function ($scope, $element, $attrs) {
                $ocLazyLoad.load([
                    'js/libs/plugins/metisMenu/metisMenu.min.css',
                    'js/libs/plugins/metisMenu/metisMenu.min.js'
                ]).then(function() {
                    $(function () {
                        $element.metisMenu();

                        $(window).bind("load resize", function () {
                            topOffset = 50;
                            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
                            if (width < 768) {
                                $('div.navbar-collapse').addClass('collapse');
                                topOffset = 100; // 2-row-menu
                            } else {
                                $('div.navbar-collapse').removeClass('collapse');
                            }

                            height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
                            height = height - topOffset;
                            if (height < 1) height = 1;
                            if (height > topOffset) {
                                $("#page-wrapper").css("min-height", (height) + "px");
                            }
                        });

                        var url = window.location;
                        var element = $('ul.nav a').filter(function () {
                            return this.href == url || url.href.indexOf(this.href) == 0;
                        }).addClass('active').parent().parent().addClass('in').parent();
                        if (element.is('li')) {
                            element.addClass('active');
                        }
                    });
                });
            };
        }
    ])
    .directive('ngRegexp', [
        '$rootScope', function ($r_scope) {
            return function ($scope, $element, $attrs) {
                $element.blur(function () {
                    var result = undefined;
                    var arr = $attrs['ngModel'].split('.');

                    if ($r_scope[arr[0]][arr[1]] == "" || $r_scope[arr[0]][arr[1]] == undefined) {
                        $element.parent().removeClass('has-error');
                        return;
                    }

                    //正则表达式直接量也被定义为包含在一对斜杠'/'之间的字符
                    switch ($attrs['ngRegexp']) {
                        case 'idcard':
                            result = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($r_scope[arr[0]][arr[1]]);
                            break;
                        case 'number':
                            result = /^[0-9]+\.{0,1}[0-9]{0,2}$/.test($r_scope[arr[0]][arr[1]]); //2表示位小数
                            break;
                        case 'phone':
                            result = /^1[3|4|5|7|8]\d{9}$/.test($r_scope[arr[0]][arr[1]]) || /\d{3}-\d{7}|\d{4}-\d{7}/.test($r_scope[arr[0]][arr[1]])
                            break;
                        case 'bank_card':
                            result = /\d{19}/.test($r_scope[arr[0]][arr[1]]);
                            break;
                    }

                    if (!result) {
                        $element.parent().addClass('has-error');
                    } else {
                        $element.parent().removeClass('has-error');
                    }
                });
            };
        }
    ]).directive('multiSelect', [
        '$timeout', function () {
            return {
                restrict: 'A',
                scope: {
                    name: '=name',
                    model: '=',
                    options: '=',
                    pre_selected: '=preSelected'
                },
                template: "<div class='btn-group' ng-class='{open:open}'>" +
                    "<button class='btn'>{{name}}</button>" +
                    "<button class='btn dropdown-toggle' ng-click='open=!open'><span class='caret'></span></button>" +
                    "<ul class='dropdown-menu' name='multi-select-btn' aria-labelledby='dropdownMenu'>" +
                    "<li data-ng-repeat='val in options track by $index'> <a data-ng-click='setSelectedItem(val)'>{{val}}<span data-ng-class='isChecked(val)'></span></a></li>" +
                    "</ul>" +
                    "</div>",
                controller: function ($scope) {

                    if (typeof $scope.model == "string") {
                        $scope.selected_items = $scope.model.split(',');
                    }

                    $scope.setSelectedItem = function (val) {
                        if (val == $scope.pre_selected) {
                            if ($scope.selected_items.exist(val)) {
                                $scope.selected_items = [];
                            } else {
                                $scope.selected_items = [$scope.pre_selected];
                            }
                        } else {
                            angular.forEach($scope.selected_items, function (_this, i) {
                                if (_this == $scope.pre_selected) {
                                    $scope.selected_items.splice(i, 1);
                                    return false;
                                }
                            });
                            if ($scope.selected_items.exist(val)) {
                                angular.forEach($scope.selected_items, function (_this, i) {
                                    if (_this == val) {
                                        $scope.selected_items.splice(i, 1);
                                        return false;
                                    }
                                });
                            } else {
                                $scope.selected_items.push(val);
                            }
                        }

                        $scope.model = $scope.selected_items.join(',');
                    };
                    $scope.isChecked = function (val) {
                        if ($scope.selected_items && $scope.selected_items.exist(val)) {
                            return 'fa large fa-check-square-o pull-right';
                        }
                        return false;
                    };
                }
            };
        }
    ]).directive('subtractType', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    name: '=name',
                    model: '=',
                    options: '=',
                    count: '='
                },
                templateUrl: 'views/admin/subtract_type.html',
                controller: function ($scope) {
                    $scope.selected_items = {};
                    var arr = typeof $scope.model == "string" ? $scope.model.split('、') : [];
                    var key_val = [];
                    angular.forEach(arr, function (val) {
                        key_val = val.split('：');
                        $scope.selected_items[key_val[0]] = key_val[1];
                    });
                    angular.forEach($scope.options, function (val) {
                        if (!$scope.selected_items[val]) {
                            $scope.selected_items[val] = undefined;
                        }
                    });

                    $scope.sum = function () {
                        var count = undefined;
                        $scope.model = [];
                        angular.forEach($scope.options, function (val) {
                            if (Number($scope.selected_items[val]) > 0) {
                                $scope.model.push(val + '：' + $scope.selected_items[val]);
                                count = tools.calculator.addition(count, $scope.selected_items[val]);
                            }
                        });
                        $scope.model = $scope.model.join('、');
                        $scope.count = count;
                    };

                    $scope.isChecked = function (val) {
                        if (Number(val) > 0) {
                            return 'fa large fa-check-square-o';
                        }
                        return false;
                    };
                }
            };
        }
    ]);