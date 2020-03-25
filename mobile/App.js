import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { StatusBar, YellowBox } from 'react-native';

import DrawerNavigator from './src/routes/DrawerNavigator';
import MainStack from './src/routes/MainStack';

YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default class App extends React.Component {
	render() {
		return (
			<>
				<StatusBar barStyle='light-content' backgroundColor='#1327a7' />
				<AppContainer />
			</>
		);
	}
}

const AppContainer = createAppContainer(
	createSwitchNavigator(
		{
			Main: DrawerNavigator
		},
		{
			initialRouteName: 'Main'
		}
	)
);
