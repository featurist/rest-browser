exports.crumb trail (location) =
    
    matches = r/^\/(https?\:\/\/([^\/]+))?(.*)$/.exec (location)
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