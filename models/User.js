import mongoose from 'mongoose'
import {FavoriteSchema} from 'projectRoot/models/Favorite.js'
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
    },
    favorite : [String]
})


const User = mongoose.model('user', UserSchema)

export {
    UserSchema,
    User
}