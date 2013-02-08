crumb trail = require './crumb_trail'.crumb trail

headers = { 'X-Requested-With' = 'rest-browser' }

exports.Root Controller ($scope, $http, $location) =

    $scope.trail = crumb trail ($location.$$path)
    
    url = $location.$$path.substring(1) || (window.location.protocol + '//' + window.location.host)
    
    ajax = $.ajax {
        url = url
        type = "GET"
        cross domain = true
        headers = headers
        data type = 'xml'
    }.done @(xml)
        $('body').append("<div>HTTP DONE</div>")
        $scope.xml = xml.first child
        $scope.$digest()
    .error @(err)
        $scope.httpError = "Non XML response"
        $scope.$digest()

