phantom = require 'phantom'
cats api server = require './fixtures/server'

describe 'the rest browser'
    
    server = nil
    browser = nil
    page = nil
    
    before each @(ready)
        server := cats api server.listen 3001
        phantom.create @(b)
            browser := b
            browser.create page @(p)
                page := p
                ready()
    
    after each @(done)
        browser.exit()
        console.log (Object.keys(server))
        server.close()
        done()
    
    it 'renders XML as HTML' @(done)
        page.open "http://localhost:3001/#/http://127.0.0.1:3001/cats" @(status)
            page.evaluate @{ $($('#xml').text()).0.tag name.to lower case() } @(result)
                result.should.equal "cats"
                done()
                