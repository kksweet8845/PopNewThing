import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        minlength: 1
    },
    curState: {
        type: String,
        maxlength: 5000,
        default: ''
    }
})


const User = mongoose.model('user', UserSchema)

export {
    UserSchema,
    User
}