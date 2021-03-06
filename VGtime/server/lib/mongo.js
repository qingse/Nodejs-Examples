var config = require('config-lite')(__dirname),
	mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(config.mongodb);

var commentLength = (val) => {
	if (val.length <= 50) {
		return true;
	}
	return false;
};

exports.User = mongoose.model('User', {
	name: { type: String, unique: true, required: true, index: 1 },
	password: { type: String, require: true },
	avatar: String,
	geneder: { type: String, enum: ['m', 'f'] },
	bio: String
});

exports.Post = mongoose.model('Post', {
	author: String,
	author_avatar: String,
	name: String,
	cover: String,
	platform: { type: Array, enum: ['PS4', 'PS3', 'PSV', 'XBONE', 'XB360', '3DS', 'Wii', 'NSwitch']},
	content: String,
	score: { type: Number, index: -1 },
	creat_time: Date
});

exports.Comment = mongoose.model('Comment', {
	authorId: mongoose.Schema.Types.ObjectId,
	content: { type: String, required: true },
	postId: mongoose.Schema.Types.ObjectId,
	create_time: { type: Date, index: -1, required: true }
});