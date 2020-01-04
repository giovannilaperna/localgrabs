
export default {
  mode: 'spa',
  env: {
    WALLET_NAME: process.env.WALLET_NAME,
    WEBHOOK_AUTH: process.env.WEBHOOK_AUTH
  }, 
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [
  ],
  plugins: [
    '~/plugins/db.js',
    '~/plugins/utils.js',
    '~/plugins/btc-price.js',
    '~/plugins/blockcypher.js',
    '~plugins/vue-qrcode.js'
  ],
  buildModules: [
  ],
  modules: [
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    '@nuxtjs/moment',
    ['cookie-universal-nuxt', { parseJSON: false }],
  ],
  axios: {
    debug: false,
    baseURL:  (process.env.URL) ? process.env.URL : 'http://localhost:34567',
    proxyHeaders: true
  },
  auth: {
    redirect: {
      login: '/',
      callback: '/cb/',
      home: '/cb2/'
    },
    strategies: {
      facebook: {
        client_id: '946893209023272',
        userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=name',
        scope: ['email', 'public_profile']
      },
    }
  },
  router: {
    middleware: [
      'loginRedirect'
    ]
  },
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    extend (config, ctx) {
    }
  }
}
