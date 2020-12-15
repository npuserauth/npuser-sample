import express, { Express } from 'express'
import { appErrorMiddleWare } from './errors/application-error'
import { allowCrossDomain } from './cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'
import { SampleNpUserAuthorizer } from './np'
import { SampleApp } from './app'

if (!process.env.NODE_ENV) {
  console.log(process.env)
  throw new Error('Fatal setup error. Need process.env.NODE_ENV needs to be defined')
}

const serverPort = process.env.PORT || 3000

export interface ApiProvider {
  addRoute (middleWare: express.RequestHandler[], app: Express): void
}

const BANNER = `npuser-sample-server: listening on port ${serverPort}`

function createApp (middleWare: express.RequestHandler[], apiProviders: ApiProvider[]) {
  const eApp = express()
  eApp.use(helmet())
  eApp.use(compression())
  eApp.use(bodyParser.urlencoded({ extended: true }))
  eApp.use(bodyParser.json({ limit: '5mb', type: 'application/json' }))
  // eApp.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))
  apiProviders.forEach((provider) => {
    provider.addRoute(middleWare, eApp)
  })
  // eApp.get('/', middleWare, (req: Request, res: Response) => {
  //   console.log(`npuser-sample-server: get / call ip: ${req.ip}`)
  //   res.status(200).send({ message: BANNER })
  // })
  // add error handling middleware last.
  // See https://thecodebarbarian.com/80-20-guide-to-express-error-handling
  eApp.use(appErrorMiddleWare)
  eApp.get('*', function (req, res) {
    console.log('404ing')
    res.status(404).send('Page not found')
  })
  return eApp
}

const middleWare = [allowCrossDomain]

const apiUser = new SampleNpUserAuthorizer()
const appSample = new SampleApp()

const apiProviders: ApiProvider[] = [apiUser, appSample]

const app = createApp(middleWare, apiProviders)

app.listen(serverPort, async () => {
  console.log(BANNER)
})
