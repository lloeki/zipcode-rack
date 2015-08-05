require 'grape'
require 'json_enum'

module ZipCode
  class API < Grape::API
    version 'v1'
    format :json
    prefix :api

    helpers do
      def db
        ZipCode::DB
      end

      def default_country
        db.default.country
      end

      def country
        params[:country] || default_country
      end

      def criteria
        params.slice(:name, :zip).first
      end
    end

    desc 'search by name or zip'
    params do
      optional :name, type: String
      optional :zip, type: String
      optional :country, type: Symbol, regexp: /^[a-z]{2}$/
      exactly_one_of :name, :zip
    end
    get '/search' do
      db.for(country).search(*criteria)
    end
  end
end
