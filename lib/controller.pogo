crumb trail = require './crumb_trail'.crumb trail

headers = { 'X-Requested-With' = 'rest-browser' }

exports.Controller ($scope, $http, $location) =

    url = $location.$$path.substring(1)
    if (url.index of 'http' != 0)
        url := (window.location.protocol + '//' + window.location.host) + '/' + url
    
    $scope.trail = crumb trail (url)
    
    ajax = $.ajax {
        url = url
        type = "GET"
        cross domain = true
        headers = headers
        data type = 'xml'
    }.done @(xml)
        $scope.doc = { root = xml.first child, url = url }
        $scope.$digest()
    .error @(err)
        $scope.httpError = "Non XML response"
        $scope.$digest()

