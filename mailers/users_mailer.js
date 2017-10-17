import sendEmail from './mail_sender'
import {HOST_URL} from '../config/config'

module.exports = {
  sendRequestPasswordEmail: function(resetToken) {
    console.log('getting reset token')
    var locals = {
      recipients: resetToken.email,
      subject:    'Reset Password Request',
      resetUrl:   HOST_URL + '/reset-password?token=' + resetToken.resetToken
    }
    console.log('sending recover password email ')
    return sendEmail.send(locals, ['user_mailers', 'reset_password'])
  }
}
