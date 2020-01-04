import { allowOrigin, returnError, checkMethod } from './lambda'
import { q, client } from './fauna'

const fun = async () => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('all_products_or_deliveries'), 'product'),
        { size: 1000 }
      ),
      ref => q.Get(ref)
    )
  )
  const products = data.map(({ data, ref: { value: { id }} }) => {
    data.ref = id
    return data
  })

  return { products }
}

exports.handler = async ({ httpMethod }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed

    const response = await fun()

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}