set :views, File.dirname(__FILE__) + '/views'

require_relative 'lib/did_they_win'
require 'pp'

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
end

get '/' do
  erb :index
end

post '/' do
  @result = DidTheyWin::team_win?(params[:team], true)
  PP.pp JSON.parse(@result)["boxscore"]
  return @result
end
