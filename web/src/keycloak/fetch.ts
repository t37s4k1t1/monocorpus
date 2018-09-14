import { keycloakAuth } from '../keycloak'
/**
 * before fetching a page through graphql,
 * check whether the token is expired and 
 * optionally update it.
 * 
 * options should be a RequestInit, i think.
 */
export default async (uri?: string | Request, options?: any): Promise<any> => {
  let isExpired = keycloakAuth.isTokenExpired(30)

  if (isExpired) {
    return keycloakAuth.updateToken(30)
      .success((result) => {
        let newAccessToken = keycloakAuth.token
        options.headers.authorization = `Bearer ${newAccessToken}`
        return fetch(uri, options)
      })
      .error((result) => {
        // uh oh.
      })
  }
  else {
    return fetch(uri, options)
  }
  
}