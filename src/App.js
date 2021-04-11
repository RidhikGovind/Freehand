import React from 'react';
import './styles/styles.css';

import Canvas from './components/Canvas';
import ToolBar from './components/ToolBar';

function App() {
	return (
		<div className='App'>
			<ToolBar />
			<Canvas />
		</div>
	);
}

export default App;
