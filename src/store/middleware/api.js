import axios from 'axios';
import * as actions from '../api';

// if the type of this action is not apiCallBegan pass it to the next middleware func
// otherwise handle this action by making an api call and dispatching a diff kind of action
// essentially what is happening here, we are swallowing the original action
// for the action to appear in redux dev tools you have to pass it to the next middleware func
// before making an api call
const api =
	({ dispatch }) =>
	(next) =>
	async (action) => {
		if (action.type !== actions.apiCallBegan.type) return next(action);

		const { url, method, data, onStart, onSuccess, onError } = action.payload;

		if (onStart) dispatch({ type: onStart });

		next(action);

		try {
			const response = await axios.request({
				baseURL: 'http://localhost:9001/api',
				url,
				method,
				data,
			});
			// General
			dispatch(actions.apiCallSuccess(response.data));
			// Specific
			if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
		} catch (error) {
			// General
			dispatch(actions.apiCallFailed(error.message));
			// specific
			if (onError) dispatch({ type: onError, payload: error.message });
		}
	};

export default api;
