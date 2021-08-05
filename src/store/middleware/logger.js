const logger = (param) => (store) => (next) => (action) => {
	console.log('Logging', param);
	return next(action);
	// logger > toast > api
	// the promise from the api middle ware is not passed
	// outisde this middleware chain
};

export default logger;
