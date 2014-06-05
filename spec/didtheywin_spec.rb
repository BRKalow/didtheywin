require File.expand_path '../spec_helper.rb', __FILE__

describe DidTheyWin do
    describe "#parse_request" do
        it 'takes in a request and returns a uri' do
           DidTheyWin::parse_request('assist leader').should eq 'leaders/assists_per_game.json?limit=1' 
        end
    end
end
