export default ({ $axios }, inject) => {
  const db = {
    me: {
      products: async () => {
        const { data } = await $axios.get('/.netlify/functions/fauna-me-products')
        return data 
      },
      deliveries: async () => {
        const { data } = await $axios.get('/.netlify/functions/fauna-me-deliveries')
        return data 
      }
    },
    messages: {
      list: async (ref) => {
        const { data } = await $axios.get('/.netlify/functions/fauna-match-messages', {
          params: { trade: ref }
        })
        return data
      },
      create: async ({ ref, props }) => {
        const { data } = await $axios.post('/.netlify/functions/fauna-generic-create', {
          ref, props, collection: 'messages'
        })
        return data
      }
    },
    matches: {
      get: async (ref) => {
        const { data: { data }} = await $axios.get('/.netlify/functions/fauna-generic-get', {
          params: { ref, collection: 'matches' }
        })
        data.ref = ref
        return { match: data }     
      },
      update: async ({ ref, props }) => {
        const { data: { data }} = await $axios.post('/.netlify/functions/fauna-generic-update', {
          ref, props, collection: 'matches'
        })
        data.ref = ref
        return { match: data }
      }
    },
    deliveries: {
      list: async () => {
        const { data: { deliveries }} = await $axios.get('/.netlify/functions/fauna-deliveries-list')
        return { deliveries }
      },
      filter: async (status) => {
        const { data: { deliveries }} = await $axios.get('/.netlify/functions/fauna-products-filter', {
          params: { status }
        })
        return deliveries
      },

    },
    products: {
      list: async () => {
        const { data: { products }} = await $axios.get('/.netlify/functions/fauna-products-list')
        return { products }
      },
      filter: async (status) => {
        const { data: { products }} = await $axios.get('/.netlify/functions/fauna-products-filter', {
          params: { status }
        })
        return products
      },
      get: async (ref) => {
        const { data: { data }} = await $axios.get('/.netlify/functions/fauna-generic-get', {
          params: { ref, collection: 'matches' }
        })
        data.ref = ref
        return { match: data }     
      },
      create: async ({ ref, props }) => {
        const { data } = await $axios.post('/.netlify/functions/fauna-generic-create', {
          ref, props, collection: 'matches'
        })
        return data
      }
    }
  }
  inject('db', db)
}
