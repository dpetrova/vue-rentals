const express = require('express')
const expressGraphQL = require('express-graphql')
const bodyParser = require('body-parser')
const cors = require('cors')

const schema = require('./graphql-definitions')

const app = express()
const PORT = process.env.PORT || '4000'

require('../db/db-connection')

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: true
  })
)

app.listen(PORT, () => console.log(`GraphQL Server running on port ${PORT}`))
