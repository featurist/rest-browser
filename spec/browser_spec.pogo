zombie = require 'zombie'
cats api = require './fixtures/cats_api'

describe 'the rest browser'
    
    it 'renders XML as HTML' @(done)
        require './fixtures/server'
        browser = @new zombie
        browser.visit "http://localhost:3001/#/"
            //console.log (browser)
            browser.success.should.equal (true)
            set timeout
                browser.text("link").should.equal "Cats"
                done()
            1000