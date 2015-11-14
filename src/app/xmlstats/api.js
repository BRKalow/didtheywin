import config from '../../../config/app';
import https from 'https';
import mongoose from 'mongoose';
import Promise from 'bluebird';

mongoose.Promise = Promise;

class XmlStatsApi {
    constructor() {
        this.root = 'https://erikberg.com/nba/';
        this.host = 'erikberg.com';
        this.accessToken = process.env.XMLSTATS_ACCESS_TOKEN;
        this.apiCallsRemaining = 6;
        this.apiResetTime = new Date() / 1000;

        this.models = {};
        this.models.Event = mongoose.model('Event');
        this.models.TeamResult = mongoose.model('TeamResult');
    }

    serveResults(req, res) {
        this.getResults(req.params.identifier).then(function(result) {
            res.json(result);
        })
    }

    getResults(identifier, performCheck=true) {
        var result,
            checkDatabase = this.checkDatabase(identifier),
            self = this;

        return checkDatabase.then(function(team) {
            if (!performCheck) team = null;
            if (!team) {
                self.getResultsFromApi(identifier).then(function(data) {
                    result = data;
                });
                return null;
            }

            return self.models.Event.load(team.eventId);
        }).then(function(eventObj) {
            if (eventObj) {
                result = eventObj.body;
                result.boxscore = eventObj.boxscore;
            }
            return result;
        });
    }

    getResultsFromApi(identifier) {
        var url = this.buildURL('results', identifier, {until: this.todayDate(), limit: 1}),
            result,
            newEvent = {};

        return this.grabData(url).then(function(data) {
            newEvent.eventId = data[0].event_id;
            newEvent.body = data[0];

            url = this.buildURL('boxscore', newEvent.eventId, {limit: 1});
            return this.grabData(url);
        }.bind(this)).then(function(data) {
            newEvent.boxscore = data;
            this.updateEvent(identifier, newEvent);
            result = newEvent.body;
            result.boxscore = newEvent.boxscore;
            return result;
        }.bind(this));
    }

    buildURL(method, identifier, options={}) {
        var parameters = [],
            url = this.root + method;

        // Make the identifier URL friendly
        identifier = identifier.toLowerCase().replace(' ', '-');

        // Assembling the query string
        for (var option in options) {
            parameters.push(`${option}=${options[option]}`);
        }
        url = url + '/' + identifier + '.json?' + parameters.join('&');

        return url;
    }


    grabData(url, callback) {
        var chunks = [],
            requestOptions = {
                'host': this.host,
                'path': url,
                'headers': {
                    'Authorization': 'Bearer ' + this.accessToken,
                    'User-Agent': 'DidTheyWin? v1.0 / (hello@brycekalow.name)'
                }
            },
            self = this;


        return new Promise(function(resolve, reject) {
            https.get(requestOptions, function(res) {
                res.on('data', function(data) {
                    chunks.push(data);
                });
                res.on('end', function() {
                    self.apiCallsRemaining = res.headers['xmlstats-api-remaining'];
                    self.apiResetTime = res.headers['xmlstats-api-reset'];

                    var time = new Date() / 1000;
                    if (self.apiCallsRemaining <= 1) {
                        // If we are about to hit the api rate limit we want to
                        // throttle our application a little bit.
                        setTimeout(function() {
                            var buffer = chunks.join('');
                            resolve(JSON.parse(buffer));
                        }, (self.apiResetTime - time)*1000);
                    } else {
                        var buffer = chunks.join('');
                        resolve(JSON.parse(buffer));
                    }
                });
            }).on('error', function(err) {
                console.log(err);
                reject(err);
            }).end();
        });
    }

    checkDatabase(teamIdentifier) {
        return this.models.TeamResult.load(teamIdentifier).exec();
    }

    updateEvent(teamIdentifier, newEvent) {
        var eventQuery = { eventId: newEvent.eventId },
            teamQuery = { team: teamIdentifier },
            opponentTeamQuery = { team: newEvent.body.opponent.team_id },
            newTeam = { team: newEvent.body.team.team_id, eventId: newEvent.eventId },
            newOpponentTeam = { team: newEvent.body.opponent.team_id, eventId: newEvent.eventId };

        this.models.Event.findOneAndUpdate(eventQuery, newEvent, { upsert: true }, function(err, eventObj) {
            if (err) {
                console.log(err);
                return false;
            }
        });

        this.models.TeamResult.findOneAndUpdate(teamQuery, newTeam, { upsert: true }, function(err, teamObj) {
            if (err) {
                console.log(err);
                return false;
            }
        });

        this.checkDatabase(newOpponentTeam.team).then(function(team) {
            if (!team) return null;

            return this.models.Event.load(team.eventId);
        }.bind(this)).then(function(teamEvent) {
            if (!teamEvent) return;

            var curDate, newDate;
            curDate = new Date(teamEvent.body.event_start_date_time);
            newDate = new Date(newEvent.body.event_start_date_time);

            // If the new event is more recent than the current event associated
            // with the team, we replace it.
            if (newDate > curDate) {
                this.models.TeamResult.findOneAndUpdate(opponentTeamQuery, newOpponentTeam, { upsert: true }, function(err, teamObj) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                });
            }
        }.bind(this));
    }

    updateAllTeams() {
        var teamNames = [
            'Atlanta Hawks',
            'Boston Celtics',
            'Brooklyn Nets',
            'Charlotte Hornets',
            'Chicago Bulls',
            'Cleveland Cavaliers',
            'Dallas Mavericks',
            'Denver Nuggets',
            'Detroit Pistons',
            'Golden State Warriors',
            'Houston Rockets',
            'Indiana Pacers',
            'Los Angeles Clippers',
            'Los Angeles Lakers',
            'Memphis Grizzlies',
            'Miami Heat',
            'Milwaukee Bucks',
            'Minnesota Timberwolves',
            'New Orleans Pelicans',
            'New York Knicks',
            'Oklahoma City Thunder',
            'Orlando Magic',
            'Philadelphia 76ers',
            'Phoenix Suns',
            'Portland Trail Blazers',
            'Sacramento Kings',
            'San Antonio Spurs',
            'Toronto Raptors',
            'Utah Jazz',
            'Washington Wizards'
        ];

        for(let i in teamNames) {
            var team = teamNames[i].toLowerCase().replace(/\ /g, '-');
            (i, team) => {
                setTimeout(() => {
                    this.getResults(team, false).then(function() {
                        console.log(`${team} latest game data loaded.`);
                    });
                }, i*20000);
            }(i, team);
        }
    }

    todayDate() {
        var date = new Date(),
            day = date.getDate(),
            month = date.getMonth(),
            year = date.getFullYear();

        // We want to pad day and month with a 0 and then grab last 2 characters
        // so we always have the leading 0.
        day = `0${day}`.slice(-2);
        month = `0${month}`.slice(-2);

        return year + month + day;
    }
}

export default XmlStatsApi;
