import React from 'react';
import config from '../../../config/app';
import AutoSuggest from 'react-autosuggest';

/*
 * @class SearchForm
 * @extends React.Component
 */
class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.teamNames = [
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
        this.state = {input: ''};
    }

    getSuggestions(input, callback) {
        var regex = new RegExp(input, 'i');
        var suggestions = this.teamNames.filter(team => regex.test(team));

        callback(null, suggestions);
    }

    onSuggestionSelected(input, e) {
        e.persist();
        this.setState({input: input}, function() {
            this.executeSearch(e);
        }.bind(this));
    }

    executeSearch(e) {
        e.preventDefault();
        if (this.state.input == '')
            return;

        this.setState({input:''});
        this.props.searchHandler(this.state.input);
    }

    /*
    * @method render
    * @returns {JSX}
    */
    render () {
        return(
            <div className="mdl-grid">
                <div className="mdl-cell mdl-cell--12-col">
                  <form name="check" className="form-inline check-form mdl-card mdl-shadow--2dp" onSubmit={this.executeSearch.bind(this)}>
                    <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--8-col mdl-cell--5-col-tablet mdl-textfield mdl-js-textfield" style={{color:'white'}}>
                       <AutoSuggest
                           ref="autosuggest"
                           value={this.state.input}
                           suggestions={this.getSuggestions.bind(this)}
                           onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                           inputAttributes={{
                               id: 'team-input',
                               className: 'mdl-textfield__input',
                               autoFocus: true
                           }}
                       />
                       <label className="mdl-textfield__label" htmlFor="team-input">Find your team...</label>
                    </div>
                    <button type="submit" className="mdl-cell mdl-cell--4-col mdl-cell--2-col-tablet mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Check</button>
                    </div>
                  </form>
                </div>
            </div>
        );
    }
}

// Prop types validation
SearchForm.propTypes = {
    searchHandler: React.PropTypes.func.isRequired,
};

export default SearchForm;

