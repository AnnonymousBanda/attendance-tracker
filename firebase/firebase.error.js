class AppError extends Error {
	constructor(message, status) {
		super(message)
		this.status = status
		Error.captureStackTrace(this, this.constructor)
	}
}

const catchAsync = (fn) => {
	return (...params) => {
		try {
			return fn(...params)
		} catch (error) {
			return globalErrorHandler(error)
		}
	}
}

const globalErrorHandler = (error) => {
	return {
		status: error.status || 500,
		message: error.message || 'Internal server error',
		stack: error.stack || null,
	}
}

module.exports = { AppError, catchAsync }
