express = require 'express'
cats api = require './cats_api'

app = express()
app.use(express.logger())
cats api.mount (app)
public = __dirname + '/../../public'

app.use(express.static(public))

app.listen 3001

console.log "http://127.0.0.1:80 -> cats api / public (#(public))"