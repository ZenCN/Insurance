angular
    .module('app', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar'
    ])
    .config([
        '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            $urlRouterProvider.when('', '/login');
            $urlRouterProvider.otherwise('/policy/search');

            var resolve_dep = function (config) {
                return {
                    load: function ($ocLazyLoad) {
                        return $ocLazyLoad.load(config);
                    }
                };
            };

            $stateProvider
                .state('policy', {
                    url: '/policy',
                    controller: 'main_ctrl',
                    templateUrl: 'templates/main.html',
                    resolve: resolve_dep([
                        'js/controllers/main.js',
                        'js/directives/header/header.js',
                        'js/directives/sidebar/sidebar.js',
                    ])
                })
                .state('policy.search', {
                    url: '/search',
                    controller: 'search_ctrl',
                    templateUrl: function () {
                        if ($.cookie('authority_level') <= 3) {
                            return 'templates/search/normal.html';
                        } else {
                            return 'templates/search/unnormal.html';
                        }
                    },
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'search';
                    },
                    resolve: resolve_dep([
                        'js/controllers/search.js',
                        'js/directives/main.js',
                        'js/models/main.js',
                        'css/dataTables.bootstrap.css'
                    ])
                })
                .state('policy.report', {
                    templateUrl: 'templates/policy/report/wrap.html',
                    url: '/report',
                    controller: 'report_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'report';
                    },
                    resolve: resolve_dep('js/controllers/report.js')
                })
                .state('policy.record', {
                    templateUrl: 'templates/policy/record/wrap.html',
                    url: '/record',
                    controller: 'record_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'record';
                    },
                    resolve: resolve_dep('js/controllers/report.js')
                })
                .state('policy.adjust', {
                    templateUrl: 'templates/policy/adjust/wrap.html',
                    url: '/adjust',
                    controller: 'adjust_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'adjust';
                    },
                    resolve: resolve_dep('js/controllers/adjust.js')
                })
                .state('policy.check', {
                    templateUrl: 'templates/policy/check/wrap.html',
                    url: '/check',
                    controller: 'check_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'check';
                    },
                    resolve: resolve_dep('js/controllers/check.js')
                })
                .state('policy.approval', {
                    templateUrl: 'templates/policy/approval/wrap.html',
                    url: '/approval',
                    controller: 'approval_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'approval';
                    },
                    resolve: resolve_dep('js/controllers/approval.js')
                })
                .state('policy.general_query', {
                    templateUrl: 'templates/query/general_query.html',
                    url: '/general_query',
                    controller: 'general_query_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'general_query';
                    },
                    resolve: resolve_dep('js/controllers/general_query.js')
                })
                .state('policy.details_query', {
                    templateUrl: 'templates/query/details_query.html',
                    url: '/details_query',
                    controller: 'details_query_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'details_query';
                    },
                    resolve: resolve_dep('js/controllers/details_query.js')
                })
                .state('policy.statistics_query', {
                    templateUrl: 'templates/query/statistics_query.html',
                    url: '/statistics_query',
                    controller: 'statistics_query_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'statistics_query';
                    },
                    resolve: resolve_dep('js/controllers/statistics_query.js')
                })
                .state('policy.user_manager', {
                    templateUrl: 'templates/user_manager.html',
                    url: '/user_manager',
                    controller: 'user_manager_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'user_manager';
                    },
                    resolve: resolve_dep('js/controllers/user_manager.js')
                })
                .state('policy.data_config', {
                    templateUrl: 'templates/data_config.html',
                    url: '/data_config',
                    controller: 'data_config_ctrl',
                    onEnter: function ($rootScope) {
                        $rootScope.state = 'data_config';
                    },
                    resolve: resolve_dep('js/controllers/data_config.js')
                })
                .state('login', {
                    templateUrl: 'templates/login.html',
                    url: '/login',
                    resolve: resolve_dep('js/directives/login.js')
                });
        }
    ]);