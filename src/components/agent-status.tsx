import React from 'react';
import { CircularProgress } from '@material-ui/core';

const AgentStatus = ({ isStreaming, progress }) => {
  return (
    <div>
      <h2>Agent Status</h2>
      {isStreaming ? (
        <div>
          <CircularProgress variant="determinate" value={progress} />
          <p>Streaming... {progress}%</p>
        </div>
      ) : (
        <p>Not Streaming</p>
      )}
    </div>
  );
};

export default AgentStatus;