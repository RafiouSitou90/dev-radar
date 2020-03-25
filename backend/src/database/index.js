const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const database = mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(
		() => {
			console.log('Connected to database successfully');
		},
		err => {
			console.log(err);
		}
	);

mongoose.Promise = global.Promise;

module.exports = database;
