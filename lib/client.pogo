render xml = require './render_xml'.render xml
Root Controller = require './root_controller'.Root Controller

client = angular.module 'client' [].config @($route provider)
    $route provider.otherwise {
        controller = Root Controller
        template url = 'templates/root.html'
    }

client.directive 'xelement'
    link (scope, element, attrs) =
        scope.$watch (attrs.xelement) @(xml node)
            if (xml node)
                render xml (xml node, element, 0)
    
    link

