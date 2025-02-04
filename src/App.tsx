import { useState, useEffect } from 'react';
import { createConnectTransport } from "@bufbuild/connect-web";
import { createPromiseClient } from "@bufbuild/connect";
import { LogService } from './generated/logging/log_service_connectweb';
import {
  LogMessage,
  SubscribeRequest
} from './generated/logging/log_service_pb';

const transport = createConnectTransport({
  baseUrl: "http://localhost:50051",
  useBinaryFormat: true,
});

interface Log {
  timestamp: string;
  level: string;
  message: string;
  target: string;
  threadId: string;
  file: string;
  line: string;
}

function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const client = createPromiseClient(LogService, transport);

  useEffect(() => {
    let abortController = new AbortController();

    async function startStream() {
      try {
        const request = { clientId: "web-client" } as SubscribeRequest;
        const stream = await client.subscribeToLogs(request, {
          signal: abortController.signal,
        }) as AsyncIterable<LogMessage>;;

        for await (const message of stream) {
          const log: Log = {
            timestamp: message.timestamp,
            level: message.level,
            message: message.message,
            target: message.target,
            threadId: message.threadId,
            file: message.file,
            line: message.line
          };
          setLogs(prev => [...prev, log]);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Stream aborted');
        } else {
          console.error('Stream error:', error);
        }
      }
    }

    startStream();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Log Viewer</h1>
      <div style={{
        maxHeight: '500px',
        overflow: 'auto',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '5px'
      }}>
        {logs.map((log, index) => (
          <div key={index} style={{
            marginBottom: '5px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            <span>[{new Date(log.timestamp).toLocaleTimeString()}] </span>
            <span style={{
              color: log.level === 'ERROR' ? '#dc3545' :
                log.level === 'WARN' ? '#ffc107' :
                  '#28a745'
            }}>
              {log.level}
            </span>
            <span> - {log.message}</span>
            <span style={{ color: '#666', fontSize: '0.9em' }}>
              {` (${log.file}:${log.line})`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
