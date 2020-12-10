
const sqlite3 = require('sqlite3').verbose()

class Db {
  constructor (file) {
    this.db = new sqlite3.Database(file)
    this.createTable()
  }

  createTable () {
    const sql = `
      CREATE TABLE IF NOT EXISTS user (
          id integer PRIMARY KEY,
          email text UNIQUE,
          appData text
       )`
    return this.db.run(sql)
  }

  selectByEmail (email, callback) {
    return this.db.get(
      'SELECT * FROM user WHERE email = ?',
      [email], function (err, row) {
        callback(err, row)
      })
  }

  selectAll (callback) {
    return this.db.all('SELECT * FROM user', function (err, rows) {
      callback(err, rows)
    })
  }

  insert (email, callback) {
    return this.db.run(
      'INSERT INTO user (email) VALUES (?)',
      [email], (err) => {
        callback(err)
      })
  }

  update (userId, appData, callback) {
    return this.db.run(
      'UPDATE user SET appData = ? WHERE id = ?',
      [appData, userId], (err) => {
        callback(err)
      })
  }
}

module.exports = Db
