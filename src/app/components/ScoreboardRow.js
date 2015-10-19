import React from 'react';
import config from '../../../config/app';
import TeamLogo from './TeamLogo';

/*
 * @class ScoreboardRow
 * @extends React.Component
 */
class ScoreboardRow extends React.Component {

  getPeriodScores() {
    var result = [];

    this.props.period_scores.forEach(function(e, i, a) {
      result.push(<span className="score">{e}</span>);
    });

    return result;
  }

  getOutcomeClass(result) {
    if (result == 'win') {
      return 'winner';
    }
    return 'loser';
  }

  /*
   * @method render
   * @returns {JSX}
   */
  render () {
    return(
      <div className={`row team-${this.props.position} ${this.getOutcomeClass(this.props.result)}`}>
        <div className="col-md-12">
            <TeamLogo team={this.props.team} />
            <span className="points">{this.props.points_scored}</span>
            <span className="boxscore">
              {this.getPeriodScores()}
            </span>
          </div>
      </div>
    );
  }
}

// Prop types validation
ScoreboardRow.propTypes = {
  team: React.PropTypes.string.isRequired,
};

export default ScoreboardRow;
