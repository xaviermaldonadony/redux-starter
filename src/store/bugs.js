// Ducks pattern
import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment';

const slice = createSlice({
	name: 'bugs',
	initialState: {
		list: [],
		loading: false,
		lastFetch: null,
	},

	reducers: {
		// actions => action handlers
		bugsRequested: (bugs, action) => {
			bugs.loading = true;
		},
		// bugs/bugsReceived
		bugsReceived: (bugs, action) => {
			bugs.list = action.payload;
			bugs.loading = false;
			bugs.lastFetch = Date.now();
		},

		bugsRequestFailed: (bugs, action) => {
			bugs.loading = false;
		},

		bugAssignedToUser: (bugs, action) => {
			const { id: bugId, userId } = action.payload;
			const index = bugs.list.findIndex((bug) => bug.id === bugId);
			bugs.list[index].userId = userId;
		},
		// command - event
		// addBug - bugAdded
		bugAdded: (bugs, action) => {
			bugs.list.push(action.payload);
		},

		// resolveBug(command) - bugResolved(event)
		bugResolved: (bugs, action) => {
			const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
			bugs.list[index].resolved = true;
		},
	},
});

export const {
	bugAdded, // addBug
	bugResolved,
	bugAssignedToUser,
	bugsReceived,
	bugsRequested,
	bugsRequestFailed,
} = slice.actions;
export default slice.reducer;

const url = '/bugs';

// Action creators
export const loadBugs = () => (dispatch, getState) => {
	const { lastFetch } = getState().entities.bugs;
	const difInMinutesf = moment().diff(moment(lastFetch), 'minutes');

	if (difInMinutesf < 10) return;

	return dispatch(
		apiCallBegan({
			url,
			onStart: bugsRequested.type,
			onSuccess: bugsReceived.type,
			onError: bugsRequestFailed.type,
			lastFetch,
		})
	);
};

// make an api call
export const addBug = (bug) =>
	apiCallBegan({
		url,
		method: 'post',
		data: bug,
		onSuccess: bugAdded.type,
	});

// promise resolved => dispatch(success)
// we have changed the implementation of or action creator
// but our test still works, we havent changed the behaviour of our app
// export const addBug = (bug) => async (dispatch) => {
// 	const response = await axios.request({
// 		baseURL: 'http://localhost:9001/api',
// 		url: '/bugs',
// 		method: 'post',
// 		data: bug,
// 	});
// 	dispatch(bugAdded(response.data));
// };

export const resolveBug = (id) =>
	apiCallBegan({
		// /bugs
		// PATCH /bugs/1
		url: url + '/' + id,
		method: 'patch',
		data: { resolved: true },
		onSuccess: bugResolved.type,
	});

export const assignButToUser = (bugId, userId) =>
	apiCallBegan({
		url: url + '/' + bugId,
		method: 'patch',
		data: { userId },
		onSuccess: bugAssignedToUser.type,
	});

// rewritten above
// Action creators
// () => fn(dispatch, getState)
// export const loadBugs = () =>
// 	apiCallBegan({
// 		url,
// 		onStart: bugsRequested.type,
// 		onSuccess: bugsReceived.type,
// 		onError: bugRequesFailed.type,
// 	});

// Selector memoized
export const getUnresolvedBugs = createSelector(
	(state) => state.entities.bugs,
	(state) => state.entities.projects,
	// if the list of bugs and projects is not changed, this logic wont execute
	// selector will return fromthe cache
	(bugs, projects) => bugs.list.filter((bug) => !bug.resolved)
);

// create selector returns a func
export const getBugsByUser = (userId) =>
	createSelector(
		(state) => state.entities.bugs,
		(bugs) => bugs.list.filter((bug) => bug.userId === userId)
	);
