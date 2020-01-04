import axios from 'axios'
import find from 'lodash.find'
import dotenv from 'dotenv'
dotenv.config()
import { allowOrigin, returnError, checkMethod } from './lambda'

exports.handler = async ({ httpMethod }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const { data } = await axios.get('https://api.nomics.com/v1/exchange-rates', {
      params: {
        key: process.env.NOMICS_KEY
      }
    })
    const btcPrice = parseFloat(find(data, { currency: 'BTC'})['rate'])
    const response = data.reduce(function(obj, item) {
      obj[item.currency] = btcPrice / parseFloat(item.rate)
      return obj
    }, {})

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
