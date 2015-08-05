$LOAD_PATH.unshift(File.expand_path(File.join(File.dirname(__FILE__), 'lib')))
require 'zipcode-rack'

run ZipCode::API
