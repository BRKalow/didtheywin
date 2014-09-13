require 'rubygems'
require 'bundler'

Bundler.require

require './app'

set :environment, :development
set :run, false
set :raise_errors, true

run Sinatra::Application
