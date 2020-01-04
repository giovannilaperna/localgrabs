import { allowOrigin, checkMethod } from './lambda'
import { q, client } from './fauna'
import { authorize } from './auth'

exports.handler = async ({ httpMethod, body }) => {
  const notAllowed = checkMethod(httpMethod, 'POST', 'content-type, authorization')
  if (notAllowed) return notAllowed

  try {

    const { ref, props, collection} = JSON.parse(body)

    const response = await client.query(
      q.Update(
        q.Ref(q.Collection(collection), ref),
        { data: props},
      )
    )

    return {
      statusCode : 201,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': allowOrigin }
    }
  } catch (error) {
    console.log(error)
  }
}
