export default ({ $axios }, inject) => {
  const blockcypher = {
    wallets: {
      list: async () => {
        try {
          const { data } = await $axios.get('/.netlify/functions/blockcypher-hd-wallets-list')
          return data
        } catch (error) {
          console.log(error)
        }
      },
      get: async (name) => {
        try {
          const { data } = await $axios.get('/.netlify/functions/blockcypher-hd-wallets-get', {
            params: { name }
          })
          return data        
        } catch (error) {
          console.log(error)
        }
      },
      create: async ({ name, subchain_indexes }) => {
        try {
          const { data } = await $axios.post('/.netlify/functions/blockcypher-hd-wallet-create', {
            name, subchain_indexes
          })
          return data
        } catch (error) {
          console.log(error)
        }
      },
      delete: async (name) => {
        try {
          const { data } = await $axios.post('/.netlify/functions/blockcypher-hd-wallet-delete', {
            name
          })
          return data
        } catch (error) {
          console.log(error)
        }
      },
      deriveAddress: async (name, params) => {
        try {
          const { data } = await $axios.post('/.netlify/functions/blockcypher-hd-wallet-derive-address', {
            name, params
          })
          return data   
        } catch (error) {
          console.log(error)
        }
      }
    },
    hooks: {
      list: async () => {
        try {
          const { data } = await $axios.get('/.netlify/functions/blockcypher-hooks-list')
          return data            
        } catch (error) {
          console.log(error)
        }
      },
      get: async (id) => {
        try {
          const { data } = await $axios.get('/.netlify/functions/blockcypher-hooks-get', {
            params: { id }
          })
          return data           
        } catch (error) {
          console.log(error)
        }
      },
      create: async ({ event, address, url, confirmations }) => {
        try {
          const { data } = await $axios.post('/.netlify/functions/blockcypher-hooks-create', {
            event, address, url, confirmations
          })
          return data        
        } catch (error) {
          console.log(error)
        }
      },
      delete: async (id) => {
        try {
          const { data } = await $axios.post('/.netlify/functions/blockcypher-hooks-delete', {
            id
          })
          return data  
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
  inject('blockcypher', blockcypher)
}