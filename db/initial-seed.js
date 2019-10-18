const bcrypt = require('bcryptjs')
const config = require('../globals')
const UserRole = require('./models/user_role')
const RentalCategory = require('./models/category')
const Rental = require('./models/rental')
const User = require('./models/user')
const data = require('./data')

var seedUserRoles = () => {
  let items = []
  let map = config.USER_ROLES

  for (let key in map) {
    items.push(map[key])
  }

  return Promise.all(
    items.map(item => {
      const role = new UserRole(item)
      return role.save()
    })
  )
}

var seedRentalCategories = () => {
  let items = []
  let map = config.RENTAL_CATEGORIES

  for (let key in map) {
    items.push(map[key])
  }

  return Promise.all(
    items.map(item => {
      const role = new RentalCategory(item)
      return role.save()
    })
  )
}

function randomEl(list) {
  var i = Math.floor(Math.random() * list.length)
  return list[i]
}

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min
}

var seedRentals = async () => {
  let items = []
  let user = await User.findOne({})
  let categories = await RentalCategory.find({})

  for (let index = 0; index < 50; index++) {
    const city = randomEl(data.cities)
    const title = `${randomEl(data.adjectives)
      .charAt(0)
      .toUpperCase() + randomEl(data.adjectives).slice(1)} ${randomEl(
      data.nouns
    )
      .charAt(0)
      .toUpperCase() + randomEl(data.nouns).slice(1)}`
    const category = randomEl(categories)
    const bedrooms = Math.round(getRandomNum(1, 6))
    const image = `house_${Math.round(getRandomNum(1, 10))}.jpg`

    const item = {
      title: title,
      owner: user,
      city: city.name,
      category: category,
      image: image,
      bedrooms: bedrooms,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      gps: city.path
    }

    items.push(item)
  }

  return Promise.all(
    items.map(item => {
      const rental = new Rental(item)
      return rental.save()
    })
  )
}

var seedDefaultUser = async role => {
  const password = await bcrypt.hash('admin', 10)

  const user = new User({
    username: 'admin',
    name: 'Admin',
    password: password,
    email: 'admin@admin.com',
    role: role
  })
  return user.save()
}

var seedDefault = async () => {
  //user_role
  let roles = await UserRole.find({})

  if (roles.length <= 0) {
    roles = await seedUserRoles()
  }

  //user
  let adminRole = roles.find(item => {
    return item.role === config.USER_ROLES.ADMIN.role
  })

  let users = await User.find({})
  if (users.length <= 0) {
    await seedDefaultUser(adminRole)
  }

  //rental categories
  let categories = await RentalCategory.find({})

  if (categories.length <= 0) {
    categories = await seedRentalCategories()
  }

  //rentals
  let rentals = await Rental.find({})

  if (rentals.length <= 0) {
    rentals = await seedRentals()
  }
}

module.exports = seedDefault
