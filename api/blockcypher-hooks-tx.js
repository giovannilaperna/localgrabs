import { parse } from 'qs'
import { bcapi } from './blockcypher'
import dotenv from 'dotenv'
dotenv.config()

exports.handler = async ({ body, queryStringParameters }) => {
  try {
    const { auth } = parse(queryStringParameters)
    if (auth !== process.env.WEBHOOK_AUTH) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    }
    const data = JSON.parse(body)
    let outputs = data.outputs.map(output => output.addresses[0])
    const wallet = await bcapi.getAddrsWallet(process.env.WALLET_NAME)
    outputs = outputs.filter(output => wallet.indexOf(output) > -1)
    const address = outputs[0]

    const {ref: { value: { id }}} = await client.query(
      q.Get(
        q.Match(q.Index('product_by_address'), address)
      )
    )

    await client.query(
      q.Update(
        q.Ref(q.Collection('products'), id),
        { data: {
          status: (data.confirmations > 1) ? 1 : 0,
          confirmations: data.confirmations
        }},
      )
    )

    return {
      statusCode : 200,
      body: JSON.stringify({ok: 'ok'}),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.log(error)
  }
}