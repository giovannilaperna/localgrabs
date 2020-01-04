export default function ({ route, app, redirect }) {
  const fullPath = app.$cookies.get('route')
  if (route.fullPath === '/cb2/' && fullPath) {
    return redirect(fullPath)
  }
  else if (route.name !== 'cb'&& route.name !== 'cb2') {
    app.$cookies.set('route', route.fullPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
  }
}