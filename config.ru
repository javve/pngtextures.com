require "rack"
require 'rack-rewrite'

use Rack::Static,
    :urls => ["/./"],
    :root => "public"
    
use Rack::Rewrite do
  rewrite '/', '/index.html'
end
    
run lambda { |env|
    [
        200,
        {
            'Content-Type'  => 'text/html',
            'Cache-Control' => 'public, max-age=86400'
        },
        File.open('public/index.html', File::RDONLY)
    ]
}