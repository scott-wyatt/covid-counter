/**
 * Make a Post Request to UA covid counter
 * @param val
 * @param credentials
 * @param location
 * @return {Promise<Response>}
 */
export const postRequest = function (val, credentials, location) {
  // TODO, use the location in the body and credentials in the header
  // TODO, change to UA
  return fetch('https://jsonplaceholder.typicode.com/photos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': `JWT ${credentials}`
    },
    body: JSON.stringify(val)
  })
}

/**
 * Make a Get request to UA covid counter
 * @param location
 * @return {Promise<Response>}
 */
export const getRequest = function (location) {
  // TODO, change to UA
  return fetch(`https://jsonplaceholder.typicode.com/photos/1`)
}
