require File.expand_path '../spec_helper.rb', __FILE__

describe DidTheyWinApp do
  def app
    @app ||= DidTheyWinApp
  end

  describe "Get '/'" do
    it "returns successful" do
      get '/'
      last_response.should be_ok
    end
  end

end
