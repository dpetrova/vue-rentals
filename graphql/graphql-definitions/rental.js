let Rental = require('../../db/models/rental')
let RentalCategory = require('../../db/models/category')

//typeDef + resolver ( defined here, so you can collapse them)
let typeDef
let resolver

//Type Def
{
  typeDef = `
    type Rental {
        _id: ID
        title: String!
        owner: User!
        city: String!
        category: RentalCategory!
        image: String
        bedrooms: Int
        description: String
        gps: GPS       
        published: Date
    }

    type Query {
      rental(_id: ID!): Rental
      rentals: [Rental]
      rentalsPaginated(search: String, page: Int, itemsPerPage: Int): PaginatedRentals
      rentalsByCategory(category: String!): [Rental]
      rentalsByOwner(owner: String!): [Rental]
      categories: [RentalCategory]
    }

    type Mutation {        
        addRental(title: String!, owner: String!, city: String!, category: String!, image: String, bedrooms: Int, description: String, gps: String): Rental
        updateRental(_id: ID!, title: String!, city: String!, category: String!, image: String, bedrooms: Int, description: String, gps: String): Rental 
        deleteRental(_id: ID!): Rental       
    }

    type RentalCategory {
        _id: ID
        category: String        
    }

    type GPS { 
      lat: Float
      lng: Float
    }

    type PaginatedRentals {
      rentals: [Rental]
      count: Int
    }
    `
}

// Resolver
resolver = {
  Query: {
    rental: (root, id) => {
      return Rental.GetById(id)
    },
    rentals: () => {
      return Rental.GetAll()
    },
    rentalsPaginated: (root, args) => {
      return Rental.GetPaginated(args)
    },
    rentalsByCategory: (root, args) => {
      return Rental.GetByCategory(args.category)
    },
    rentalsByOwner: (root, args) => {
      return Rental.GetByOwner(args.owner)
    },
    categories: () => {
      return RentalCategory.GetAll()
    }
  },
  Mutation: {
    addRental: async (root, args) => {
      return Rental.Create(args)
    },
    updateRental: (root, args) => {
      return Rental.Update(args)
    },
    deleteRental: async (root, args) => {
      return Rental.Delete(args._id)
    }
  }
}

module.exports = {
  typeDef: typeDef,
  resolver: resolver
}
