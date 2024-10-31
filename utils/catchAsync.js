module.exports = catchAsync = fn => {
    return (req, res, next) => {
        fn(req,res, next).catch(next);//Esta funcion encierra a la funcion que lo llame y como es asyncrona va a retomar algo por eso el catch y ya lo mandas a next
    };
};