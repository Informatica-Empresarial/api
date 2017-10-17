
import _ from 'lodash'

let routes = []

let directories = [
  'users', 'groups', 'logs', 'services', 'appointments', 'notifications'
]

let singleRoutes = [
  'root', 'accounts', 'constants',  'sessions', 'cities'
]

_.each(singleRoutes, route => {
  routes.push(require(`./${route}`))
})

_.each(directories, directory => {
  require(`./${directory}`).forEach(route => {
    routes.push(route)
  })
})

export default _.flatten(routes)
