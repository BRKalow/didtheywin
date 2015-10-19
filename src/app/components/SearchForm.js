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
            'Philadelphia Sixers',
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
        this.setState({input:''});
        this.props.searchHandler(this.state.input);
    }

    /*
    * @method render
    * @returns {JSX}
    */
    render () {
        return(
            <div className="row">
                <div className="col-md-12">
                  <form name="check" className="form-inline check-form" onSubmit={this.executeSearch.bind(this)}>
                       <AutoSuggest
                           ref="autosuggest"
                           value={this.state.input}
                           suggestions={this.getSuggestions.bind(this)}
                           onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                           inputAttributes={{
                               placeholder: 'Find your team...',
                               className: 'form-control input-lg',
                               autoFocus: true
                           }}
                       />
                    <button type="submit" className="btn btn-primary btn-lg">Check</button>
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

