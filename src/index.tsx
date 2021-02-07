import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path';
import axios from 'axios';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const ref = useRef<any>();

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });
    setCode(result.outputFiles[0].text);
  }

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
  }

  useEffect(() => {
    startService();
  }, []);

  return <div>
    <textarea cols={100} rows={10} onChange={(e) => setInput(e.target.value)}></textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>;
}

export default App;

ReactDOM.render(<App />, document.querySelector('#root'));
