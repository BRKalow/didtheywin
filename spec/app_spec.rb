require File.expand_path '../spec_helper.rb', __FILE__

describe 'DidTheyWin App' do
  def app
    @app ||= Sinatra::Application
  end

  describe "Get '/'" do
    it "returns successful" do
      get '/'
      last_response.should be_ok
    end
  end

end
