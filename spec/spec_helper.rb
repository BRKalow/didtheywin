require 'rack/test'
require 'sinatra'

set :environment, :test

require File.expand_path '../../app.rb', __FILE__

RSpec.configure { |c| c.include Rack::Test::Methods }
