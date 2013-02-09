phantom = require 'phantom'
cats api server = require './fixtures/server'

describe 'the rest browser'
    
    server = nil
    browser = nil
    page = nil
    
    before @(ready)
        server := cats api server.listen 3001
        phantom.create @(b)
            browser := b
            ready()
    
    after @(done)
        browser.exit()
        server.close()
        done()        
        
    open (url, opened) = 
        browser.create page @(p)
            p.open (url) @(status)
                status.should.equal 'success'
                opened(p)
    
    links in (url, found) =
        open (url) @(page)
            page.evaluate @{ $("#doc a").map @{ $(this).attr('href') }.get() } @(hrefs)
                found (hrefs)
        
    it 'renders XML as HTML (same origin)' @(done)
        open "http://localhost:3001/#/cats" @(page)
            page.evaluate @{ $('#doc').text() } @(result)
                result.should.match r/\<cats/
                done()
    
    it 'renders XML as HTML (cross origin)' @(done)
        open "http://localhost:3001/#/http://127.0.0.1:3001/cats" @(page)
            page.evaluate @{ $('#doc').text() } @(result)
                result.should.match r/\<cats/
                done()
    
    it 'renders relative links (same origin)' @(done)
        links in "http://localhost:3001/#/cats" @(links)
            links.should.eql [
                '#/'
                '#/cats/meg'
                '#/cats/meg/'
                '#/cats/meg'
                '#/http://127.0.0.1:3001/cats/mog'
                '#/cats/mog'
            ]
            done()
    
    it 'renders relative links (cross origin)' @(done)
        links in "http://localhost:3001/#/http://127.0.0.1:3001/cats" @(links)
            links.should.eql [
                '#/http://127.0.0.1:3001/'
                '#/http://127.0.0.1:3001/cats/meg'
                '#/http://127.0.0.1:3001/cats/meg/'
                '#/http://127.0.0.1:3001/cats/meg'
                '#/http://127.0.0.1:3001/cats/mog'
                '#/cats/mog'
            ]
            done()