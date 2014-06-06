require File.expand_path '../spec_helper.rb', __FILE__

describe DidTheyWin do
    describe "#parse_request" do
        it 'takes in a request and returns a uri' do
           DidTheyWin::parse_request('assist leader').should eq 'leaders/assists_per_game.json?limit=1' 
        end
        it 'correctly recognizes assist requests' do
            DidTheyWin::parse_request('assist leader').should eq 'leaders/assists_per_game.json?limit=1'
            DidTheyWin::parse_request('assists leader').should eq 'leaders/assists_per_game.json?limit=1'
            DidTheyWin::parse_request('apg leader').should eq 'leaders/assists_per_game.json?limit=1'
        end
        it 'correctly recognizes point requests' do
            DidTheyWin::parse_request('point leader').should eq 'leaders/points_per_game.json?limit=1'
            DidTheyWin::parse_request('points leader').should eq 'leaders/points_per_game.json?limit=1'
            DidTheyWin::parse_request('ppg leader').should eq 'leaders/points_per_game.json?limit=1'
        end
    end
end
