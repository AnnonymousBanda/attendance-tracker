class AppError extends Error {
	constructor(message, status) {
		super(message)
		this.status = status
		this.isOperational = true
		Error.captureStackTrace(this, this.constructor)
	}
}

const catchAsync = (fn) => {
	return async (...params) => {
		try {
			return await fn(...params)
		} catch (error) {
			console.log('Global error handler:')
			return globalErrorHandler(error)
		}
	}
}

const globalErrorHandler = (error) => {
	if (process.env.NEXT_PUBLIC_ENV === 'development')
		handleDevelopmentError(error)
	else handleProductionError(error)
}

const handleDevelopmentError = (error) => {
	return {
		status: error.status || 500,
		message: error.message,
		stack: error.stack,
	}
}

const handleProductionError = (error) => {
	if (error.isOperational) {
		return {
			status: error.status,
			message: error.message,
		}
	}
	return {
		status: 500,
		message: 'Something went wrong',
	}
}

export { AppError, catchAsync }
