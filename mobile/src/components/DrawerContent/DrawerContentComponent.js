import React from 'react';
import { StyleSheet, ImageBackground, ScrollView, Image, Text, View } from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';

const bg_menu = require('../../../assets/bg_image.png');
const profile_image = require('../../../assets/profile-img.jpg');

export default SideMenuComponent = props => (
	<View style={styles.container}>
		<ScrollView>
			<ImageBackground source={bg_menu} style={styles.img_background}>
				<Image source={profile_image} style={styles.profile} />
				<Text style={styles.name}>Rafiou SITOU</Text>
				<Text style={styles.email}>RafiouSitou90@gmail.com</Text>
			</ImageBackground>
			<View style={styles.container}>
				<DrawerNavigatorItems {...props} />
			</View>
		</ScrollView>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	img_background: {
		width: undefined,
		padding: 16,
		paddingTop: 40
	},
	profile: {
		width: 60,
		height: 60,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: '#FFF'
	},
	name: {
		color: '#FFF',
		fontSize: 14,
		marginTop: 10,
		fontWeight: '800',
		marginVertical: 8
	},
	email: {
		color: 'lightgray',
		fontSize: 14,
		marginTop: -5,
		fontWeight: '400',
		marginVertical: 8
	}
});
