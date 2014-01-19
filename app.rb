set :views, File.dirname(__FILE__) + '/views'

require_relative 'lib/did_they_win'

before do
  headers 'Content-Type' => 'text/html; charset=utf-8'
end

get '/' do
  erb :index
end

post '/' do
  @result = DidTheyWin::last_night?(params[:team])
  erb :index
end
