let config = {
  APP_SECRET: '122344566777',
  MONGO_URL: 'mongodb://127.0.0.1/amberjs-like-app',
  API_URL: 'http://localhost:4000',
  USER_ROLES: {
    ADMIN: { role: 'admin' },
    REGISTERED: { role: 'registered' }
  },
  RENTAL_CATEGORIES: [
    { category: 'Apartment' },
    { category: 'House' },
    { category: 'Mansion' },
    { category: 'Hut' }
  ]
}

let environment = {
  development: {},
  production: {
    API_URL: 'http://vue-rentals.com:4000'
  }
}

let environmentID = process.env.NODE_ENV || 'development'

for (let key in environment[environmentID]) {
  config[key] = environment[environmentID][key]
}

module.exports = config
