const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PointSchema = require('./utils/PointSchema');

const devSchema = new mongoose.Schema(
	{
		github_username: {
			type: String,
			required: true,
			lowercase: true
		},
		name: {
			type: String,
			required: false
		},
		email: {
			type: String,
			default: null,
			required: false,
			lowercase: true
		},
		// password: {
		// 	type: String,
		// 	select: false,
		// 	required: false,
		// 	default: ''
		// },
		bio: {
			type: String,
			default: null,
			required: false
		},
		avatar_url: {
			type: String,
			default: null,
			required: false
		},
		techs: {
			type: [String],
			required: true
		},
		location: {
			type: PointSchema,
			index: '2dsphere'
		}
	},
	{ timestamps: true }
);

// devSchema.pre('save', async function(next) {
// 	const salt = bcrypt.genSaltSync(10);

// 	const passwordHash = await bcrypt.hashSync(this.password, salt);
// 	this.password = passwordHash;

// 	next();
// });

const Dev = mongoose.model('Dev', devSchema);

module.exports = Dev;
