import React from 'react';

class Loader extends React.Component {
    render() {
        return (
            <div className="mdl-cell mdl-cell--6-col result animated flipInX">
                <div className="sk-wave">
                    <div className="sk-rect sk-rect1"></div>
                    <div className="sk-rect sk-rect2"></div>
                    <div className="sk-rect sk-rect3"></div>
                    <div className="sk-rect sk-rect4"></div>
                    <div className="sk-rect sk-rect5"></div>
                </div>
            </div>
        );
    }
}

export default Loader;
