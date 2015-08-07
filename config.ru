$LOAD_PATH.unshift(File.expand_path(File.join(File.dirname(__FILE__), 'lib')))
require 'zipcode-rack'
require 'zipcode-fr'
ZipCode::DB.for(:fr).load

load './public_app.rb'

run Rack::URLMap.new(
  '/' => ZipCode::API,
  '/public' => Sinatra::Application,
)
