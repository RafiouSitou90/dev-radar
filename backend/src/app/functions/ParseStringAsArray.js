const ParseStringAsArray = data => {
	return data.split(',').map(result => result.trim());
};

module.exports = ParseStringAsArray;
