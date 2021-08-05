// import { createStore } from 'redux';
// import { devToolsEnhancer } from 'redux-devtools-extension';
// import reducer from './bugs';

// export default function configureStore() {
// 	const store = createStore(reducer, devToolsEnhancer({ trace: true }));
// 	return store;
// }

// ******************** Redux Toolkit ***************************** //
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import reducer from './bugs-tk';
import reducer from './reducer';
import logger from './middleware/logger';
import toast from './middleware/toast';
import api from './middleware/api';

export default function configStore() {
	return configureStore({
		reducer,
		middleware: [
			...getDefaultMiddleware(),
			// logger({ destination: 'console' }),
			toast,
			api,
		],
	});
}
