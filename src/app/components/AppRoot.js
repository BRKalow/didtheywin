import React from 'react';
import config from '../../../config/app';
import Scoreboard from './Scoreboard';
import SearchForm from './SearchForm';
import Loading from './Loading';

/*
 * @class AppRoot
 * @extends React.Component
 */
class AppRoot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {"result": {}, "loaded": true};
  }

  searchHandler(identifier) {
    identifier = identifier.toLowerCase().replace(' ', '-');
    this.setState({loaded: false});
    setTimeout(function() {
      $.getJSON('/results/' + identifier).then(function(data) {
        this.setState({result: data, loaded: true});
      }.bind(this));
    }.bind(this), 1000);
  }

  /*
   * @method render
   * @returns {JSX}
   */
  render () {
    var scoreboard;
    if (Object.keys(this.state.result).length > 0 && this.state.loaded) {
      scoreboard = (<Scoreboard result={this.state.result} />);
    }
    if (!this.state.loaded)
      scoreboard = (<Loading />);


    return(
      <div className="appRoot">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">
                {"didtheyw.in?"}
              </a>
            </div>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="title">
                    Did They Win?<br/>
                    <small>Missed the game? No problem! Check the result here.</small>
                  </h1>
                </div>
              </div>
              <SearchForm searchHandler={this.searchHandler.bind(this)} />
            </div>
            <div className="col-md-2"></div>
            {scoreboard}
          </div>
        </div>
      </div>
    );
  }
}

// Prop types validation
AppRoot.propTypes = {
  state: React.PropTypes.object.isRequired,
};

export default AppRoot;
