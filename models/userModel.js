const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required:[true, 'Please provide your email'],
        validate: [validator.isEmail, 'Please provide a valid Email'],
        unique: true
    },
    nickname: {
        type: String,
        required: [true, 'please provide your nickname'],
        unique: true
    },
    photo: String,
    role: {
      type: String,
      default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide your password confirm'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Password Does not match'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
userSchema.virtual('quote', {
  ref: 'Quote',
  foreignField: 'user',
  localField: '_id'
});

// Document Middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function() {
  if(!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance Method
userSchema.methods.correctPassword = async function(inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function(JWTIsuedAt) {
  if(this.passwordChangedAt) {
    const d = parseInt(this.passwordChangedAt.getTime() /1000, 10);
    return JWTIsuedAt < d;
  }
  
  return false;
};

userSchema.methods.resetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  console.log({ resetToken }, this.passwordResetToken);
  
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;