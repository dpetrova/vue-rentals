const mongoose = require('mongoose')

var rentalSchema = mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalCategory',
    required: true
  },
  image: String,
  bedrooms: Number,
  description: String,
  gps: mongoose.Schema.Types.Mixed,
  published: { type: Date, default: Date.now }
})

var Rental = (module.exports = mongoose.model('Rental', rentalSchema))

Rental.GetAll = () => {
  return Rental.find()
    .sort({ published: -1 })
    .populate('owner')
    .populate('category')
}

Rental.GetById = id => {
  return Rental.findById(id)
    .populate('owner')
    .populate('category')
}

Rental.GetPaginated = async args => {
  const count = await Rental.countDocuments({
    city: { $regex: `^${args.search}`, $options: 'i' }
  })

  const rentals = await Rental.find({
    city: { $regex: `^${args.search}`, $options: 'i' }
  })
    .sort({ published: -1 })
    .skip((args.page - 1) * args.itemsPerPage)
    .limit(args.itemsPerPage)
    .populate('owner')
    .populate('category')

  return {
    rentals,
    count
  }
}

Rental.GetByOwner = ownerId => {
  return Rental.find({ owner: ownerId })
    .sort({ published: -1 })
    .populate('owner')
    .populate('category')
}

Rental.GetByCategory = categoryId => {
  return Rental.find({ category: categoryId })
    .populate('owner')
    .populate('category')
}

Rental.Create = async args => {
  args.image = `house_default.png`
  var item = new Rental(args)
  const rental = await item.save()
  var opts = [{ path: 'owner' }, { path: 'category' }]

  await Rental.populate(rental, opts)
  return rental
}

Rental.Update = async args => {
  if (args.gps) {
    args.gps = { lat: 0, lng: 0 }
  }
  return Rental.findOneAndUpdate(
    { _id: args._id },
    { $set: { ...args } },
    { new: true, useFindAndModify: false }
  )
    .populate('owner')
    .populate('category')
}

Rental.Delete = id => {
  return Rental.findOneAndRemove({ _id: id })
}
