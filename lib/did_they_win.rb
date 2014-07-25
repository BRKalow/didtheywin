require 'json'
require 'time'
require 'net/http'
require 'openssl'
require_relative 'settings'

module DidTheyWin
  Settings.load! './config/app.yml'

  @access_token = Settings.keys["xmlstats"]
  @user_agent = 'DidTheyWin?/1.0 (hello@brycekalow.name)'

  def self.construct_uri(method, team, parameters={})
    team_url = team.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')

    uri = URI("https://erikberg.com/nba/#{method}/#{team_url}.json")
    uri.query = parameters.map{|k,v| "#{k}=#{v}"}.join("&")

    return uri
  end

  def self.construct_results_uri(team)
    uri = self.construct_uri 'results', team, {:limit => 1}
  end

  def self.construct_boxscore_uri(event)
    uri = self.construct_uri 'boxscore', event, {:limit => 1}
  end

  def self.grab_data(uri)
    data = nil

    Net::HTTP.start(uri.host, uri.port,
                    :use_ssl => true,
                    :verify_mode => OpenSSL::SSL::VERIFY_PEER) do |http|
      req                   = Net::HTTP::Get.new(uri.request_uri)
      req['Authorization']  = 'Bearer ' + @access_token
      req['user-agent']     = @user_agent
      result = http.request(req)

      case result
      when Net::HTTPSuccess then
        data = result.body
      else
        puts "Error retreiving data: #{result.code} #{result.message}"
        return []
      end
    end

    JSON.parse(data)
  end

  def self.team_win?(team, json=false)
    event = self.grab_data self.construct_results_uri(team)
    result = {}

    if event == []
      result[:no_game]                = "It looks like something went wrong."
    else
      result = event[0]
      result[:points_difference]      = (result['team_points_scored'] - result['opponent_points_scored']).abs
      result[:date]                   = Time.parse(result['event_start_date_time']).strftime('%B %d, %Y')

      boxscore = self.grab_data self.construct_boxscore_uri(event[0]['event_id'])
      result[:boxscore] = boxscore
    end

    if json
      json_result = result.to_json
      return json_result
    else
      return result
    end
  end

  # Unused below; for new features or potential new app #
  def self.parse_request(request)
    leader_words = ['leader']
    parts = request.split ' '
    result = Hash.new

    if leader_words.any? { |w| parts.include? w }
      result[:category] = 'leaders'
      if request_contains_assist_word? parts
        result[:method] = 'assists_per_game'
      end
      if request_contains_point_word? parts
        result[:method] = 'points_per_game'
      end
    end
    return result[:category]+'/'+result[:method]+'.json?limit=1'
  end

  def self.request_contains_leader_word?(request)
    words = ['leaders']
    return words.any? { |w| request.include? w }
  end

  def self.request_contains_assist_word?(request)
   words = ['assists', 'assist', 'apg']
   return words.any? { |w| request.include? w }
  end

  def self.request_contains_point_word?(request)
    words  = ['points', 'point', 'ppg']
    return words.any? { |w| request.include? w }
  end
end
