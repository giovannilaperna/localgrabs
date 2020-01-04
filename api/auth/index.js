// https://graph.facebook.com/me?fields=id&access_token=EAANdMcFdMygBAMEVPZBFdf7aNNYk494dJFzgHDadHB3ifT4qxukkDp00K8kZAge9tGBjQj8adZC2m5HOxL7GRXf9eXO3eSypv2drT5shYZA2xFZB4yc3OmDHfM6ytZBA3vbZAPBFuAPwbrMHl6DFmZAsff6iCCv4Ks9n5nhZA7FQeYZBt8swGXfkMrartL3PNTezPfe846JyfTqS4AuC2SzztZC

import axios from 'axios'
import { allowOrigin } from '../lambda'

export const authorize = async (headers) => {
  try {
    const access_token = headers.authorization.split(' ')[1]

    // Insecure, use this instead https://stackoverflow.com/questions/8605703/how-to-verify-facebook-access-token
    const { data: { id } } = await axios.get('https://graph.facebook.com/me', {
      params: { field: 'id', access_token }
    })
    return parseInt(id)
  } catch ({ message }) {
    console.log(message)
  }
}

export const unauthorizedResponse = {
  statusCode: 401,
  body: 'Unauthorized',
  headers: {
    'Access-Control-Allow-Origin': allowOrigin,
  }
}
