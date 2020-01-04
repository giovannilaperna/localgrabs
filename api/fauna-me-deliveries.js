import { allowOrigin, returnError, checkMethod } from './lambda'
import { q, client } from './fauna'
import { authorize } from './auth'

const fun = async (ref) => {
  const { data } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('me_deliveries'), ref.toString()),
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

exports.handler = async ({ httpMethod, headers }) => {
  try {
    const notAllowed = checkMethod(httpMethod, 'GET', 'authorization')
    if (notAllowed) return notAllowed

    const ref = await authorize(headers)    
    const response = await fun(ref)

    return {
      statusCode : 200,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch ({ message }) {
    return returnError(message)
  }
}
