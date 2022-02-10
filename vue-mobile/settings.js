// import types from 'src/utils/types'

class MailSettings {
  constructor (appData) {
    // const mailData = types.pObject(appData.Mail)
  }
}

let settings = null

export default {
  init (appData) {
    settings = new MailSettings(appData)
  },
}
