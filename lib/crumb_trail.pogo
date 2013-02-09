exports.crumb trail (absolute url) =
    matches = r/^(https?\:\/\/([^\/]+))?(.*)$/.exec (absolute url)
    if (!matches) @{ throw (@new Error ("Expected absolute URL, got #(absolute url)")) }
    
    authority = window.location.protocol + '//' + window.location.host
    
    host = matches.1
    path = matches.3
    
    crumbs = []
    parts = path.replace(r/^\//, '').replace(r/\/$/, '').split '/'
    
    crumbs.push { text = host, href = '#/' + host.replace (authority, '') }
    url = [host]
    
    if (path.length > 1)
        for each @(part) in (parts)
            url.push (part)
            href = url.join('/').replace(authority, '').replace(r/^\/+/, '')
            crumbs.push { text = part, href = '#/' + href }
    
    crumbs