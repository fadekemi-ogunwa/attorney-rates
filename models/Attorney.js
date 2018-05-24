const mongoose = require('mongoose');

const AttorneySchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true
  },
  title: {
    type: String, 
    enum: ['Associate', 'Partner/Counsel', 'Paralegal', 'Law Clerk', 'Tax Attorney'],
    required: true,
  },
  hourlyRate: { type: Number, required: true},
  rates: [{
    date: String,
    hourlyRate: Number,
    client: String,
    projectName: String
  }],
  generalRates: [{
    previousDate: String,
    previousRate: Number
  }],  
  // attorneyId: String,
  effectiveDate:{
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  }
}, {timestamps: true});


const Attorney = mongoose.model('Attorney', AttorneySchema);

module.exports = Attorney;