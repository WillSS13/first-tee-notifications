require('dotenv').config();

const client_id = process.env.SALESFORCE_CLIENT_ID;
const client_secret = process.env.SALESFORCE_CLIENT_SECRET;
const instance_url = process.env.SALESFORCE_INSTANCE_URL;
const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
const refresh_token = process.env.SALESFORCE_REFRESH_TOKEN;

var jsforce = require('jsforce');

var oauth2 = new jsforce.OAuth2({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: "/oauth2/auth"
});

var conn = new jsforce.Connection({
  oauth2: oauth2,
  instanceUrl: instance_url,
  accessToken: access_token,
  refreshToken: refresh_token,
  version: '52.0'
});

conn.on('refresh', function (accessToken, res) {
  console.log('Access Token Refreshed');
});

async function getCoachId(email, res) {
  const [localPart, domain] = email.split('@');

  let emailConditions = `(Email = '${email}' OR Secondary_Email__c = '${email}')`;

  if (domain.startsWith('thefirstteepittsburgh.')) {
    const modifiedDomain = domain.replace('thefirsttee', 'firsttee');
    const modifiedEmail = `${localPart}@${modifiedDomain}`;
    emailConditions = `(Email = '${email}' OR Secondary_Email__c = '${email}' OR Email = '${modifiedEmail}' OR Secondary_Email__c = '${modifiedEmail}')`;
  }

  conn.sobject("Contact")
    .select(`Id, Name, Email, Secondary_Email__c`)
    .where(`${emailConditions} AND Contact_Type__c = 'Coach'`)
    .execute(function (err, records) {
      if (err) { return console.error(err); }
      var participants = [];
      for (var record of records) {
        participants.push({
          id: record.Id,
        });
      }
      if (participants.length !== 0) {
        res.send(JSON.stringify(participants[0].id));
      } else {
        res.send(JSON.stringify("None"));
      }
    });
}

function sessionParticipants(id, res) {
  conn.sobject("Session_Registration__c")
    .select(`Id, Name, Status__c, Contact__c, Contact__r.Name, Contact__r.Primary_Contact_s_Email__c, Contact__r.Emergency_Contact_Number__c, Contact__r.Contact_Type__c, Contact__r.Participation_Status__c`)
    .where({
      Listing_Session__c: id,
      Status__c: 'Registered'
    })
    .execute(function (err, records) {
      if (err) { return console.error(err); }
      var participants = [];
      for (var record of records) {
        participants.push({
          id: record.Id,
          name: record.Name,
          contact_name: record.Contact__r.Name,
          type: record.Contact__r.Contact_Type__c,
          primary_contact_phone: record.Contact__r.Emergency_Contact_Number__c,
          primary_contact_email: record.Contact__r.Primary_Contact_s_Email__c,
          status: record.Status__c
        });
      }
      res.send(participants);
    });
}

function sessionCoaches(id, res) {
  conn.sobject("Coach_Assignment__c")
    .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c,Session_End_Date__c, Session_Start_Date__c, Listing_Session__r.Id, Listing_Session__r.Name, Coach__r.Email, Coach__r.MobilePhone, Coach__r.Contact_Type__c`)
    .execute(function (err, records) {
      if (err) { return console.error(err); }
      var coaches = [];
      for (var record of records) {
        if (record.Listing_Session__r.Id === id
          && record.Coach__c !== null) {
          coaches.push({
            id: record.Id,
            name: record.Coach__r.Name,
            email: record.Coach__r.Email,
            phone: record.Coach__r.MobilePhone
          });
        }
      }
      res.send(coaches);
    });
}

async function coachSessions(id, res) {
  try {
    const records = await conn.sobject("Coach_Assignment__c")
      .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c, Session_End_Date__c, Session_Start_Date__c, Listing_Session__r.Name`)
      .where({
        Coach__c: id,
        Session_End_Date__c: { $gte: jsforce.Date.TODAY }
      })
      .execute();

    var sessions = [];

    for (let record of records) {
      const listingRecords = await conn.sobject("Listing_Session__c")
        .select("Id, Total_Registrations__c")
        .where({ Id: record.Listing_Session__c })
        .execute();

      listingRecords.forEach(listingRecord => {
        if (listingRecord.Total_Registrations__c > 0) {
          sessions.push({
            id: listingRecord.Id,
            coach_assignment_name: record.Name,
            start_date: record.Session_Start_Date__c,
            end_date: record.Session_End_Date__c,
            session_name: record.Listing_Session__r.Name
          });
        }
      });
    }
    res.send(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving sessions.');
  }
}

