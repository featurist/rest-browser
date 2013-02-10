## Rest Browser

A browser client for REST APIs, designed to be embedded in the API itself.

### Usage

1. Save the contents of [public/squashed.html](public/squashed.html)

2. Make API requests from browsers return this HTML (you might want to use [content negotation](http://en.wikipedia.org/wiki/Content_negotiation)).

3. Now your API has a handy little browser client embedded into it, like this:

    http://rest-browser-example.herokuapp.com/#/


### Don't want to embed the client?

Alternatively, if your API supports (CORS)[http://en.wikipedia.org/wiki/Cross-origin_resource_sharing] then you can host the HTML elsewhere, e.g.

##### Cross-Origin Example
http://featurist.github.com/rest-browser/#/http://rest-browser-example.herokuapp.com
