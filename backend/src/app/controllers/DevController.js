const { Router } = require('express');
const axios = require('axios');
const joi = require('@hapi/joi');
const dotenv = require('dotenv');
const ParseStringAsArray = require('../functions/ParseStringAsArray');
const { findConnections, sendMessage } = require('../../websocket');

dotenv.config();
const devRouter = Router();

const Dev = require('../models/Dev');

const GITHUB_API = 'https://api.github.com/users';

const creatingSchema = joi.object({
	github_username: joi
		.string()
		.required()
		.lowercase(),
	techs: joi.string().required(),
	latitude: joi.number().required(),
	longitude: joi.number().required()
});

const updatingSchema = joi.object({
	name: joi.string().min(6),
	bio: joi.string().allow(''),
	email: joi
		.string()
		.email()
		.allow(''),
	avatar_url: joi.string().allow(''),
	techs: joi.string(),
	latitude: joi.number(),
	longitude: joi.number()
});

/**
 * create
 * * ROUTE ==> CREATE NEW DEV
 */
devRouter.post('/', async (req, res) => {
	const { error } = creatingSchema.validate(req.body);
	if (error) return res.status(400).send({ status: 'error', message: error.details[0].message });

	const { github_username, techs, latitude, longitude } = req.body;

	let dev = await Dev.findOne({ github_username });
	let isNewDev = false;

	if (!dev) {
		const apiResponse = await axios.get(GITHUB_API + `/${github_username}`);

		const { avatar_url, bio, email } = apiResponse.data;
		let { name } = apiResponse.data;

		if (!name) name = apiResponse.data.login;

		const techsArray = ParseStringAsArray(techs);

		const location = {
			type: 'Point',
			coordinates: [longitude, latitude]
		};

		dev = new Dev({
			github_username,
			name,
			email,
			avatar_url,
			bio,
			techs: techsArray,
			location
		});
		isNewDev = true;

		const sendSockeMessageTo = findConnections({ latitude, longitude }, techsArray);

		sendMessage(sendSockeMessageTo, 'new-dev', dev);
	}

	try {
		dev = await dev.save();
		// const token = generateToken({ id: userSaved._id });
		res.send({ status: 'success', message: 'Dev created successfully', dev, isNewDev });
	} catch (error) {
		res.status(400).send({ status: 'error', message: 'Cannot create the dev in the database' });
	}
});

/**
 * get
 * * ROUTE ==> GET ALL DEV
 */
devRouter.get('/', async (req, res) => {
	const devs = await Dev.find();

	if (!devs) res.send({ status: 'error', message: 'No Devs found in the database' });

	res.send({ status: 'success', message: 'Dev loaded successfully', devs });
});

/**
 * search
 * * ROUTE ==> SEARCH DEV BY TECHNOLOGIES AND RAY OF 10KM
 */
devRouter.get('/search', async (req, res) => {
	const { latitude, longitude, techs } = req.query;

	const techsArray = ParseStringAsArray(techs);

	try {
		const devs = await Dev.find({
			techs: {
				$in: techsArray
			},
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [longitude, latitude]
					},
					$maxDistance: 10000
				}
			}
		});
		res.json({ status: 'success', message: 'Dev loaded successfully', devs });
	} catch (error) {
		res.status(400).send({ status: 'error', message: 'Cannot make dev search in the database' });
	}
});

/**
 * update
 * * ROUTE ==> UPDATE DEV BY ID
 */
devRouter.put('/update/:devId', async (req, res) => {
	const { error } = updatingSchema.validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const devId = req.params.devId;
	const devLoaded = await Dev.findById(devId);

	if (!devLoaded) return res.status(400).send({ status: 'error', message: 'Dev not found' });

	const { name, email, avatar_url, bio, latitude, longitude, techs } = req.body;

	const techsArray = ParseStringAsArray(techs);

	const location = {
		type: 'Point',
		coordinates: [longitude, latitude]
	};

	const devUpdate = {
		name,
		email,
		avatar_url,
		bio,
		techs: techsArray,
		location
	};

	try {
		await Dev.findByIdAndUpdate(devId, devUpdate, (err, res) => {
			console.log(err, res);
		});
		const dev = await Dev.findById(devId);

		return res.send({ status: 'success', message: 'Dev updated successfully', dev });
	} catch (error) {
		console.log(error);
		return res.status(400).send({ status: 'error', Message: 'Dev could not be updated' });
	}
});

/**
 * get
 * * ROUTE ==> GET DEV BY ID
 */
devRouter.get('/show/:devId', async (req, res) => {
	try {
		const devId = req.params.devId;
		const dev = await Dev.findById(devId);

		if (!dev) return res.status(400).send({ status: 'error', message: 'Dev not found' });

		return res.send({ status: 'success', message: 'Dev found successfully', dev });
	} catch (error) {
		return res.status(400).send({ status: 'error', message: 'Dev could not be shown' });
	}
});

/**
 * delete
 * * ROUTE ==> DELETE DEV BY ID
 */
devRouter.delete('/delete/:devId', async (req, res) => {
	try {
		const devId = req.params.devId;
		const dev = await Dev.findById(devId);

		if (!dev) return res.status(400).send({ status: 'error', message: 'Dev not found' });

		await Dev.findByIdAndRemove(devId);

		return res.send({ status: 'success', message: 'Dev deleted successfully' });
	} catch (error) {
		return res.status(400).send({ status: 'error', message: 'Dev could not be shown' });
	}
});

const API_VERSION = process.env.API_VERSION;

module.exports = app => app.use(API_VERSION + '/devs', devRouter);
