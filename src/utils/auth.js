export function getUser () {
  const user = window.localStorage.getItem('token_maya')
  return user ? JSON.parse(user) : null
}

export function isLogin () {
  const user = getUser()
  return Boolean(user?.email)
}
