import { allowOrigin, returnError, checkMethod } from './lambda'
import { bcapi } from './blockcypher'

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'authorization, content-type')
    if (notAllowed) return notAllowed
    
    const { event, address, url, confirmations } = JSON.parse(body)
    const data = await bcapi.createHook({ event, address, url, confirmations })

    return {
      statusCode : 200,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
