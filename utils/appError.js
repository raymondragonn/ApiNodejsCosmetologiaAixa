//global middleware para manejar errores
class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';//Cuando comienza con 4 el status Code es fail sino es error
        this.isOperational = true; //Para saber si el error es operacional o no

        Error.captureStackTrace(this, this.constuctor);
    }
}

module.exports = AppError;