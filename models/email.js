/**
 * Make the databse Schema email
 * @param {Staring} id  - unique id for the request
 * @param {String} to   - email Address  (required  -must include)
 * @param {String} content -content of email
 * @param {String} Subject -subject of email
 * @param {Date} time time and date requst reach to backend  (required  -must include)
 * @param {String} status email status SENT ,QUEUED,FAILED default null defined
 *
 *
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: null,
  },
  Subject: {
    type: String,
    default: null,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: null,
  },
});

/**
 * @function validateEmail - validate email, checks is is a email
 * @param {string} email - email address
 *
 *
 */
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
//create models
const Email = mongoose.model("emails", userSchema);

exports.Email = Email;
exports.validateEmail = validateEmail;
