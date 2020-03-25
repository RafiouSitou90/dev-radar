import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import MainScreen from '../screens/Main/MainScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const MainStack = createStackNavigator(
	{
		Main: {
			screen: MainScreen,
			navigationOptions: {
				title: 'DevsApp'
			}
		},
		Profile: {
			screen: ProfileScreen,
			navigationOptions: {
				title: 'Profile'
			}
		}
	},
	{
		defaultNavigationOptions: {
			headerBackTitleVisible: false,
			headerTintColor: '#FFF',
			headerTitleStyle: {
				fontSize: 24,
				fontWeight: 'bold'
			},
			headerTitleAlign: 'center',
			headerStyle: {
				backgroundColor: '#1327a7'
			}
		}
	}
);

export default MainStack;
