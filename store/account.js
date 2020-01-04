export const state = () => ({
  username: null
})

export const mutations = {
  setUsername (store, value) {
    store.username = value
  }
}