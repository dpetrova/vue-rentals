const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cfg = require('../../globals')
const UserRole = require('./user_role')

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: String,
  email: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole' },
  created_at: { type: Date, default: Date.now }
})

userSchema.post('save', function(error, doc, next) {  
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Username is already taken'))
  } else {
    next(error)
  }
})

var User = (module.exports = mongoose.model('User', userSchema))

User.GetAll = () => {
  return User.find({})
    .sort('created_at: -1')
    .populate('role')
}

User.GetById = id => {
  return User.findById(id).populate('role')
}

User.Authenticate = async args => {
  const user = await User.findOne({ username: args.username }).populate('role')

  if (!user) throw new Error('No such user found')

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) throw new Error('Invalid password')

  const token = jwt.sign(
    { userId: user._id, userRole: user.role },
    cfg.APP_SECRET
  )

  return {
    token,
    user
  }
}

User.Create = async args => {
  args.created_at = Date.now()
  if (!args.role) {
    let registeredRole = await UserRole.findOne({
      role: cfg.USER_ROLES.REGISTERED.role
    })
    args.role = registeredRole
  }
  const password = await bcrypt.hash(args.password, 10)
  var newUser = new User({ ...args, password })
  const user = await newUser.save()
  await User.populate(user, ['role'])
  return user
}

User.Update = async args => {
  if (args.password) {
    args.password = await bcrypt.hash(args.password, 10)
  } else {
    delete args.password
  }

  return User.findOneAndUpdate(
    { _id: args._id },
    { $set: { ...args } },
    { new: true, useFindAndModify: false }
  ).populate('role')
}

User.Delete = id => {
  return User.findOneAndRemove(id)
}
