import logo from './logo.svg';
import './App.css';
import MainGraph from './MainGraph';
import { useEffect, setState } from 'react';
import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import GraphContainer from './GraphContainer';

function App() {

  return (
    <div className="App">
      <GraphContainer/>
    </div>
  );
}

export default App;
