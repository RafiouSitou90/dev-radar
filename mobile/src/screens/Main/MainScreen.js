import React from 'react';
import {
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	Animated,
	Keyboard,
	Platform,
	Alert
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../../api/api';
import { connect, disconnect, subscribeToNewDevs } from '../../services/socket';

import styles from './MainStyles';

const isIOS = Platform.OS === 'ios';

export class MainScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRegion: null,
			techs: '',
			devs: [],
			count: 0
		};
		this.keyboardHeight = new Animated.Value(10);
		this.bottomPadding = new Animated.Value(60);
	}

	componentDidMount() {
		this._loadInitialPosition();

		this.keyboardShowListener = Keyboard.addListener(
			isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
			e => this.keyboardEvent(e, true)
		);
		this.keyboardHideListener = Keyboard.addListener(
			isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
			e => this.keyboardEvent(e, false)
		);
	}

	_upDateDevsSearch = () => {
		subscribeToNewDevs(dev =>
			this.setState(prevDevs => {
				return { devs: [...prevDevs.devs, dev] };
			})
		);
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.devs !== this.state.devs) {
			this._upDateDevsSearch();

			// subscribeToNewDevs(dev =>
			// 	this.setState(devs => {
			// 		return { devs: [...prevState.devs, dev] };
			// 	})
			// );

			// subscribeToNewDevs(dev =>
			// 	this.setState(prevDevs => {
			// 		return { devs: [...prevDevs.devs, dev] };
			// 	})
			// );

			// console.log(prevState.devs);
			// console.log(this.state.devs);
		}
	}

	componentWillUnmount() {
		this.keyboardShowListener.remove();
		this.keyboardHideListener.remove();
	}

	keyboardEvent = (event, isShow) => {
		Animated.parallel([
			Animated.timing(this.keyboardHeight, {
				duration: event.duration,
				toValue: isShow ? 300 : 10
			}),
			Animated.timing(this.bottomPadding, {
				duration: event.duration,
				toValue: isShow ? 300 : 10
			})
		]).start();
	};

	_loadInitialPosition = async () => {
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status !== 'granted') await Permissions.askAsync(Permissions.LOCATION);

		if (status === 'granted') {
			const { coords } = await Location.getCurrentPositionAsync({
				enableHighAccuracy: true
			});

			const { latitude, longitude } = coords;

			this.setState({
				currentRegion: { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
			});
		}
	};

	_loadDevs = async () => {
		if (!this.state.techs.trim())
			return Alert.alert('Warning', 'Please digit the technologies for a search');
		const { latitude, longitude } = this.state.currentRegion;

		const response = await api.get('/devs/search', {
			params: {
				latitude,
				longitude,
				techs: this.state.techs
			}
		});

		this.setState({ devs: response.data.devs });
		this._setupWebsocket();
	};

	_handleRegionChange = region => {
		this.setState({ currentRegion: region });
	};

	_setupWebsocket = () => {
		disconnect();

		const { latitude, longitude } = this.state.currentRegion;
		const techs = this.state.techs;

		connect(latitude, longitude, techs);
	};

	render() {
		if (!this.state.currentRegion) return null;
		return (
			<>
				<MapView
					onRegionChangeComplete={this._handleRegionChange}
					initialRegion={this.state.currentRegion}
					style={styles.mapContainer}
				>
					{this.state.devs.map(dev => (
						<Marker
							key={dev._id}
							coordinate={{
								latitude: dev.location.coordinates[1],
								longitude: dev.location.coordinates[0]
							}}
						>
							<Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
							<Callout
								onPress={() => {
									this.props.navigation.navigate('Profile', {
										github_username: dev.github_username
									});
								}}
							>
								<View style={styles.callout}>
									<Text style={styles.devName}>{dev.name}</Text>
									{dev.bio ? <Text style={styles.devBio}>{dev.bio}</Text> : null}
									<Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
								</View>
							</Callout>
						</Marker>
					))}
				</MapView>
				<Animated.View style={[styles.inputContainer, { bottom: this.keyboardHeight }]}>
					<TextInput
						style={styles.searchInput}
						placeholder='Search devs by techs...'
						placeholderTextColor='#999'
						autoCapitalize='words'
						autoCorrect={false}
						value={this.state.techs}
						onChangeText={text => this.setState({ techs: text })}
						selectionColor='#1327a7'
					/>
					<TouchableOpacity onPress={this._loadDevs} style={styles.loadButton}>
						<MaterialIcons name='my-location' color='#FFF' size={24} />
					</TouchableOpacity>
				</Animated.View>
			</>
		);
	}
}

export default MainScreen;
