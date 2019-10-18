var User = require('../../db/models/user')
const UserRole = require('../../db/models/user_role')
const { isAuthorized } = require('../../auth/utils')

let typeDef
let resolver

// Type Def
{
  typeDef = `
    type User {
        _id: ID
        name: String!
        username: String!        
        email: String
        role : UserRole
        created_at : Date
    }

    type Query {
        user(_id: ID!): User
        users: [User]
        userRoles: [UserRole]    
    }

    type Mutation {        
        login(username: String!, password: String!): AuthPayload
        addUser(name: String!, username: String!, password: String!, email: String): User
        updateUser(_id: ID!, name: String, username: String, password: String, email: String): User
        deleteUser(_id: ID!): User
    }

    type AuthPayload {
        token: String
        user: User
    }

    type UserRole {
        _id: ID
        role: String
    }

    `
}

// Resolver
resolver = {
  Query: {
    user: (root, id) => {
      return User.GetById(id)
    },
    users: () => {
      return User.GetAll()
    },
    userRoles: () => {
      return UserRole.GetAll()
    }
  },
  Mutation: {
    login: (root, { username, password }) => {
      return User.Authenticate({ username, password })
    },
    addUser: async (root, args) => {
      console.log(args)
      return User.Create(args)
    },
    updateUser: async (root, args, context) => {
      try {
        await isAuthorized(context, 'user:update-credentials', {
          userId: args._id.toString()
        })
        return User.Update(args)
      } catch (e) {
        return e
      }
    },
    deleteUser: async (root, id, context) => {
      try {
        await isAuthorized(context, 'user:delete')
        return User.Delete(id)
      } catch (e) {
        return e
      }
    }
  }
}

module.exports = {
  typeDef: typeDef,
  resolver: resolver
}
