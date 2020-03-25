import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	mapContainer: {
		flex: 1
	},
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 27,
		borderWidth: 2,
		borderColor: '#FFF'
	},
	callout: {
		width: 260
	},
	devName: {
		fontWeight: 'bold',
		fontSize: 16
	},
	devBio: {
		color: '#666',
		marginTop: 5
	},
	devTechs: {
		marginTop: 5
	},
	inputContainer: {
		position: 'absolute',
		bottom: 20,
		left: 15,
		right: 15,
		zIndex: 5,
		flexDirection: 'row'
	},
	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: '#FFF',
		color: '#333',
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},
		elevation: 2
	},
	loadButton: {
		width: 50,
		height: 50,
		backgroundColor: '#1327a7',
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},
		elevation: 2
	}
});

export default styles;
