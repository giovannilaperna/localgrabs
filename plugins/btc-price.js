export default async (ctx, inject) => {
  try {
    const { data } = await ctx.$axios.get('/.netlify/functions/nomics-exchange-rates')
    inject('btcPrice', data)
  } catch(error) {
    inject('btcPrice', {})
  }
}