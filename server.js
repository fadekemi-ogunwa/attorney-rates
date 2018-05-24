const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config('../.env');

mongoose.connect(process.env.DATABASEDETAILS);
mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const Attorney = require('./models/Attorney');

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/attorney', (req, res, next) => {
  const { firstName, lastName } = req.body

  if (!firstName && !lastName) {
    return res.status(422).json({ message: 'first name && last name required' });
  }

  Attorney.findOne({
    'firstName': firstName.toLowerCase(),
    'lastName': lastName.toLowerCase()
  }, (err, attorney) => {

    // In case of any error, return using the done method
    if (err) {
      console.log('Error in SignUp: ' + err);
      return next(err);
    } else if (attorney) {
      // already exists
      console.log('User already exists with firstName and lastName', req.body);

      if (attorney.hourlyRate != req.body.hourlyRate) {
        // if updating rate for general
        if (!req.body.matters) {
          req.body.generalRates = attorney.generalRates && attorney.generalRates.concat({
            previousDate: attorney.effectiveDate,
            previousRate: attorney.hourlyRate
          })
        }
      }

      // if updating rate for client
      if (req.body.matters) {
          req.body.rates = attorney.rates && attorney.rates.concat({
            date: req.body.effectiveDate,
            hourlyRate: req.body.hourlyRate,
            client: req.body.clientName,
            projectName: req.body.matters
          });
          req.body.hourlyRate = attorney.hourlyRate
          req.body.effectiveDate = attorney.effectiveDate
      }

       Attorney.updateOne({
          'firstName': firstName.toLowerCase(),
          'lastName': lastName.toLowerCase()
        }, req.body, (err, resp) => {
          if (resp.nModified == 1) {
            return res.json({ message: `${firstName} ${lastName}'s information updated successfully` });
            console.log(req.body);
          }
        });
    } else {
      const newAttorney = new Attorney(req.body);

      newAttorney.save((err) => {
        if (err) {
          console.log('Error in Saving attorney: ' + err);
          return next(err);
        }

        console.log('Attorney Registration succesful');
        res.json({ message: 'attorney saved' })
      });
    }
  });
})


app.listen(3000, function () {
  console.log('listening on 3000')
})