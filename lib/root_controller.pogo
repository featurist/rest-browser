crumb trail = require './crumb_trail'.crumb trail

headers = { 'X-Requested-With' = 'rest-browser' }

exports.Root Controller ($scope, $http, $location) =
    segments = []
    $scope.trail = crumb trail ($location.$$path)
    
    $.ajax {
        url = $location.$$path.substring(1)
        type = "GET"
        cross domain = true
        headers = headers
        data type = 'xml'
    }.done @(xml)
        $scope.xml = xml.first child
        $scope.$digest()
    .error @(err)
        $scope.httpError = "#(err.status) #(err.status text)"
        $scope.$digest()

