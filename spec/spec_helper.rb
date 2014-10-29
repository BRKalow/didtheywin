require 'simplecov'
SimpleCov.start

require 'rack/test'
require 'sinatra'
require 'net/http'
require 'time'

set :environment, :test

require File.expand_path '../../app.rb', __FILE__

RSpec.configure { |c| c.include Rack::Test::Methods }
