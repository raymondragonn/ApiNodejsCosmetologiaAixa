const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); //encriptar la contraseña

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        value: [validator.isEmail, 'Please provide a valid email']
    },
    // photo: String,
    role: {
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //This only works on CREATE and SAVE
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function(next){
    //Solo se ejecuta si la contraseña fue modificada
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);//El segundo parametro es el costo de la encriptacion
    this.passwordConfirm = undefined;//Borras el campo de confirmacion de contraseña
    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Data.now() - 1000;
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    //this.password no estara disponible por que le puse select: false
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangeAt){

        const changedTimestamp = parseInt(this.passwordChangeAt.getTime()/1000,10);
        return JWTTimestamp < changedTimestamp; //100 < 200 cree mi contraseña en el 100 y lo cambien en el minuto 200 osea regresa false cuando no hallas cambiado la contrasña
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('Base de datos'+this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutos
    return resetToken;

}


const User = mongoose.model('User', userSchema);

module.exports = User; 