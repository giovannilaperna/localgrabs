import { parse } from 'qs'
import { allowOrigin, returnError, checkMethod } from './lambda'
import { q, client } from './fauna'

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed
    
    const { ref } = parse(queryStringParameters)
    const { data } = await client.query(
      q.Get(q.Ref(q.Collection('products'), ref))
    )

    return {
      statusCode : 200,
      body: JSON.stringify({ product: data }),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
