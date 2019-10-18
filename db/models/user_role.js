const mongoose = require('mongoose')

var userRoleSchema = mongoose.Schema({
  role: { type: String, required: true, unique: true }
})

var UserRole = (module.exports = mongoose.model('UserRole', userRoleSchema))

UserRole.GetAll = () => {
  return UserRole.find({})
}

UserRole.Create = async args => {
  var item = new UserRole(args)
  return item.save()
}
