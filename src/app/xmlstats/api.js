import config from '../../../config/app';
import https from 'https';

class XmlStatsApi {
    constructor() {
        this.root = 'https://erikberg.com/nba/';
        this.host = 'erikberg.com';
        this.accessToken = process.env.XMLSTATS_ACCESS_TOKEN;
    }

    getResults(req, res) {
        var identifier = req.params.identifier,
            url = this.buildURL('results', identifier, {until: this.todayDate(), limit: 1}),
            result;
        this.grabData(url, function(data) {
            result = data[0];
            url = this.buildURL('boxscore', result.event_id, {limit: 1});
            this.grabData(url, function(data) {
                result.boxscore = data;
                res.json(result);
            });
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
        };

        https.get(requestOptions, function(res) {
            res.on('data', function(data) {
                chunks.push(data);
            });
            res.on('end', function() {
                var time = new Date() / 1000;
                if (res.headers['xmlstats-api-remaining'] <= 1) {
                    // If we are about to hit the api rate limit we want to
                    // throttle our application a little bit.
                    setTimeout(function() {
                        var buffer = chunks.join('');
                        callback(JSON.parse(buffer));
                    }, (res.headers['xmlstats-api-reset'] - time)*1000);
                } else {
                    var buffer = chunks.join('');
                    callback(JSON.parse(buffer));
                }
            });
        }).on('error', function(err) {
            console.log(err);
        });
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
