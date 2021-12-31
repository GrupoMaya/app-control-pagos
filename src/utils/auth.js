export const getUser = () => {
  const user = window.localStorage.getItem('token_maya')
  return JSON.parse(user)
}

export const isLogin = () => {
  const user = getUser()
  return Boolean(user?.email)
}
