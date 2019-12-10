import mongoose from 'mongoose'

const FavoriteSchema = new mongoose.Schema({
    userId: {
        type : String,
        required : true,
        minlength : 1,
    },
    urls: [String]
})

const Favorite = mongoose.model('favorite', FavoriteSchema)

export {
    Favorite,
    FavoriteSchema,
}