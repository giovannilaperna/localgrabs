import { allowOrigin, returnError, checkMethod } from './lambda'
import { bcapi } from './blockcypher'
import { parse } from 'qs'

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const { id } = parse(queryStringParameters)
    const data = await bcapi.getHook(id)

    return {
      statusCode : 200,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
