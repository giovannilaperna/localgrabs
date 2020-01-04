import { allowOrigin, returnError, checkMethod } from './lambda'
import { q, client } from './fauna'
import { parse } from 'qs'

const fun = async (status) => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('matches_by_advertisement_and_status'), 'product', parseInt(status)),
        { size: 1000 }
      ),
      ref => q.Get(ref)
    )
  )
  const deliveries = data.map(({ data, ref: { value: { id }} }) => {
    data.ref = id
    return data
  })

  return { deliveries }
}

exports.handler = async ({ httpMethod, queryStringParameters }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed

    const {status} = parse(queryStringParameters)
    const response = await fun(status)

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}