async function getQuestionResponse(sessionId) {
  try {
    const record = await conn.sobject("Question_Response__c")
                              .select("Contact__r.Name, Contact_Response__c")
                              .where({
                                Session_Registration__c: sessionId,
                                Name: "Text Message Question | FT Pittsburgh"
                              })
                              .limit(1)
                              .execute();
    return record[0];
  } catch (err) {
    console.error(err);
  }
}

async function sessionNumbers(id, res, subject, msg, coach) {
  const records = await conn.sobject("Session_Registration__c")
                            .select(`Id, Contact__c, Contact__r.Name, Contact__r.Emergency_Contact_Number__c, Contact__r.Contact_Type__c`)
                            .where({
                              Listing_Session__c: id,
                              Status__c: 'Registered'
                            })
                            .execute();

      var participants = [];
      for (var record of records) {
        if (record.Id
         && record.Contact__r
         && record.Contact__r.Name
         && record.Contact__r.Emergency_Contact_Number__c
         && record.Contact__r.Contact_Type__c
         && record.Contact__r.Contact_Type__c == 'Participant') {
          const response = await getQuestionResponse(record.Id);
          // If the participant has a response to the text message question, use that number
          if (response) {
            var cleanNumber = response.Contact_Response__c.replace(/\D/g, '');
            if (cleanNumber.length > 10 && cleanNumber.startsWith('1')) {
              cleanNumber = cleanNumber.substring(1);
            }
            if ((/^\d{10}$/.test(cleanNumber))) {
              participants.push({
                id: record.Id,
                details: record.Contact__r.Name,
                phone: response.Contact_Response__c
              });
            }
          }
          // Otherwise, default to the emergency contact number
          else {
            participants.push({
              id: record.Id,
              details: record.Contact__r.Name,
              phone: record.Contact__r.Emergency_Contact_Number__c
            });
          }
        }
      }

      let unique = [];
      participants.forEach(element => {
        if (!unique.find(el => el.id === element.id && el.phone === element.phone)) {
          unique.push(element);
        }
      });

      unique = unique.filter(e => (e.phone !== null));

      let final = [];
      unique.forEach(element => {
        var digits = element.phone.replace(/\D/g, '');

        if (digits.length > 10 && digits.startsWith('1')) {
          digits = digits.substring(1);
        }

        if (digits.length === 10) {
          const formattedNumber = `+1${digits}`;

          final.push({
            id: element.id,
            phone: formattedNumber
          });

        }
      });

      if (final.length !== 0) {
        final.forEach(participant => {
          const user_id = `${id}_${participant.id}`
          res(user_id, participant.phone, subject, msg, coach);
        })
      }
    };

function coachNumbers(id, res, subject, msg, coachName) {
  conn.sobject("Coach_Assignment__c")
    .select(`Id, Coach__r.Name, Coach__r.MobilePhone`)
    .where({
      Listing_Session__c: id,
    })
    .execute(function (err, records) {
      if (err) { return console.error(err); }
      var numbers = [];
      for (var record of records) {
        if (record.Id 
         && record.Coach__r 
         && record.Coach__r.Name
         && record.Coach__r.MobilePhone) {
          numbers.push({
            id: record.Id,
            phone: record.Coach__r.MobilePhone
          });
        }
      }

      let unique = [];

      numbers.forEach(element => {
        if (!unique.some(e => e.id === element.id && e.phone === element.phone)) {
          unique.push(element);
        }
      });

      unique = unique.filter(e => (e.phone !== null));

      let final = [];
      unique.forEach(element => {
        var digits = element.phone.replace(/\D/g, '');

        if (digits.length > 10 && digits.startsWith('1')) {
          digits = digits.substring(1);
        }

        if (digits.length === 10) {
          const formattedNumber = `+1${digits}`;

          final.push({
            id: element.id,
            phone: formattedNumber
          });
        }
      });

      if (final.length !== 0) {
        final.forEach(coach => {
          var user_id = `${id}_${coach.id}`
          res(user_id, coach.phone, subject, msg, coachName);
        })
      }
    });
}

