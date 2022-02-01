// import typesUtils from 'src/utils/types'

class MailSettings {
  constructor (appData) {
    // const mailData = typesUtils.pObject(appData.Mail)
  }
}

let settings = null

export default {
  init (appData) {
    settings = new MailSettings(appData)
  },
}
