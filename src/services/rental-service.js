import axios from '@/axios'

export const RentalService = {
  getAll() {
    return axios.post('/graphql', {
      query: `query {
          rentals {
            _id
            title
            owner {
                _id
                name
            }
            city
            category {
                _id
                category
            }
            image
            bedrooms
            description
            gps {
                lat
                lng
            }
            published
          }
          categories {
              _id
              category
          }             
        }
      `
    })
  },
  getPaginated(args) {
    return axios.post('/graphql', {
      query: `query {
        rentalsPaginated(
          search: "${args.search}",
          page: ${args.page},
          itemsPerPage: ${args.pageSize}) {
            count
            rentals {
              _id
              title
              owner {
                  _id
                  name
              }
              city
              category {
                  _id
                  category
              }
              image
              bedrooms
              description
              gps {
                  lat
                  lng
              }
              published
            }                      
          }             
        }
      `
    })
  },
  getById(id) {
    return axios.post('/graphql', {
      query: `query {
        rental(_id: "${id}") {
            _id
            title
            owner {
                _id
                name
            }
            city
            category {
                _id
                category
            }
            image
            bedrooms
            description
            gps {
                lat
                lng
            }
            published
          }
        }
      `
    })
  },
  getByOwner(ownerId) {
    return axios.post('/graphql', {
      query: `query {
        rentalsByOwner(owner: "${ownerId}") {
          _id
          title
          owner {
              _id
              name
          }
          city
          category {
              _id
              category
          }
          image
          bedrooms
          description
          gps {
              lat
              lng
          }
          published             
        }
        categories {
          _id
          category
        }         
      }
      `
    })
  },
  getByCategory(categoryId) {
    return axios.post('/graphql', {
      query: `query {
        rentalsByCategory(category: "${categoryId}") {
            _id
            title
            owner {
                _id
                name
            }
            city
            category {
                _id
                category
            }
            image
            bedrooms
            description
            gps {
                lat
                lng
            }
            published
          }
        }
      `
    })
  },
  add(item) {
    item.gps = item.gps ? JSON.stringify(item.gps) : ''
    return axios.post('/graphql', {
      query: `mutation {
        addRental(
            title: "${item.title}",
            owner: "${item.owner}", 
            city: "${item.city}", 
            category: "${item.category}", 
            image: "${item.image}", 
            bedrooms: ${item.bedrooms}, 
            description: "${item.description}"             
            gps: "${item.gps}") {
                _id
                title
                owner {
                    _id
                    name
                }
                city
                category {
                    _id
                    category
                }
                image
                bedrooms
                description
                gps {
                    lat
                    lng
                }
                published
          }
        }
      `
    })
  },
  update(item) {
    item.gps = item.gps ? JSON.stringify(item.gps) : ''
    //use regex to remove "" from keys
    item.gps = item.gps.replace(/\"([^(\")"]+)\":/g, '$1:')
    // remove "" from numbers
    item.gps = item.gps.replace(/"(-?[\d.]+)"/g, '$1')
    return axios.post('/graphql', {
      query: `mutation {
        updateRental(
            _id: "${item._id}",
            title: "${item.title}",            
            city: "${item.city}", 
            category: "${item.category}", 
            image: "${item.image}", 
            bedrooms: ${item.bedrooms}, 
            description: "${item.description}", 
            gps: "${item.gps}") {
                _id
                title
                owner {
                    _id
                    name
                }
                city
                category {
                    _id
                    category
                }
                image
                bedrooms
                description
                gps {
                    lat
                    lng
                }
                published  
          }
        }
      `
    })
  },
  delete(id) {
    return axios.post('/graphql', {
      query: `mutation {
        deleteRental(_id: "${id}") {
            _id
            title            
          }
        }
      `
    })
  }
}
