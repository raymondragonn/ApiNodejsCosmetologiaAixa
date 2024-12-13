const crypto = require('crypto');//encriptar las contraseñas
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {//Cuando se crea una cuenta me da un token
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async  (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req,res,next) => {
    const {email,password} = req.body;//Para no repetir req.body.email y req.body.password se hace eso para almacenar email y password de req.body
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({email: email}).select('+password');//Ya que le habiamos puesto que no lo mosstrara en el modelo se le pone el + para volver a mostrarlo
    //lo que se hace es incryptar la contraseña que el usuario manda y conmpara con la que se tiene en la base de datos
    //('12345678') == $2a$12$W6F5zvQpZuq3tZ7O7Zj2eOJ4ZqF0Q4Y5b6VwP6fzv7v4Y8l7Z4Z5m
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('Incorrect email or password', 401));
    }


    createAndSendToken(user, 200, res);
    
});

exports.protect = catchAsync(async (req,res,next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not loggen in! Please log in to get access.',401));
    };
    // console.log(token);

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist.',401));
    }
    //4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed passwod! Please log in agina.',401))
    }

    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req,res,next) => {
        //roles ['admin','lead-guide']. role = 'user'
        if(!roles.includes(req.user.role)){//como el middleware anterior se ejecuta me devuelve el currentUser el cual puedo utilizar aqui 
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next();
    }
}

exports.forgotPassword = catchAsync( async (req,res,next) => {
    //!) Get user based on POSTed email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new AppError('There is no suer with email adress',404));
    }
    //2) Generate the random reset token
    const resetToken = user.createPasswordResetToken(); 
    console.log(resetToken);//Este token no esta incriptado por eso lo incripot en el modelo
    
    await user.save({validateBeforeSave: false});//Desactivo la validacion de guardar para que no me pida el passwordConfirm    
    
    //3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        //Modifico los campos pero no los guardo por eso uso el user.save({validateBeforeSave: false})
        await user.save({validateBeforeSave: false});
        return next(new AppError('There was an error sending the email. Try again later!',500));
    }

    
});

exports.resetPassword = catchAsync( async(req,res,next) => {
    //1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');//Encripto el token para compararlo con el que esta en la base de datos

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    
    //2) If token has not expired, and there is user, set the new password
    if(!user){
        return next(new AppError('Token is invalid or has expires',400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3) Update changedPasswordAt property for the user

    //4) Log the user in, send JWT

    createAndSendToken(user, 200, res);

});


exports.updatePassword = catchAsync(async (req,res,next) => {
    //1) Get user from de collection 
    const user = await User.findById(req.user.id).select('+password');//le pides que te devuelva el password de ese usuario
    //2) Check if POSTED current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your current password is wrong.', 401));
    }
    //3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //User.findByIdAndUpdate no funcionaria por que no se ejecutaria el middleware de encriptacion de la contraseña admas que update no guarda el registro de la contrasña solo en create y save 

    //4) Log user in, send JWT
    createAndSendToken(user, 200, res);

});

