import bcypher from 'blockcypher-promise'
import dotenv from 'dotenv'
dotenv.config()

export const bcapi = new bcypher('btc',process.env.CHAIN, process.env.BLOCKCYPHER_TOKEN);