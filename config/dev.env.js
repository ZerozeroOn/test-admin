'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://easy-mock.com/mock/5cd2731e7c940631de15db2d/test"',
  ONLINE_API: '"http://47.92.165.114:8999/fire-service/api/public/"',
})
