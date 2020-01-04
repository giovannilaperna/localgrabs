import axios from 'axios'
import { parse } from 'qs'
import { allowOrigin, returnError, checkMethod } from './lambda'

exports.handler = async ({ httpMethod , queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const { asin } = parse(queryStringParameters)
    const { data } = await axios.get(`https://localgrabr-now.now.sh/api/amazon/specifications/${asin}`)

    return {
      statusCode : 200,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
