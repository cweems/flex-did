#!/usr/bin/env node

require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.ACCOUNT_SECRET);

// Find the SID for the Direct Inward Dial Studio flow
client.studio.flows.list({limit: 20})
    .then(flows => flows.forEach(f => {
        if(f.friendlyName === "Direct Inward Dial") {
            updatePhoneNumbers(f.sid);
            console.log(`Direct Inward Dial Flow SID: ${f.sid}`)
        }
    }));

// Update all phone numbers in account with the Studio Flow webhook URL.
function updatePhoneNumbers(flowSid) {
    console.log('\n=== Update Numbers ===\n')

    client.incomingPhoneNumbers
        .list()
        .then(incomingPhoneNumbers => {
            incomingPhoneNumbers.forEach(i => updateNumber(i.sid));
        })
        .catch(err => {
            console.log(err);
        });

    function updateNumber(numberSid) {
        client.incomingPhoneNumbers(numberSid)
            .update({
                voiceUrl: `https://webhooks.twilio.com/v1/Accounts/${process.env.ACCOUNT_SID}/Flows/${flowSid}`
            })
            .then(d => {
                console.log(`Successfully updated ${d.phoneNumber}.`);
            })
            .catch(err => {
                console.log(err);
            });
    }
}
