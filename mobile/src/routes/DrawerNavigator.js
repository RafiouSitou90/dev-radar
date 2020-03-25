import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { MaterialIcons, Feather } from '@expo/vector-icons';

import MainStack from './MainStack';
import DrawerContentComponent from '../components/DrawerContent/DrawerContentComponent';

const DrawerNavigator = createDrawerNavigator(
	{
		Home: {
			screen: MainStack,
			navigationOptions: {
				drawerIcon: ({ tintColor }) => <MaterialIcons name='home' size={20} color={tintColor} />
			}
		}
		// SignOut: {
		// 	navigationOptions: {
		// 		drawerIcon: ({ tintColor }) => <Feather name='log-out' size={20} color={tintColor} />
		// 	}
		// }
	},
	{
		contentComponent: props => <DrawerContentComponent {...props} />,
		drawerWidth: Dimensions.get('window').width * 0.85,
		hideStatusBar: true,
		contentOptions: {
			activeBackgroundColor: 'rgba(20, 20, 207, 0.1)',
			activeTintColor: '#3C40C6',
			itemsContainerStyle: {
				marginTop: 16,
				marginHorizontal: 5
			},
			itemStyle: {
				borderRadius: 4
			},
			labelStyle: {
				fontSize: 16
			}
		}
		// initialRouteName: 'Home'
	}
);

export default DrawerNavigator;
