import React from 'react';
import config from '../../../config/app';

/*
 * @class TeamLogo
 * @extends React.Component
 */
class TeamLogo extends React.Component {

  /*
   * @method render
   * @returns {JSX}
   */
  render () {
    return(
      <div className="logo-wrapper">
        <img className="logo" src={"images/logos/" + this.props.team + ".gif"} />
      </div>
    );
  }
}

// Prop types validation
TeamLogo.propTypes = {
  team: React.PropTypes.string.isRequired,
};

export default TeamLogo;
