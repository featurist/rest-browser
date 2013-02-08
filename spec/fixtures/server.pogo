express = require 'express'
cats api = require './cats_api'
public = "#(__dirname)/../../public"

exports.listen (port) =
    app = express()
    app.use(express.logger())
    cats api.mount (app)
    app.use(express.static(public))
    app.listen (port)