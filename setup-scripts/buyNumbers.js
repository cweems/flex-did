#!/usr/bin/env node

require("dotenv").config();

const readline = require("readline");
const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.ACCOUNT_SECRET
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    console.log('\n=== Buy Numbers ===\n')
    rl.question("What is the 3-digit area code where you would like to buy numbers? ", (areaCode) => {
        rl.question("How many numbers would you like to purchase? Note: trial accounts are limited to one number. ", (quantity) => {
            getNumbers(areaCode, parseInt(quantity, 10))
                .then(() => rl.close())
        });
    });
    
    rl.on("close", () => {
        process.exit(0);
    });
}

function getNumbers(areaCode, quantity) {
    console.log(`Buying ${quantity} numbers in the ${areaCode} area code.`);
    
    return new Promise((resolve, reject) => {
        client
            .availablePhoneNumbers("US")
            .local.list({ areaCode: areaCode, limit: quantity })
            .then((local) => {
    
                let promises = [];
                local.forEach((l) => {
                    promises.push(buyNumber(l.phoneNumber));
                })

                Promise.all(promises).then(() => {
                    resolve();
                })
                .catch(err => reject(err))
            }
            )
            .catch((err) => console.log(err));
    });

}

function buyNumber(number) {
    return new Promise((resolve, reject) => {
        client.incomingPhoneNumbers
            .create({ phoneNumber: number })
            .then((incoming_phone_number) => {
                console.log(`Successfully purchased ${incoming_phone_number.phoneNumber}`)
                resolve();
            })
            .catch((err) => reject(err));
    })
}

run();
