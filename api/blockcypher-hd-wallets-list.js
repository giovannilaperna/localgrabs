import { allowOrigin, returnError, checkMethod } from './lambda'
import { bcapi } from './blockcypher'

exports.handler = async ({ httpMethod }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const data = await bcapi.listWallets()

    return {
      statusCode : 200,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
