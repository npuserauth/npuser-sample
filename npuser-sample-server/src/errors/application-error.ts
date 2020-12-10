import logger from '../logger'
import { Request, Response, NextFunction } from 'express'

// error handling middleware
export const appErrorMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }
  let status = 500
  if ('status' in err) {
    // @ts-ignore
    status = err.status
  }
  if (err instanceof ApplicationError) {
    console.log('npuser-sample-server: maybe this will not be called??????')
    status = (err as ApplicationError).status
  }
  const errData = {
    message: err.message,
    status: status
  }
  logger.info(`npuser-sample-server: Error handler ${status} ${JSON.stringify(errData)}`)
  return res.status(status).json(errData)
}

export class ApplicationError extends Error {
  public message: string = 'ApplicationError';

  public status: number = 500;

  constructor (message?: string, status?: number) {
    super()
    if (message != null) {
      this.message = message
    }
    if (status != null) {
      this.status = status
    }
  }
}

export class BadRequest extends ApplicationError {
  constructor (message?: string) {
    super(message || 'Bad request', 400)
  }
}

export class InvalidRequest extends ApplicationError {
  constructor (message?: string) {
    super(message || 'Invalid request', 401)
  }
}

export class ExpiredRequest extends ApplicationError {
  constructor (message?: string) {
    super(message || 'Expired request', 403 /* forbidden, understood but will not accept */)
  }
}

export class InvalidClient extends ApplicationError {
  constructor (message?: string) {
    super(message || 'Invalid client', 404)
  }
}
