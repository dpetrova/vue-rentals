var { GraphQLScalarType } = require('graphql')
var { Kind } = require('graphql/language')

let typeDef = `
    scalar Date
`

let resolver = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    }
  })
}

module.exports = { resolver, typeDef: typeDef }
