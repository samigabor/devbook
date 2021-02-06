import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import * as esbuild from 'esbuild-wasm';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = () => {
    setCode(input);
  }

  const startService = async () => {
    const service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    console.log(service);
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
