import express, { Router, Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { ApiProvider } from './server'
import { InvalidRequest } from './errors/application-error'

const { sendResponse } = require('./response-handlers')

// DATABASE
const DB = require('./db')
// lazy load/create db
let database: any
// name your sample application database
const DB_NAME = 'sqlitedb'
function getDb () {
  if (!database) { database = new DB(DB_NAME) }
  return database
}

// AUTH_TOKEN_SECRET is the key this app uses to sign its JWTs
const AUTH_TOKEN_SECRET = process.env.MY_APP_TOKEN_SECRET
if (!AUTH_TOKEN_SECRET) {
  throw new Error('Fatal setup error. Need app token secret to be defined in the environment')
} else {
  if (process.env.NODE_ENV === 'development') { console.log('AUTH_TOKEN_SECRET', AUTH_TOKEN_SECRET) }
}

/*
Each application that uses npuser is unconstrained as to how they want to manage the user experience. In this sample
we show just one approach.  We'll pass a JWT back to our client.  This JWT will be signed by this application
and can be used to verify the bearer is authenticate.

The expire times, etc, are up to each application.
 */
const EXPIRES = 60 * 60 * 24 // * 1 day

// LogInBody is the structure your client can use from your server
type LogInBody = { auth: boolean; newUser: boolean; token: string; user: object }

// JwtBody is the structure this server uses for its JWTs. In this sample it is enough to have the user id.
type JwtBody = { id: number }

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body.isAuthed = false
  if (req && req.headers.authorization) {
    const token = req.headers.authorization
    const jwtString = token.replace('Bearer ', '')
    try {
      // prepare for the next request handler
      req.body.isAuthed = true
      req.body.jwtBody = jwt.verify(jwtString, AUTH_TOKEN_SECRET) as JwtBody
      return next()
    } catch (err) {
      // could provide more nuanced error responses...
      // if (err instanceof TokenExpiredError) {
      // } else if (err instanceof JsonWebTokenError) {
      // } else {
      // }
      return next(new InvalidRequest())
    }
  }
  return next(new InvalidRequest())
}

type User = { id: number, email: string, appData: string }

export function applicationUserLoginHandler (req: Request, res: Response, next: NextFunction) {
  const { email } = req.body
  const loginResponse = (user: any, newUser: boolean, res: Response) => {
    // send a response back to the client with this server's JWT and whatever else the application might need.
    const jwtBody: JwtBody = { id: user.id }
    const token = jwt.sign(jwtBody, AUTH_TOKEN_SECRET, { expiresIn: EXPIRES })
    const responsePayload: LogInBody = { auth: true, newUser: newUser, token: token, user: user }
    sendResponse(res, responsePayload)
  }
  const db = getDb()
  db.selectByEmail(email, (err: Error, user: User) => {
    if (err) return next(err)
    if (user) {
      loginResponse(user, false, res)
    } else {
      db.insert([email], (err: Error) => {
        if (err) return next(err)
        db.selectByEmail(email, (err: Error, user: any) => {
          if (err) return next(err)
          return loginResponse(user, true, res)
        })
      })
    }
  })
}

function getUserDataHandler (req: Request, res: Response, next: NextFunction) {
  // Can assume request is authenticated and jwt is well formed
  const jwt = req.body.jwtBody
  const { id } = jwt
  const db = getDb()
  db.selectById(id, (err: Error, rows: any) => {
    if (err) return next(err)
    sendResponse(res, rows)
  })
}

function updateUserDataHandler (req: Request, res: Response, next: NextFunction) {
  // Can assume request is authenticated and jwt is well formed
  const jwt = req.body.jwtBody
  const { id } = jwt
  console.log('update ', req.body)
  const appData = req.body.userText
  const db = getDb()
  db.updateAppData(id, appData, (err: Error) => {
    if (err) return next(err)
    db.selectById(id, (err: Error, rows: any) => {
      if (err) return next(err)
      sendResponse(res, rows)
    })
  })
}

// TODO the following needs to be put behind some Admin authentication
function listAllUsersHandler (req: Request, res: Response, next: NextFunction) {
  // Can assume request is authenticated
  const db = getDb()
  db.selectAll((err: Error, rows: any) => {
    if (err) return next(err)
    sendResponse(res, rows)
  })
}

const SAMPLE_SERVER_PATH = '/app'

const route = () => {
  const router = Router()

  // TODO comment out the fake login route
  // fake login post route allows for development to bypass npuser
  router.post('/fake', asyncHandler(applicationUserLoginHandler))

  // Sample application end points to get and set some user data
  router.get('/data', authMiddleware, asyncHandler(getUserDataHandler))
  router.post('/update', authMiddleware, asyncHandler(updateUserDataHandler))

  // ---------------- ADMIN
  // TODO put the following behind some Admin user access authentication
  router.get('/all', authMiddleware, asyncHandler(listAllUsersHandler))
  return router
}

export class SampleApp implements ApiProvider {
  addRoute (middleWare: [express.RequestHandler], app: express.Express): void {
    app.use(SAMPLE_SERVER_PATH, middleWare, route())
  }
}

// const handler = async (req: Request, res: Response, next: NextFunction) => {
//   res.status(200).send('Sample app sample handler\n')
// }
//
// const handlerA = async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.body.isAuthed) {
//     return next(new InvalidRequest())
//   }
//   const payload = { bdy: req.body, qHdrs: req.headers }
//   res.status(200).send(payload)
// }
