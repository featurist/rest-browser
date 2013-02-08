exports.crumb trail (location) =
    console.log ("location", location)
    matches = r/^\/(https?\:\/\/([^\/]+))?(.*)$/.exec (location)
    
    if (matches)
    
        host = matches.1
        path = matches.3
    
        crumbs = []
        parts = path.split '/'
    
        if (typeof (host) == 'undefined')
            crumbs.push {
                text = window.location.protocol + '//' + window.location.host
                href = '/'
            }
            url = []
        else
            crumbs.push { text = host, href = '#/' + host }
            url := [host]
            parts.shift()
    
        if (path.length > 1)
            for each @(part) in (parts)
                url.push (part)
                crumbs.push { text = part, href = '#/' + url.join('/') }
    
        crumbs
    else
    
        [{
            text = window.location.protocol + '//' + window.location.host
            href = '/'
        }]