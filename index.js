require('dotenv').config()
const express = require("express")
const cors = require('cors')
const nodemailer = require("nodemailer")
const bodyParser = require('body-parser')
const api = express()

api.use(cors())
api.use(bodyParser.json())
const jsonBodyParser = bodyParser.json()

const contactAddress = "d7@hotmail.es"
const mailer = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
})

api.post('/contact', jsonBodyParser, async (req, res) => {
  const { body: { name, email, message } } = req
  try {
    mailer.sendMail(
      {
        from: req.body.from,
        to: [contactAddress],
        subject: `Message in Porfolio from ${name}`,
        html:  `<h3>Hello Diana,</h3>
        <p>Someone sent you a message: <p>
        <p><b>Name: </b>${name}</p>
        <p><b>Email: </b>${email}</p>
        <p><b>Message: </b>${message}</p>
        <p>Be kind and reply the message!<p>
        `,
      },
      function(err, info) {
        if (err) return res.status(500).send(err)
        res.json({ success: true })
      }
    )
  } catch (error) {
      const { message } = error
      res.status(500).json(message)
    }
})

api.listen(3000)
