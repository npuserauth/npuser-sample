
function sendErr (res, status, message, error) {
  if (error) {
    message += ' ' + error.message
  }
  console.log('npuser-sample-server: ERROR', status, message)
  res.status(status).send(message)
}

function sendResponse (res, payload) {
  res.status(200).send(payload)
}

module.exports = { sendErr, sendResponse }
