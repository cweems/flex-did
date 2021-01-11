#!/usr/bin/env node

const { waitForDebugger } = require('inspector');

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
                })

                reject('Could not find Flex Task Assignment workspace. Did you change the friendly name?')
            })
            .catch(err => reject(err));
    });
}

function getDidWorkflowSid(workspaceSid) {
    return new Promise((resolve, reject) => {
        client.taskrouter.workspaces(workspaceSid)
            .workflows
            .list({limit: 20})
            .then(workflows => {
                workflows.forEach(wf => {
                    if (wf.friendlyName === "Direct Inward Dial") {
                        console.log(`Found Direct Inward Dial Workflow ${wf.sid}.`)
                        resolve(wf.sid);
                        return;
                    }
                });

                reject('Could not find Direct Inward Dial workflow. You can create one by running workflow-setup');
                return;
            })
            .catch(err => reject(err));
    })
}

function getVoiceTaskChannelSid(workspaceSid) {
    return new Promise((resolve, reject) => {
        client.taskrouter.workspaces(workspaceSid)
            .taskChannels
            .list({limit: 20})
            .then(taskChannels => {
                taskChannels.forEach(tc => {
                    if (tc.friendlyName === "Voice") {
                        console.log(`Found Voice TaskChannel Sid ${tc.sid}.`)
                        resolve(tc.sid);
                        return;
                    }
                });

                reject('Could not find Voice TaskChannel. Did you change the TaskChannel friendly name?')
            })
            .catch(err => reject(err));
    })
}

function createDidStudioFlow(didWorkflowSid, voiceTaskChannelSid) {
    console.log(
        "Creating the Studio Flow."
    );

    const studioFlowDef = {
        "description": "Direct Inbound",
        "states": [
            {
            "name": "Trigger",
            "type": "trigger",
            "transitions": [
                {
                "event": "incomingMessage"
                },
                {
                "next": "Welcome",
                "event": "incomingCall"
                },
                {
                "event": "incomingRequest"
                }
            ],
            "properties": {
                "offset": {
                "x": 40,
                "y": -120
                }
            }
            },
            {
            "name": "ConnectToAgentByDID",
            "type": "send-to-flex",
            "transitions": [
                {
                "event": "callComplete"
                },
                {
                "event": "failedToEnqueue"
                },
                {
                "event": "callFailure"
                }
            ],
            "properties": {
                "offset": {
                "x": 70,
                "y": 330
                },
                "workflow": didWorkflowSid,
                "channel": voiceTaskChannelSid,
                "attributes": "{\n\"name\": \"{{trigger.call.From}}\" ,\n\"phone_number\": \"{{trigger.call.To}}\",\n\"type\": \"inbound\", \n\"direction\": \"inbound\"}",
            }
            },
            {
            "name": "Welcome",
            "type": "say-play",
            "transitions": [
                {
                "next": "ConnectToAgentByDID",
                "event": "audioComplete"
                }
            ],
            "properties": {
                "voice": "Polly.Joanna",
                "offset": {
                "x": 60,
                "y": 70
                },
                "loop": 1,
                "say": "    ",
                "language": "en-US"
            }
            }
        ],
        "initial_state": "Trigger",
        "flags": {
            "allow_concurrent_calls": true
        }
    }

    client.studio.flows
                .create({
                    commitMessage: 'First draft',
                    friendlyName: 'Direct Inward Dial',
                    status: 'published',
                    definition: studioFlowDef
                })
                .then(flow => console.log(`Done! Successfully created ${flow.sid}`))
                .catch(err => console.log(err.details.errors));
}


async function run() {
    console.log('\n=== Studio Setup ===\n')

    const workspaceSid = await getWorkspaceSid();
    const didWorkflowSid = await getDidWorkflowSid(workspaceSid);
    const voiceTaskChannelSid = await getVoiceTaskChannelSid(workspaceSid);

    createDidStudioFlow(didWorkflowSid, voiceTaskChannelSid);
}

run();