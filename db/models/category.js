const mongoose = require('mongoose')

var rentalCategorySchema = mongoose.Schema({
  category: { type: String, required: true }
})

var RentalCategory = (module.exports = mongoose.model(
  'RentalCategory',
  rentalCategorySchema
))

RentalCategory.GetAll = () => {
  return RentalCategory.find()
}

RentalCategory.Create = async args => {
  var item = new RentalCategory(args)
  return item.save()
}
