/**
 * inside this define all the routes get post delete
 * using uuid for generate unique Id
 * All route are export to server.js
 *
 *
 */

const express = require("express");
const { Email, validateEmail } = require("../models/email");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

/**
 *
 *
 *
 *
 *
 *@Post method
 * First get the request assign that value to,content,Subject get @now time ane conver to GMT and store @nowUTC save that data sento mongodb databse
 * after get response from db and get now Sydney time and check it and send response according to sydney time
 * In saving data from mongodb database trigger function and scheduled trigger function run when incerting the data and every 1 minutes (show that function end of this module)

 * @param {Staring} id  - unique id for the request
 * @param {String} to   - email Address
 * @param {String} content -content of email
 * @param {String} Subject -subject of email
 * @param {Date} time time and date requst reach to backend
 * @param {Date} now -present Date and time(now time)
 * @param {Date} nowUTC -now UTC(GMT 0) Date and time
 * @param {'String'} reqid -unique id
 * @param {Object} email- email datails (to,subject,content,time)
 * @param {sydney} Sydney -now sydney time
 *
 */

router.post("/v1/emails", async (req, res) => {
  const { to, content, Subject } = req.body;
  let reqid = uuidv4();

  const now = new Date();
  const nowUTC = now.toUTCString();

  /**
   * check to,reqid and nowUTC avilable or not if no return falied status
   *
   *
   */
  if (!to || !reqid || !nowUTC) {
    return res.status(400).json({
      id: reqid,
      status: "FAILED",
    });
  }
  /**
   *  not valid email if no return falied status
   * @function validateEmail - validate Email
   * @returns {Boolean}
   *
   *
   */
  if (validateEmail(to) === false) {
    return res.status(400).json({
      id: reqid,
      status: "FAILED",
    });
  }

  const email = new Email({
    id: reqid,
    to,
    content,
    Subject,
    time: nowUTC,
  });

  /**
   * after save data from mongodb get response
   * after get now datetime and conver it in to sydney time if hours in sydney time between 8 and 17 give resposne as @status ="SENT" otherwisw @status  = "Queued"
   * if there is any error send status failed
   *
   */
  await email
    .save()
    .then((email) => {
      let sydney = new Date();
      sydney.setUTCHours(sydney.getUTCHours() + 11);

      /**
       * sydney.getUTCHours() <= 16 check that condition we check the hours  there for get 16 hours it checked till 16.59 last milisecond
       *
       *
       *
       */
      if (sydney.getUTCHours() >= 8 && sydney.getUTCHours() <= 16) {
        return res.status(200).json({
          id: reqid,
          status: "SENT",
        });
      } else {
        return res.status(202).json({
          id: reqid,
          status: "QUEUED",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        id: reqid,
        status: "FAILED",
      });
    });
});

/**
 *
 * get requesr params id
 * find email resperct to the id  and get response ans id and status is sent
 * give to status of email and id , resperct to the id
 *
 */
router.get("/v1/emails/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      id: reqid,
      status: "FAILED",
    });
  }

  await Email.findOne({ id: req.params.id })
    .select("-_id id status")
    .then((email) => {
      if (email !== null) {
        return res.status(400).json({
          id: email.id,
          status: email.status,
        });
      } else {
        return res.status(400).json({
          id: req.params.id,
          status: "FAILED",
        });
      }
    })
    .catch((error) => {
      return res.status(400).json({
        id: req.params.id,
        status: "FAILED",
      });
    });
});

/**
 *To delete a currently queued email,  send a DELETE request to the above
 *
 */

router.delete("/v1/emails/:id", async (req, res) => {
  /**
   * find the email from database useing id
   * and checked i status is "QUEUED" and delete it and send @deleted ==> @suceeced or @Failed  response
   * if there is any error send Delete  failed
   */
  await Email.findOne({ id: req.params.id })

    .then((email) => {
      if (email !== null && email.status === "QUEUED") {
        email.remove().then((email) => {
          res.status(200).json({
            id: email.id,
            deleted: "Succeeded",
          });
        });
      } else {
        return res.status(400).json({
          id: req.params.id,
          deleted: "FAILED",
        });
      }
    })
    .catch((error) => {
      return res.status(400).json({
        id: req.params.id,
        deleted: "FAILED",
      });
    });
});

module.exports = router;

/**
 * 
 * 
 * 
 * 
 * mongodb trigger
 * 
 * 
 * 
 * first make realm name email and after create Database trigger and Sheduled trigger 
 * 
 @Databasetrigger -trigger Name @setStatusIncert
 * This trigger run when data incert to Database this trigger has functions 
 * 

 * 
 * @function addStatusIncert  -get change event that data pass to the @addStatus function (call function)
 * 
 * 
 * exports = function(changeEvent) {
  
  
 const {fullDocument}=changeEvent;
 
 
 return context.functions.execute('addStatus',fullDocument)
};
 * 
 * @function addStatus -add status to the document  
 * get the sydney time, if hours sydneytime between 8 and 17  save @param status="SENT" otherwisw @param status "QUEUED"
 * if there is any error send status failed
 * @param {Date} sydney  now sydnetime
 * @param {Object} email  email details want to store in database
 * 
 * 
 *  
 *  exports = function(email){
   
   const emails=context.services.get("mongodb-atlas").db('emailstore').collection("emails")
    
      let sydney = new Date(email["time"]);
      sydney.setUTCHours(sydney.getUTCHours() + 11);
   

      if (sydney.getUTCHours() >= 8 && sydney.getUTCHours() <= 16) {
    return emails.updateOne({id:email["id"]},{$set:{status:"SENT"}})

      } else {
      return emails.updateOne({id:email["id"]},{$set:{status:"QUEUED"}})
      
      }
      
 
      
}
 * @Schedledtrigger triggerName @CheckAndUpdateStatus -checked the status and update it
 * This trigger run every 1m  ,get all email ==> @param status="QUEUED" check the now sydney time and UPDATEas  @status ="Sent"
 * 
 * 
 * 
 * @function mainfunction -get all email ==> @param status="QUEUED" and call the @function mainfunctionUpdateStatus
 * 
 * exports = function(){
 
    var emails = context.services.get("mongodb-atlas").db("emailstore").collection("emails");

  return emails.find({status:"QUEUED"})
  .toArray()
  .then(EmailList=>{
  EmailList.forEach(email=>{
   context.functions.execute("mainfunctionUpdateStatus",email)
  })
  })
};

 *
 * @function mainfunctionUpdateStatus -get now Sydney time and update all @param status="QUEUED" to @param status="QUEUED" respect to now time
 *  @param {Date} sydney  now sydnetime
 * if sydney time hours between 8 and 17 update all @param status="QUEUED" to @param status="QUEUED" respect to now time Otherwise not @status update
 * 
 * 
 * exports = function(email){
   
   const emails=context.services.get("mongodb-atlas").db('emailstore').collection("emails")
    
      let sydney = new Date();
      sydney.setUTCHours(sydney.getUTCHours() + 11);
   

      if (sydney.getUTCHours() >= 8 && sydney.getUTCHours() <= 16) {
    return emails.updateOne({id:email["id"]},{$set:{status:"SENT"}})

      }
 
};
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