function sessionEmails(id, res, subject, msg, coach) {
  conn.sobject("Session_Registration__c")
    .select(`Id, Contact__r.Primary_Contact_s_Email__c, Contact__r.Emergency_Contact_Number__c, Contact__r.Contact_Type__c`)
    .where({
      Listing_Session__c: id,
      Status__c: 'Registered'
    })
    .execute(function (err, records) {
      if (err) { return console.error(err); }
      var participants = [];
      for (var record of records) {
        if (record.Id
         && record.Contact__r.Primary_Contact_s_Email__c
         && record.Contact__r.Contact_Type__c
         && record.Contact__r.Contact_Type__c == 'Participant') {
          // Case where the emergency contact number is empty
          if (!record.Contact__r.Emergency_Contact_Number__c) {
            participants.push({
              id: record.Id,
              email: record.Contact__r.Primary_Contact_s_Email__c
            });
          }
          // Case where the emergency contact number is not empty but it's invalid
          else {
            var stripped = record.Contact__r.Emergency_Contact_Number__c.replace(/\D/g, '');
            if (!(/^\d{10}$/.test(stripped))) {
              participants.push({
                id: record.Id,
                email: record.Contact__r.Primary_Contact_s_Email__c
              });
            }
          }
        }
      }

      let unique = [];

      participants.forEach(participant => {
        if (!unique.some(uniqueParticipant => uniqueParticipant.email === participant.email)) {
          unique.push(participant);
        }
      });
      
      if (unique.length !== 0) {
        unique.forEach(participant => {
          var user_id = `${id}_${participant.id}`
          res(user_id, participant.email, subject, msg, coach);
        })
      }
    });
}

function coachEmails(id, res, subject, msg, coachName) {
  conn.sobject("Coach_Assignment__c")
    .select(`Id, Coach__r.Email, Coach__r.MobilePhone, Coach__r.Name`)
    .where({
      Listing_Session__c: id,
    })
    .execute(function (err, records) {
      if (err) { return console.error(err); }
      var coaches = [];
      for (var record of records) {
        if (record.Id
         && record.Coach__r
         && record.Coach__r.Email
         && record.Coach__r.Name) {
          // Case where a coach's number is empty (push the sender in too)
          if (!record.Coach__r.MobilePhone || record.Coach__r.Name == coachName) {
            coaches.push({
              id: record.Id,
              email: record.Coach__r.Email
            });
          }
          // Case where a coach's number is not empty but it's invalid
          else {
            var stripped = record.Coach__r.MobilePhone.replace(/\D/g, '');
            if (!(/^\d{10}$/.test(stripped))) {
              coaches.push({
                id: record.Id,
                email: record.Coach__r.Email
              });
            }
          }
        }
      }

      let unique = [];

      coaches.forEach(emailObj => {
        if (!unique.some(uniqueObj => uniqueObj.email === emailObj.email)) {
          unique.push(emailObj);
        }
      });

      if (unique.length !== 0) {
        unique.forEach(coach => {
          var user_id = `${id}_${coach.id}`
          res(user_id, coach.email, subject, msg, coachName);
        })
      }
    });
}

module.exports = { getCoachId, sessionParticipants, sessionCoaches, coachSessions, sessionNumbers, sessionEmails, coachNumbers, coachEmails };