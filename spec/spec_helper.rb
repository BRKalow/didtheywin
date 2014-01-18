ENV['RACK_ENV'] = 'testing'

require 'rack/test'

require File.expand_path '../../app.rb', __FILE__

RSpec.configure { |c| c.include Rack::Test::Methods }
