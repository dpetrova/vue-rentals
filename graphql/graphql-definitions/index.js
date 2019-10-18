var { makeExecutableSchema } = require('graphql-tools')
const { mergeTypes } = require('merge-graphql-schemas')
let path = require('path')
let fs = require('fs')

var TYPE_DEFS = []
var RESOLVERS = []

let files = fs.readdirSync(path.resolve(__dirname))

files = files.filter(item => {
  return item !== 'index.js' && item.indexOf('.js') !== -1
})

for (let file of files) {
  let graphqlItem = require('./' + file)
  if (graphqlItem.typeDef) TYPE_DEFS.push(graphqlItem.typeDef)
  if (graphqlItem.resolver) RESOLVERS.push(graphqlItem.resolver)
}

const result = makeExecutableSchema({
  typeDefs: mergeTypes(TYPE_DEFS, { all: true }),
  resolvers: RESOLVERS
})

module.exports = result
