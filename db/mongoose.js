import mongoose from 'mongoose'
import config from 'projectRoot/db/config.js'

mongoose.Promise = global.Promise

// mongoose.connect(`mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}/${config.mongodb.database}`, {
//     useNewUrlParser : true,
//     useUnifiedTopology: true,
// })

mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
})

export {
    mongoose
}