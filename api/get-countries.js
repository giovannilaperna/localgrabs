import axios from 'axios'
import { allowOrigin, checkMethod } from './lambda'
import { authorize } from './auth'

exports.handler = async ({ httpMethod, headers }) => {
  const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
  if (notAllowed) return notAllowed

  try { 
    const { data } = await axios.get('https://restcountries.eu/rest/v2/all')
    const countries = data.map(({ name, alpha2Code}) => {
      return { name, alpha2Code}
    })
    return {
      statusCode : 200,
      body: JSON.stringify({ countries }),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    console.log(message)
  }
}
