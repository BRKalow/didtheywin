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
    uri = self.construct_uri('results', team)
    return uri
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

    return JSON.parse(data)
  end

  def self.team_win?(team)
    event = self.grab_data(self.construct_results_uri(team))
    result = {}

    if event == []
      result[:no_game]                = "It looks like something went wrong."
    else
      result[:team_name]              = event[0]['team']['full_name']
      result[:team_name_opponent]     = event[0]['opponent']['full_name']
      result[:points_scored]          = event[0]['team_points_scored']
      result[:points_scored_opponent] = event[0]['opponent_points_scored']
      result[:points_difference]      = (result[:points_scored] - result[:points_scored_opponent]).abs
      result[:outcome]                = event[0]['team_event_result']
      result[:date]                   = Time.parse(event[0]['event_start_date_time']).strftime('%B %d, %Y')
    end

    return result
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
