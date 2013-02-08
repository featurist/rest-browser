port = 3001
require './server'.listen (port)
console.log "http://127.0.0.1:#(port) -> cats api / public"