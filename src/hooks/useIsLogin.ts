import useLocalStorage from './useLocalStorage'

const useIsLoggedIn = (): boolean => {
  const [token] = useLocalStorage('tokens', null)
  return Boolean(token)
}

export default useIsLoggedIn
