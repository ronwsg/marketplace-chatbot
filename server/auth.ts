import * as jwt from 'jsonwebtoken'

const signatureAlgorithm = 'HS512'
const signatureSecret = 'dummyKey'

const generateRegularUser = () => {
  let userRole = ['ROLE_CUSTOMER']
  return createUserRecord('1111111',
      'John',
      'Smith',
      'Jr.',
      'Male',
      'JohnSmith@gmail.com',
      'http://profile.ak.fbcdn.net/static-ak/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif', userRole)
}

const generateAdminUser = () => {
  let adminRole = ['ROLE_ADMIN']
  return createUserRecord('1111111',
      'Mary',
      'Brown',
      '',
      'Female',
      'MaryBroun@example.com',
      'http://profile.ak.fbcdn.net/static-ak/rsrc.php/v2/yo/r/UlIqmHJn-SK.gif', adminRole)
}

const createUserRecord = (id, firstName, lastName, secondLastName, gender, email, photo, roles: string[]) => {
  let dummyUserRecord = {
    id: id,
    name: {
      givenName: firstName,
      familyName: lastName
    },
    displayName: firstName + ' ' + lastName + ' ' + secondLastName,
    gender: gender,
    emails: [email],
    photos: [{ value: photo }],
  }

  let  dummyJWTPayload = {
    sub: firstName + ' ' + lastName,
    scopes: roles,
    iss: 'SI&O R&D Digital',
    givenName: firstName,
    familyName: lastName,
    displayName: firstName + ' ' + lastName + ' ' + secondLastName,
    email: email
  }

  return {
      dummyUserRecord: dummyUserRecord,
      dummyJWTPayload: dummyJWTPayload
    }
}

export default (app) => {
  // ////////////////////////////////////////////////////////////////
  // mock login API - in production login will be redirected to
  // the UI backend 
  // returns two types of users - regular and admin
  // username = 'admin' will return a user with admin role
  app.get('/api/login', (req, res) => {
    let userRec
    if (req.query.username === 'admin@amdocs.com') {
      userRec = generateAdminUser()
    }
    else {
      userRec = generateRegularUser()
    }
    let signedToken = jwt.sign(userRec.dummyJWTPayload, new Buffer(signatureSecret, 'base64'),
      { algorithm: signatureAlgorithm, expiresIn: '1h' })
    res.send({
      user: userRec.dummyUserRecord,
      token: signedToken
    })
  })
}