import { allowOrigin, returnError, checkMethod } from './lambda'
import { bcapi } from './blockcypher'
import dotenv from 'dotenv'
dotenv.config()

exports.handler = async ({ httpMethod, body }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'POST', 'authorization, content-type')
    if (notAllowed) return notAllowed
    
    const { name, subchain_indexes } = JSON.parse(body)
    const data = await bcapi.createHDWallet({
      name,
      extended_public_key: process.env.XPUB,
      subchain_indexes
    })

    return {
      statusCode : 200,
      body: JSON.stringify(data),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
