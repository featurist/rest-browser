
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
    var renderDoc, Controller, client;
    renderDoc = require("./render_xml").renderDoc;
    Controller = require("./controller").Controller;
    client = angular.module("client", []).config(function($routeProvider) {
        return $routeProvider.otherwise({
            controller: Controller,
            templateUrl: "templates/root.html"
        });
    });
    client.directive("doc", function() {
        var link;
        link = function(scope, element, attrs) {
            return scope.$watch(attrs.doc, function(doc) {
                if (doc) {
                    return renderDoc(doc, element);
                }
            });
        };
        return link;
    });
}).call(this);}, "controller": function(exports, require, module) {(function() {
    var self = this;
    var crumbTrail, headers;
    crumbTrail = require("./crumb_trail").crumbTrail;
    headers = {
        "X-Requested-With": "rest-browser"
    };
    exports.Controller = function($scope, $http, $location) {
        var self = this;
        var url, ajax;
        url = $location.$$path.substring(1);
        if (url.indexOf("http") !== 0) {
            url = window.location.protocol + "//" + window.location.host + "/" + url;
        }
        $scope.trail = crumbTrail(url);
        return ajax = $.ajax({
            url: url,
            type: "GET",
            crossDomain: true,
            headers: headers,
            dataType: "xml"
        }).done(function(xml) {
            $scope.doc = {
                root: xml.firstChild,
                url: url
            };
            return $scope.$digest();
        }).error(function(err) {
            $scope.httpError = "Non XML response";
            return $scope.$digest();
        });
    };
}).call(this);}, "crumb_trail": function(exports, require, module) {(function() {
    var self = this;
    exports.crumbTrail = function(absoluteUrl) {
        var self = this;
        var matches, authority, host, path, crumbs, parts, url, gen1_items, gen2_i, part, href;
        matches = /^(https?\:\/\/([^\/]+))?(.*)$/.exec(absoluteUrl);
        if (!matches) {
            throw new Error("Expected absolute URL, got " + absoluteUrl);
        }
        authority = window.location.protocol + "//" + window.location.host;
        host = matches[1];
        path = matches[3];
        crumbs = [];
        parts = path.replace(/^\//, "").replace(/\/$/, "").split("/");
        crumbs.push({
            text: host,
            href: "#/" + host.replace(authority, "")
        });
        url = [ host ];
        if (path.length > 1) {
            gen1_items = parts;
            for (gen2_i = 0; gen2_i < gen1_items.length; ++gen2_i) {
                part = gen1_items[gen2_i];
                url.push(part);
                href = url.join("/").replace(authority, "").replace(/^\/+/, "");
                crumbs.push({
                    text: part,
                    href: "#/" + href
                });
            }
        }
        return crumbs;
    };
}).call(this);}, "location": function(exports, require, module) {(function() {
    var self = this;
    var Location;
    Location = function(url) {
        var matches;
        matches = /^((https?)\:\/\/([^\/]+))?(.*)$/.exec(url);
        this.protocol = matches[2] || false;
        this.hostAndPort = matches[3] || false;
        this.pathAndQuery = matches[4];
        return this;
    };
    Location.prototype.combine = function(host, url) {
        var self = this;
        return url;
    };
    exports.Location = Location;
}).call(this);}, "render_xml": function(exports, require, module) {(function() {
    var self = this;
    var urls, renderNode, renderAttribute, asHrefRelativeTo, isWhitespace, spaces;
    urls = require("./urls");
    exports.renderDoc = function(doc, element) {
        var self = this;
        var html;
        html = renderNode(doc.url, doc.root, 0);
        return $(element).html(html);
    };
    renderNode = function(url, xmlNode, indent) {
        var str, gen1_items, gen2_i, att, gen3_items, gen4_i, childNode, text;
        if (isWhitespace(xmlNode)) {
            return "";
        }
        str = "<div class='xmlnode nodetype-" + xmlNode.nodeType + "'>";
        str = str + spaces(indent);
        if (xmlNode.nodeType === 1) {
            str = str + "&lt;";
            str = str + ("<span class='tagname'>" + xmlNode.tagName + "</span>");
            gen1_items = xmlNode.attributes;
            for (gen2_i = 0; gen2_i < gen1_items.length; ++gen2_i) {
                att = gen1_items[gen2_i];
                str = str + renderAttribute(att, url);
            }
            if (xmlNode.childNodes.length > 0) {
                str = str + "/&gt;";
                str = str + "<br />";
                gen3_items = xmlNode.childNodes;
                for (gen4_i = 0; gen4_i < gen3_items.length; ++gen4_i) {
                    childNode = gen3_items[gen4_i];
                    str = str + renderNode(url, childNode, indent + 1);
                }
                str = str + spaces(indent);
                str = str + ("&lt;/<span class='tagname'>" + xmlNode.tagName + "</span>&gt;");
            } else {
                str = str + " /&gt;";
            }
        } else {
            text = $(xmlNode).text();
            if (!text.match(/^[\n\s]+$/g)) {
                str = str + text;
            }
        }
        str = str + "</div>";
        return str;
    };
    renderAttribute = function(att, url) {
        var str, href;
        str = " <span class='attname'>" + att.name + "</span>=" + '"';
        if (att.name === "href" || /^(https?|\/|\.\.)/.exec(att.value)) {
            href = asHrefRelativeTo(att.value, url);
            str = str + ("<a href='" + href + "' class='attvalue'>" + att.value + "</a>");
        } else {
            str = str + ("<span class='attvalue'>" + att.value + "</span>");
        }
        return str + '"';
    };
    asHrefRelativeTo = function(string, url) {
        var absoluteUrl, windowHost;
        absoluteUrl = urls.makeAbsoluteUrl(url, string);
        windowHost = window.location.protocol + "//" + window.location.host;
        return ("#/" + absoluteUrl.replace(windowHost, "")).replace("#//", "#/");
    };
    isWhitespace = function(xmlNode) {
        return xmlNode.nodeType === 3 && $(xmlNode).text().match(/^[\n\s]+$/g);
    };
    spaces = function(n) {
        var indentString, i;
        indentString = "";
        for (i = 0; i < n * 4; i = i + 1) {
            indentString = indentString + "&nbsp;";
        }
        return indentString;
    };
}).call(this);}, "urls": function(exports, require, module) {(function() {
    var self = this;
    exports.makeAbsoluteUrl = function(base, relative) {
        var self = this;
        return URI(relative).absoluteTo(base).normalizePathname().toString();
    };
}).call(this);}});
