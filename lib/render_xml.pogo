urls = require './urls'
window host = window.location.protocol + '//' + window.location.host

exports.render doc (doc, element) =
    html = render node (doc.url, doc.root, 0)
    $(element).html (html)
    
render node (url, xml node, indent) =
    if (is whitespace (xml node))
        return ''
    
    str = "<div class='xmlnode nodetype-#(xml node.node type)'>"
    str := str + (indent) spaces

    if (xml node.node type == 1)
        str := str + "&lt;"
        str := str + "<span class='tagname'>#(xml node.tag name)</span>"
    
        for each @(att) in (xml node.attributes)
            str := str + render attribute (att, url)
    
        if (xml node.child nodes.length > 0)
            str := str + '/&gt;'
            str := str + '<br />'
            for each @(child node) in (xml node.child nodes)
                str := str + render node (url, child node, indent + 1)
            
            str := str + ((indent) spaces)
            str := str + "&lt;/<span class='tagname'>#(xml node.tag name)</span>&gt;"
        else
            str := str + (" /&gt;")
    else
        text = $(xml node).text()
        if (!text.match(r/^[\n\s]+$/g))
            str := str + (text)
    
    str := str + "</div>"
    str

render attribute (att, url) =
    str = " <span class='attname'>#(att.name)</span>=" + '"'
    if ((att.name == 'href') || (r/^(https?|\/|\.\.)/.exec (att.value)))
        href = (att.value) as href relative to (url)
        str := str + "<a href='#(href)' class='attvalue'>#(att.value)</a>"
    else
        str := str +  "<span class='attvalue'>#(att.value)</span>"
        
    str + '"'

(string) as href relative to (url) =
    absolute url = urls.make absolute url (url, string)
    ('#/' + absolute url.replace (window host, '')).replace('#//', '#/')

is whitespace (xml node) =
    xml node.node type == 3 && ($(xml node).text().match(r/^[\n\s]+$/g))

(n) spaces =
    indent string = ""
    for (i = 0, i < (n * 4), i := i + 1)
        indent string := indent string + "&nbsp;"
    
    indent string