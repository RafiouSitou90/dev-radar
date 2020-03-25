import React from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './ProfileStyles';

export class ProfileScreen extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const github_username = this.props.navigation.getParam('github_username');
		return (
			<WebView
				style={styles.webViewContainer}
				source={{ uri: `https://github.com/${github_username}` }}
			/>
		);
	}
}

export default ProfileScreen;
