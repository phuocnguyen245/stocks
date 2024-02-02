import useLocalStorage from './useLocalStorage'

const useIsLogin = (): boolean => {
  const [token] = useLocalStorage('tokens', null)
  return Boolean(token)
}

export default useIsLogin
