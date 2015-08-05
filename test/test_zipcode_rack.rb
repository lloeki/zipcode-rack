require 'minitest/autorun'
require 'rack/test'
require 'zipcode-rack'
require 'set'

# mock DB
class ZipCode::DB
  def self.for(_)
    new
  end

  def self.default
    new
  end

  def country
    :fr
  end

  # rubocop:disable Metrics/MethodLength
  def search(key, value)
    [
      {
        name: 'PARIS',
        zip:  '75000',
      },
      {
        name: 'PALAISEAU',
        zip:  '91120',
      },
      {
        name: 'BORDEAUX',
        zip:  '33000',
      },
      {
        name: 'CHERBOURG',
        zip:  '50100',
      },
    ].select { |e| e[key.to_sym] =~ /\b#{value}/i }
  end
end

class TestAPI < MiniTest::Test
  include Rack::Test::Methods

  def app
    ZipCode::API
  end

  def test_search_by_name
    get '/api/v1/search?name=paris&country=fr'
    assert_equal(200, last_response.status)
    resp = JSON.parse(last_response.body)
    assert_equal(1, resp.count)
    assert_equal('PARIS', resp.first['name'])
  end

  def test_search_by_code
    get '/api/v1/search?zip=50100&country=fr'
    assert_equal(200, last_response.status)
    resp = JSON.parse(last_response.body)
    assert_equal(1, resp.count)
    assert_equal('CHERBOURG', resp.first['name'])
  end

  def test_search_by_name_prefix
    get '/api/v1/search?name=pa&country=fr'
    assert_equal(200, last_response.status)
    resp = JSON.parse(last_response.body)
    assert_equal(2, resp.count)
    assert_equal(Set.new(%w(PARIS PALAISEAU)),
                 Set.new(resp.map { |e| e['name'] }))
  end
end
