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
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
        return handleDevelopmentError(error)
    }
    return handleProductionError(error)
}

const handleDevelopmentError = (error) => {
    console.log(error)

    if (error.code && error.name === 'FirebaseError') {
        return {
            status: 503,
            message: error.message,
        }
    }

    return {
        status: error.status || 500,
        message: error.message,
        stack: error.stack,
    }
}

const handleProductionError = (error) => {
    console.log(error)

    if (error.isOperational) {
        return {
            status: error.status,
            message: error.message,
        }
    }

    if (error.code && error.name === 'FirebaseError') {
        return {
            status: 503,
            message: 'Internal server error! Please hang on for a while.',
        }
    }

    return {
        status: 500,
        message: 'Something went wrong! Please try again.',
    }
}

export { AppError, catchAsync }
