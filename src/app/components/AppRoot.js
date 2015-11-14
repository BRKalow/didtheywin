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
    identifier = identifier.toLowerCase().replace(/\ /g, '-');
    this.setState({loaded: false});
    setTimeout(function() {
      $.getJSON('/results/' + identifier).then(function(data) {
        this.setState({result: data, loaded: true});
      }.bind(this));
    }.bind(this), 1000);
  }

  componentDidUpdate() {
    // componentHandler.upgradeDOM();
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
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header homepage-container">
        <header className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">{"didtheyw.in?"}</span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation mdl-layout--large-screen-only">
              <a className="mdl-navigation__link" href="#">Source</a>
            </nav>
          </div>
        </header>
        <div className="mdl-layout__drawer">
          <span className="mdl-layout-title">{"didtheyw.in?"}</span>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="#">Source</a>
          </nav>
        </div>
        <div className="mdl-layout__content">
          <div className="page-content">
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--4-col">
                <div className="mdl-grid">
                  <div className="mdl-cell mdl-cell--12-col">
                    <h1 className="title">
                      Did They Win?<br/>
                      <small>Missed the game? No problem! Check the result here.</small>
                    </h1>
                  </div>
                </div>
                <SearchForm searchHandler={this.searchHandler.bind(this)} />
              </div>
              <div className="mdl-cell mdl-cell--2-col"></div>
              {scoreboard}
            </div>
          </div>
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
