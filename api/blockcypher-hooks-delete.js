import { allowOrigin, returnError, checkMethod } from './lambda'
import { bcapi } from './blockcypher'

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'authorization, content-type')
    if (notAllowed) return notAllowed
    
    const { id } = JSON.parse(body)
    const data = await bcapi.delHook(id)

    return {
      statusCode : 200,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
