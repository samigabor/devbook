import ReactDOM from 'react-dom';
import { useState } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = () => {
    setCode(input);
  }

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
