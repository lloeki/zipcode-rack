Gem::Specification.new do |s|
  s.name        = 'zipcode-rack'
  s.version     = '1.0.0'
  s.licenses    = ['MIT']
  s.summary     = 'Rack API to query postal codes'
  s.description = <<-EOS
   Query city information by postal code and city name.
  EOS
  s.authors     = ['Loic Nageleisen']
  s.email       = 'loic.nageleisen@gmail.com'
  s.files       = Dir['lib/**/*.rb']
  s.homepage    = 'https://github.com/lloeki/zipcode-rack'

  s.add_dependency 'grape'

  s.add_development_dependency 'pry'
  s.add_development_dependency 'rubocop'
  s.add_development_dependency 'rake'
  s.add_development_dependency 'minitest'
  s.add_development_dependency 'rack-test'
  s.add_development_dependency 'thin'
end
