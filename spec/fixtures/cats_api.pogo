exports.mount (app) =
    
    app.all '/*' @(req, res, next)
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization")
        next()
    
    xml (path, body) =
        app.get (path) @(req, res, next)
            if (req.headers.accept && req.headers.accept.index of 'html' == -1)
                res.header 'Content-Type' 'custom+xml'
                res.send (body)
            else
                next()
    
    
    xml  '/'          '<app>
                           <link href="http://localhost:3000/cats">Cats</link>
                       </app>'
    
        
    xml '/cats'       '<cats>
                           <cat name="meg" href="/cats/meg" />
                           <cat name="mog" href="/cats/mog" />
                       </cats>'
    
                 
    xml '/cats/meg'   '<cat name="meg" />'



