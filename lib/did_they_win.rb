require 'json'
require 'date'
require 'net/http'
require 'openssl'
require_relative 'settings'

module DidTheyWin
  Settings.load! './config/app.yml'

  @access_token = Settings.keys["xmlstats"]
  @user_agent = 'DidTheyWin?/1.0 (hello@brycekalow.name)'

  def self.construct_uri(method, team, parameters)
    team_url = team.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')

    uri = URI("https://erikberg.com/nba/#{method}/#{team_url}.json")
    uri.query = parameters.map{|k,v| "#{k}=#{v}"}.join("&")

    return uri
  end

  def self.construct_last_night_uri(team)
    since_date = (Date.today-1).strftime "%Y%m%d"
    until_date = (Date.today).strftime "%Y%m%d"

    uri = self.construct_uri('results', team, {since: since_date, until_date: until_date})
    uri.query = uri.query.gsub('until_date','until')

    return uri
  end

  def self.parse_request(request)
    leader_words = ['leader']
    parts = request.split ' '
    result = Hash.new

    if leader_words.any? { |w| parts.include? w }
        result[:category] = 'leaders'
    end
    if request_contains_assist_word? parts
        result[:method] = 'assists_per_game'
    end
    if request_contains_point_word? parts
        result[:method] = 'points_per_game'
    end
    return result[:category]+'/'+result[:method]+'.json?limit=1'
  end

  def self.request_contains_assist_word?(request)
     words = ['assists', 'assist', 'apg']
    return words.any? { |w| request.include? w }
  end
    
  def self.request_contains_point_word?(request)
    words  = ['points', 'point', 'ppg']
    return words.any? { |w| request.include? w }
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

  def self.last_night?(team)
    event = self.grab_data(self.construct_last_night_uri(team))
    result = {}

    if event == []
      result[:no_game]                = "It looks like your team didn't play last night."
    else
      result[:team_name]              = event[0]['team']['full_name']
      result[:team_name_opponent]     = event[0]['opponent']['full_name']
      result[:points_scored]          = event[0]['team_points_scored']
      result[:points_scored_opponent] = event[0]['opponent_points_scored']
      result[:points_difference]      = (result[:points_scored] - result[:points_scored_opponent]).abs
      result[:outcome]                = event[0]['team_event_result']
    end

    return result
  end
end
