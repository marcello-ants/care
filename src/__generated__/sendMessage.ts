/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SendMessageInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: sendMessage
// ====================================================

export interface sendMessage_sendMessage_SendMessageSuccess {
  __typename: "SendMessageSuccess";
  /**
   * Dummy field
   */
  dummy: string | null;
}

export interface sendMessage_sendMessage_SendMessageError {
  __typename: "SendMessageError";
  /**
   * List of recipientId's who did not receive the message
   */
  failedRecipientIds: string[] | null;
}

export type sendMessage_sendMessage = sendMessage_sendMessage_SendMessageSuccess | sendMessage_sendMessage_SendMessageError;

export interface sendMessage {
  /**
   * Sends a message to the specified set of recipientId's
   */
  sendMessage: sendMessage_sendMessage;
}

export interface sendMessageVariables {
  input: SendMessageInput;
}
