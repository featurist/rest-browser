render doc = require './render_xml'.render doc
Controller = require './controller'.Controller

client = angular.module 'client' [].config @($route provider)
    $route provider.otherwise {
        controller = Controller
        template url = 'templates/root.html'
    }

client.directive 'doc'
    link (scope, element, attrs) =
        scope.$watch (attrs.doc) @(doc)
            if (doc)
                render doc (doc, element)
    
    link

