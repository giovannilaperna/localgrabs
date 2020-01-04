import { allowOrigin, returnError, checkMethod } from './lambda'
import { q, client } from './fauna'
import { parse } from 'qs'

const fun = async (trade) => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('messages_by_trade'), trade),
        { size: 1000 }
      ),
      ref => q.Get(ref)
    )
  )
  const messages = data.map(({ data, ref: { value: { id }} }) => {
    data.ref = id
    return data
  })

  return { messages }
}

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed

    const { trade } = parse(queryStringParameters)
    
    const response = await fun(trade)

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ messages }) {
    return returnError(message)
  }
}
