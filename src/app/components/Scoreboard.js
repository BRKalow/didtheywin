import React from 'react';
import config from '../../../config/app';
import ScoreboardRow from './ScoreboardRow';

/*
 * @class Scoreboard
 * @extends React.Component
 */
class Scoreboard extends React.Component {

  getDate() {
    var d = new Date(this.props.result.event_start_date_time);
    return d.toDateString();
  }

  getPeriodScores(team) {
    if (team == this.props.result.boxscore.away_team.team_id) {
      return this.props.result.boxscore.away_period_scores;
    }
    return this.props.result.boxscore.home_period_scores;
  }

  reverseOutcome(outcome) {
    if (outcome == 'win') {
      return 'loss';
    }
    return 'win';
  }

  /*
   * @method render
   * @returns {JSX}
   */
  render () {
    return(
      <div className="mdl-cell mdl-cell--6-col">
        <div className="result animated flipInX">
          <span className="date">{this.getDate()}</span>
          <ScoreboardRow
            team={this.props.result.team.team_id}
            result={this.props.result.team_event_result}
            position="top"
            points_scored={this.props.result.team_points_scored}
            period_scores={this.getPeriodScores(this.props.result.team.team_id)}
          />
          <ScoreboardRow
            team={this.props.result.opponent.team_id}
            result={this.reverseOutcome(this.props.result.team_event_result)}
            position="bottom"
            points_scored={this.props.result.opponent_points_scored}
            period_scores={this.getPeriodScores(this.props.result.opponent.team_id)}
          />
        </div>
      </div>
    );
  }
}

// Prop types validation
Scoreboard.propTypes = {
  result: React.PropTypes.object.isRequired,
};

export default Scoreboard;
