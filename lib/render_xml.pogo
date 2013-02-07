localhost root = 'http://localhost/Euromoney.Isis.Api/'

exports.render xml (xml node, element, indent) =
    container = $("<div />").append to (element)
    container.append ((indent) spaces)

    if (xml node.tag name)
        container.append "&lt;"
        container.append "<span class='tagname'>#(xml node.tag name)</span>"
    
        for each @(att) in (xml node.attributes)
            container.append ' '
            container.append "<span class='attname'>#(att.name)</span>"
            container.append '="'
            
            if (att.name == 'href')
                href = '#/' + att.value.replace(localhost root, '')
                container.append ( "<a href='#(href)' class='attvalue'>#(att.value)</a>" )
            else
                container.append  "<span class='attvalue'>#(att.value)</span>"
        
            container.append ('"')
    
        if (xml node.child nodes.length > 0)
            container.append '>'
            container.append '<br />'
            for each @(child node) in (xml node.child nodes)
                exports.render xml (child node, container, indent + 1)
            
            container.append ((indent) spaces)
            container.append "&lt;/<span class='tagname'>#(xml node.tag name)</span>&gt;"
        else
            container.append (" /&gt;")
    else
        text = $(xml node).text()
        if (text.trim().length > 0)
            container.append ($(xml node).text())

(n) spaces =
    indent string = ""
    for (i = 0, i < (n * 4), i = i + 1)
        indent string = indent string + "&nbsp;"
    
    indent string