#!/usr/bin/env node

require('dotenv').config();

const client = require("twilio")(
    process.env.ACCOUNT_SID,
    process.env.ACCOUNT_SECRET
);

function getWorkspaceSid() {
    console.log("Getting the Flex TaskRouter Workspace SID.")
    return new Promise((resolve, reject) => {
        client.taskrouter.workspaces
            .list({limit: 20})
            .then(workspaces => {
                workspaces.forEach(w => {
                    if (w.friendlyName === "Flex Task Assignment") {
                        console.log(`Found Workspace ${w.sid}.`)
                        resolve(w.sid);
                        return;
                    }
                });

                reject('Could not find Flex Task Assignment workspace. Did you change the friendly name?')
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getEveryoneTaskQueueSid(workspaceSid) {
    console.log("Getting the 'Everyone' TaskQueue SID.")
    return new Promise((resolve, reject) => {
        client.taskrouter.workspaces(workspaceSid)
            .taskQueues
            .list({limit: 20})
            .then(taskQueues => {
                taskQueues.forEach(t => {
                    if (t.friendlyName === "Everyone") {
                        console.log(`Found Everyone TaskQueue ${t.sid}.`)
                        resolve(t.sid);
                    }
                })
                reject('Could not find the "Everyone" TaskQueue. Did you change the friendly name?')
            })
            .catch(err => {
                reject(err);
            });
    });
}

function createDidWorkflow(workSpaceSid, everyoneTaskQueueSid) {
    console.log("Creating the DID workflow.");

    const workflowConfig = {
        task_routing: {
            filters: [
                {
                    filter_friendly_name: "Match By Worker Phone Number",
                    expression: "1==1",
                    targets: [
                        {
                            queue: everyoneTaskQueueSid,
                            expression: "task.phone_number CONTAINS worker.phone_number",
                            timeout: 60,
                            skip_if: "1==1"
                        },
                        {
                            queue: everyoneTaskQueueSid
                        }
                    ]
                }
            ],
            default_filter: {
                queue: everyoneTaskQueueSid
            }
        }
    }

    client.taskrouter
        .workspaces(workSpaceSid)
        .workflows
        .create({
            friendlyName: 'Direct Inward Dial',
            configuration: JSON.stringify(workflowConfig)
        })
        .then((workflow) => console.log(`Done! Successfully created the Direct Inward Dial workflow: ${workflow.sid}`))
        .catch((err) => console.log(err));
}

async function run() {
    console.log('\n=== TaskRouter Setup ===\n')

    let workspaceSid = await getWorkspaceSid();
    let everyoneTaskQueueSid = await getEveryoneTaskQueueSid(workspaceSid);

    createDidWorkflow(workspaceSid, everyoneTaskQueueSid);
}

run();