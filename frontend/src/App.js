import React, { useState, useEffect } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

class ShowAlert extends React.Component {
	render() {
		return (
			<SweetAlert success title='Good job!' onConfirm={this.onConfirm} onCancel={this.onCancel}>
				You clicked the button!
			</SweetAlert>
		);
	}
}

function App() {
	const [devs, setDevs] = useState([]);

	useEffect(() => {
		const loadDevs = async () => {
			const response = await api.get('/devs');

			setDevs(response.data.devs);
		};
		loadDevs();
	}, []);

	const _handleAddDev = async data => {
		const response = await api.post('/devs', data);

		if (response.data.isNewDev) setDevs([...devs, response.data.dev]);
	};

	return (
		<div id='app'>
			<aside>
				<strong>Register</strong>
				<DevForm onSubmit={_handleAddDev} />
			</aside>

			<main>
				<ul>
					{devs.map(dev => (
						<DevItem key={dev._id} dev={dev} />
					))}
				</ul>
			</main>
		</div>
	);
}

export default App;
