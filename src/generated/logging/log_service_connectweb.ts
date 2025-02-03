// @generated by protoc-gen-connect-web v0.8.6 with parameter "target=ts"
// @generated from file logging/log_service.proto (package logging, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { LogMessage, SubscribeRequest } from "./log_service_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service logging.LogService
 */
export const LogService = {
  typeName: "logging.LogService",
  methods: {
    /**
     * Change to server streaming
     *
     * @generated from rpc logging.LogService.SubscribeToLogs
     */
    subscribeToLogs: {
      name: "SubscribeToLogs",
      I: SubscribeRequest,
      O: LogMessage,
      kind: MethodKind.ServerStreaming,
    },
  }
} as const;

