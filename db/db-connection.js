var config = require('../globals')
var mongoose = require('mongoose')
var seedDefault = require('./initial-seed')

var mongoDB = config.MONGO_URL
mongoose.connect(mongoDB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.Promise = global.Promise

var db = mongoose.connection

db.on('error', function(err) {
  console.log('connection error:', err.message)
})

// On successful connect
db.once('open', function callback() {
  console.log('Connected to MongoDB at ' + mongoDB)
  seedDefault()
})

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
