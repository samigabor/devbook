import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path.plugin';
import { fetchPlugin } from './plugins/fetch.plugin';

const App = () => {
  const [input, setInput] = useState('');
  const ref = useRef<any>();
  const iframeRef = useRef<any>();

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });
    iframeRef.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
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

  const html = `
    <html lang="en">
      <head>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data)
            } catch (err) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error:</h4>' + err + '</div>'
              console.error(err);
            }
          })
        </script>
      </body>
    </html>
  `;

  return <div>
    <textarea cols={100} rows={10} onChange={(e) => setInput(e.target.value)}></textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <iframe sandbox="allow-scripts" srcDoc={html} ref={iframeRef} height="200" width="720" title="preview"></iframe>
  </div>;
}

export default App;

ReactDOM.render(<App />, document.querySelector('#root'));
