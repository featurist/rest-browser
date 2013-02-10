render doc = require './render_xml'.render doc
Controller = require './controller'.Controller

client = angular.module 'client' [].config @($route provider)
    $route provider.otherwise {
        controller = Controller
        template = '<ul id="trail">
                      <li ng-repeat="crumb in trail">
                        <span class="separator">/</span><a href="{{crumb.href}}">{{crumb.text}}</a>
                      </li>
                    </ul>

                    <div doc="doc" id="doc" />

                    <div id="error">{{httpError}}</div>'
    }

client.directive 'doc'
    link (scope, element, attrs) =
        scope.$watch (attrs.doc) @(doc)
            if (doc)
                render doc (doc, element)
    
    link

