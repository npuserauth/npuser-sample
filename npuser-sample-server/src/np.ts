import express, { Router, Request, Response, NextFunction } from 'express'
// to install local dev client
// npm install /r/dev/npuserauth/npuser-client/
import { NoPasswordAuthorizer, AuthResponse, ValidateResponse } from 'npuser-client'
import { ApiProvider } from './server'
import { sampleApplicationUserHandler } from './app'
import asyncHandler from 'express-async-handler'
const { BadRequest, InvalidRequest } = require('./errors/application-error')
const { sendResponse } = require('./response-handlers')

const { NPUSER_CLIENT_ID } = process.env // the api key this app uses to connect with the npuser.org service
const { NPUSER_CLIENT_SECRET } = process.env // the shared secret this app uses to send encrypted data to npuser
const { NPUSER_URL } = process.env // the npuser service url with? or without? trailing slash

if (!NPUSER_CLIENT_ID || !NPUSER_CLIENT_SECRET || !NPUSER_URL) {
  throw new Error('Fatal setup error. Need NPUSER_CLIENT_ID, NPUSER_CLIENT_SECRET and NPUSER_URL to be defined in the environment')
}

const verbose = true

const SAMPLE_SERVER_PATH = '/user'
const SAMPLE_SERVER_AUTH_PATH = '/auth'
const SAMPLE_SERVER_VALIDATE_PATH = '/validate'

const npuserAuthorizer = new NoPasswordAuthorizer({
  baseUrl: NPUSER_URL,
  clientId: NPUSER_CLIENT_ID,
  sharedSecretKey: NPUSER_CLIENT_SECRET,
  verbose: verbose // controls the verbosity of the np client library
})

export class SampleNpUserAuthorizer implements ApiProvider {
  async userAuth (req: Request, res: Response, next: NextFunction) {
    const email = req.body.email
    if (verbose) console.log('npuser-sample-server: step 1 request with email:', email)
    const authResponse: AuthResponse = await npuserAuthorizer.sendAuth(email)
    const token = authResponse.token
    if (verbose) console.log('npuser-sample-server:  step 1 response:', authResponse)
    sendResponse(res, { token: token })
  }

  async userValidate (req: Request, res: Response, next: NextFunction) {
    const { email, authToken, code } = req.body
    if (!email || !authToken || !code) {
      return next(new BadRequest('Must provide email address, verification code and the authorization token'))
    }
    if (verbose) console.log('npuser-sample-server: step 2 request with:', email, code, authToken)
    return npuserAuthorizer.sendValidation(email, authToken, code)
      .then((validationResponse: ValidateResponse) => {
        if (!validationResponse.jwt) {
          if (verbose) console.log('npuser-sample-server:  step 2 failed:', validationResponse)
          return next(new InvalidRequest(validationResponse.message))
        }
        if (verbose) console.log('npuser-sample-server: User has been validated by NP User')
        /*
        THAT'S IT!  You have either just registered a new user or a previous user has logged back in.
        From here on your application can manage the user account as needed.
        For this simple sample we will put the JWT into the request body and call the
        next() middleware to handle the new user AND RESPOND to the client.
        The JWT provided by the npuser service is not needed in this sample. It can only be
        validated by the npuser service and it's better if this application creates its own
        JWT for user verification.  The next() middleware can choose to do this or whatever it wants.
         */
        req.body.validationToken = validationResponse.jwt
        next()
      })
  }

  route () {
    const router = Router()
    // STEP 1 -- post to /user/auth with email address will return the authorization token.
    router.post(SAMPLE_SERVER_AUTH_PATH, asyncHandler(this.userAuth))

    // STEP 2 - post to /user/validate. Send email address, authorization token and validation code and finalize the user authorization
    router.post(SAMPLE_SERVER_VALIDATE_PATH, [asyncHandler(this.userValidate), asyncHandler(sampleApplicationUserHandler)])
    return router
  }

  addRoute (middleWare: [express.RequestHandler], app: express.Express): void {
    app.use(SAMPLE_SERVER_PATH, middleWare, this.route())
  }
}

/*
For a good discussion about using async/await with express request handlers see
https://zellwk.com/blog/async-await-express/
Then install and use:
npm install --save express-async-handler
https://www.npmjs.com/package/express-async-handler

const asyncHandler = require('express-async-handler')

app.post('/signup', asyncHandler(async(req, res) => {
    await firstThing()
    await secondThing()
}))

Also see https://thecodebarbarian.com/80-20-guide-to-express-error-handling

*/

/*
Here is how you can user CURL to test your application's NP User authentication end points.

curl -d "email=sample@example.com" -X POST http://localhost:3000/user/auth

Replace that email address with yours!

Create a json data file
data.json =

{ "email": "your email address", "authToken": "token from first curl request", "code": "code from your email"}

curl -d "@data.json" -H "Content-Type: application/json" -X POST http://localhost:3000/user/validate
 */
