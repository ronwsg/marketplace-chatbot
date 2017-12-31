// ========================================================
// Default client Configuration
// ========================================================
const config = {
  axios: {
    timeout: 10000
  },

  jwt: {
    signature: {
      secret: 'dummyKey',
      algorithm: 'HS512'
    }
  },
  // Role Based Authorization -->
  // defines which functions are granted to which user role
  // format ---> {<role name>: [<function 1>,<function 2>], <role2>: ['func'] ...}
  rba: {
    'ROLE_CUSTOMER': [
      'homepage-button'
    ],
    'ROLE_ADMIN': [
      'homepage-button',
      'homepage-button-admin'
    ]
  }
}

export default config
