import React, { useContext, useEffect, useMemo, useRef } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import { debounce } from 'lodash-es';
import { XTerm } from 'xterm-for-react';
import { PortalContext } from '../../../PortalContext';

export interface LogStreamProps {
  resourceId: string;
  reset?: number;
  line?: string;
}

const LogStream: React.SFC<LogStreamProps> = (props) => {
  const portalCommunicator = useContext(PortalContext);

  const { width, height } = useWindowSize();
  const terminalRef = useRef<XTerm>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    portalCommunicator.loadComplete();
  }, [portalCommunicator]);

  useEffect(() => {
    if (terminalRef.current?.terminal && props.reset) {
      terminalRef.current?.terminal.reset();
    }
  }, [props.reset]);

  useEffect(() => {
    if (terminalRef.current?.terminal && props.line) {
      terminalRef.current?.terminal.writeln(props.line);
    }
  }, [props.line]);

  const resizeHandler = (width: number, height: number) => {
    const columns = Math.floor(width / 9 - 0.5) - 2;
    const rows = Math.floor(height / 17 - 0.5);
    if (terminalRef.current?.terminal) {
      terminalRef.current?.terminal.resize(columns, rows);
      timeoutRef.current = undefined;
    }
  };

  const debouncedResizeHandler = useMemo(() => debounce(resizeHandler, 300, { trailing: true, leading: true }), []);

  useEffect(() => {
    return () => debouncedResizeHandler.cancel();
  }, []);

  useEffect(() => {
    debouncedResizeHandler(width, height);
  }, [width, height]);

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <XTerm
        options={{
          disableStdin: true,
        }}
        ref={terminalRef}
      />
    </div>
  );
};

export default LogStream;