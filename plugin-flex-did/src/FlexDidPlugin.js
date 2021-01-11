import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import AgentNumber from './components/AgentNumber/AgentNumber';

const PLUGIN_NAME = 'FlexDidPlugin';

export default class FlexDidPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    flex.Actions.replaceAction("StartOutboundCall", (payload, original) => {
            let newPayload = payload

            if (manager.workerClient.attributes.hasOwnProperty('phone_number') &&
                manager.workerClient.attributes.phone_number !== "") {

              newPayload.callerId = manager.workerClient.attributes.phone_number
            }

            original(newPayload)
    });

    flex.MainHeader.Content.add(
      <AgentNumber
        key="navbar-agent-number"
        phoneNumber={manager.workerClient.attributes.phone_number}
      />, {
        sortOrder: -1, 
        align: "end"
      }
    );

    flex.OutboundDialerPanel.Content.add(
      <AgentNumber
        key="dialpad-agent-number"
        phoneNumber={manager.workerClient.attributes.phone_number}
      />
    );

  }
}
