require 'sinatra/base'
require_relative 'lib/did_they_win'

class App < Sinatra::Base
  helpers DidTheyWin

  get '/' do
    erb :index
  end

  post '/' do
    @result = DidTheyWin::last_night?(params[:team])

    erb :index
  end

  run!
end
