var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var Q = require('q')
var path = require('path')
var templateDir = path.join(__dirname, '../templates')

var EmailTemplate = require('email-templates').EmailTemplate

var transport = nodemailer.createTransport(smtpTransport({
  host: "smtp.sparkpostmail.com",
  port: "587",
  auth: {
    user: 'SMTP_Injection',
    pass: '57b45ba1d0b4a26737901f08db0fe07392d66165'
  },

}));

var sendMail = function sendMail(msg) {
  return new Promise((resolve, reject) => {
    return transport.sendMail(msg, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};



exports.send = function (locals, template) {
  console.log('Sending email, locals')
  console.log(locals)

  if (!template) {
    return sendMail({
        from: 'LaFemme <noreply@lafemme.com.co>',
        to: locals.recipients,
        subject: locals.subject,
        cc: locals.cc,
        bcc: locals.bcc,
        text: locals.body,
      })
      .catch(function (err) {
        console.log(err)
        throw new Error('Error sending out email', err)
      })
  }

  var template = new EmailTemplate(path.join(templateDir, template.join('/')))

  return template.render(locals)
    .then(function (results) {
      return sendMail({
        from: 'LaFemme <noreply@lafemme.com.co>',
        to: locals.recipients,
        subject: locals.subject,
        bcc: locals.bcc,
        html: results.html,
      })
    })
    .then(function (info) {
      return info
    })
    .catch(function (err) {
      console.log(err)
      throw new Error('Error sending out email', err)
    })
};