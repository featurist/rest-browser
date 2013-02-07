
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), module = cache[path], fn;
      if (module) {
        return module.exports;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"client": function(exports, require, module) {(function() {
    var self = this;
    var renderXml, RootController, client;
    renderXml = require("./render_xml").renderXml;
    RootController = require("./root_controller").RootController;
    client = angular.module("client", []).config(function($routeProvider) {
        return $routeProvider.otherwise({
            controller: RootController,
            templateUrl: "templates/root.html"
        });
    });
    client.directive("xelement", function() {
        var link;
        link = function(scope, element, attrs) {
            return scope.$watch(attrs.xelement, function(xmlNode) {
                if (xmlNode) {
                    return renderXml(xmlNode, element, 0);
                }
            });
        };
        return link;
    });
}).call(this);}, "crumb_trail": function(exports, require, module) {(function() {
    var self = this;
    exports.crumbTrail = function(path) {
        var self = this;
        var matches, host, crumbs, parts, url, gen1_items, gen2_i, part;
        matches = /^\/(https?\:\/\/([^\/]+))?(.*)$/.exec(path);
        host = matches[1];
        path = matches[3];
        crumbs = [];
        parts = path.split("/");
        if (typeof host === "undefined") {
            crumbs.push({
                text: window.location.protocol + "//" + window.location.host,
                href: "/"
            });
            url = [ "" ];
        } else {
            crumbs.push({
                text: host,
                href: host
            });
            url = [ host ];
            parts.shift();
        }
        if (path.length > 1) {
            gen1_items = parts;
            for (gen2_i = 0; gen2_i < gen1_items.length; ++gen2_i) {
                part = gen1_items[gen2_i];
                url.push(part);
                crumbs.push({
                    text: part,
                    href: url.join("/")
                });
            }
        }
        return crumbs;
    };
}).call(this);}, "render_xml": function(exports, require, module) {(function() {
    var self = this;
    var localhostRoot, spaces;
    localhostRoot = "http://localhost/Euromoney.Isis.Api/";
    exports.renderXml = function(xmlNode, element, indent) {
        var self = this;
        var container, gen1_items, gen2_i, att, href, gen3_items, gen4_i, childNode, text;
        container = $("<div />").appendTo(element);
        container.append(spaces(indent));
        if (xmlNode.tagName) {
            container.append("&lt;");
            container.append("<span class='tagname'>" + xmlNode.tagName + "</span>");
            gen1_items = xmlNode.attributes;
            for (gen2_i = 0; gen2_i < gen1_items.length; ++gen2_i) {
                att = gen1_items[gen2_i];
                container.append(" ");
                container.append("<span class='attname'>" + att.name + "</span>");
                container.append('="');
                if (att.name === "href") {
                    href = "#/" + att.value.replace(localhostRoot, "");
                    container.append("<a href='" + href + "' class='attvalue'>" + att.value + "</a>");
                } else {
                    container.append("<span class='attvalue'>" + att.value + "</span>");
                }
                container.append('"');
            }
            if (xmlNode.childNodes.length > 0) {
                container.append(">");
                container.append("<br />");
                gen3_items = xmlNode.childNodes;
                for (gen4_i = 0; gen4_i < gen3_items.length; ++gen4_i) {
                    childNode = gen3_items[gen4_i];
                    exports.renderXml(childNode, container, indent + 1);
                }
                container.append(spaces(indent));
                return container.append("&lt;/<span class='tagname'>" + xmlNode.tagName + "</span>&gt;");
            } else {
                return container.append(" /&gt;");
            }
        } else {
            text = $(xmlNode).text();
            if (text.length > 0) {
                return container.append($(xmlNode).text());
            }
        }
    };
    spaces = function(n) {
        var indentString, i;
        indentString = "";
        for (i = 0; i < n * 4; i = i + 1) {
            indentString = indentString + "&nbsp;";
        }
        return indentString;
    };
}).call(this);}, "root_controller": function(exports, require, module) {(function() {
    var self = this;
    var crumbTrail, headers;
    crumbTrail = require("./crumb_trail").crumbTrail;
    headers = {};
    exports.RootController = function($scope, $http, $location) {
        var self = this;
        var segments;
        segments = [];
        $scope.trail = crumbTrail($location.$$path);
        return $.ajax({
            url: $location.$$path.substring(1),
            type: "GET",
            crossDomain: true,
            headers: headers,
            dataType: "xml"
        }).done(function(xml) {
            $scope.xml = xml.firstChild;
            return $scope.$digest();
        }).error(function(err) {
            $scope.httpError = err.status + " " + err.statusText;
            return $scope.$digest();
        });
    };
}).call(this);}});
