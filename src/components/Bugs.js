import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs';

class Bugs extends Component {
	componentDidMount() {
		this.props.loadBugs();
	}

	render() {
		return (
			<ul>
				{this.props.bugs.map((bug) => (
					<li key={bug.id}>
						{bug.description}
						<button onClick={() => this.props.resolveBug(bug.id)}>
							Resolve
						</button>
					</li>
				))}
			</ul>
		);
	}
}

const mapStateToPrps = (state) => ({
	// bugs: state.entities.bugs.list,
	bugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
	loadBugs: () => dispatch(loadBugs()),
	resolveBug: (id) => dispatch(resolveBug(id)),
});

// Container Component
// that wraps a presentation Component
export default connect(mapStateToPrps, mapDispatchToProps)(Bugs);
