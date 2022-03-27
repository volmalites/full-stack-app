const config = {
  apiBaseUrl: 'http://localhost:5000/api' // Change this for production server, get from window object
}

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8', // Always json for api requests
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      let encodedCredentials;
      if (typeof credentials === 'object') {
        encodedCredentials = window.btoa(`${credentials.username}:${credentials.password}`); // Use window.btoa due to language servers complaining
      } else if (typeof credentials === 'string') {
        encodedCredentials = credentials;
      }
      options.headers['Authorization'] = `Basic ${encodedCredentials}`; // Set headers for api request
    }
    return fetch(url, options);
  }
  
  /**
   * Get username credentials used for validating sign in credentials
   * @param {username} Username, an email address in this case
   * @param {password} Password to validate against username
   * @returns {Object}
   */

  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 500) return {error: 500}; // If server error stop here, do not continue executing the code
    if (response.status === 200) {
      return response.json().then(data => {
        data[0].encodedCredentials = window.btoa(`${username}:${password}`);
        return data;
      });
    }
    else if (response.status === 401) {
      response.message = 'We could not sign you in, please reevaluate your log in credentials and try again.';
      return response;
    }
    else {
      throw new Error();
    }
  }

  /**
   * Create new user to be stored in database
   * @param {firstName} Name for user
   * @param {lastName} Last name for user
   * @param {emailAddress} Email address for user
   * @param {password} Password for user
   * @returns {Object}
   */
  
  async createUser(firstName, lastName, emailAddress, password) {
    const response = await this.api('/users', 'POST', { firstName, lastName, emailAddress, password });
    if (response.status === 500) return {error: 500}; // If server error stop here, do not continue executing the code
    if (response.status === 201) {
      return response;
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}
