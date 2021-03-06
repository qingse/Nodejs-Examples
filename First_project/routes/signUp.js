var path = require('path'),
	fs = require('fs'),
	sha1 = require('sha1'),
	express = require('express'),
	router = express.Router();

var UserModel = require('../models/user'),
	CORS = require('../middlewares/cors');

router.post('/', CORS, (req, res, next) => {
	// console.log(req.fields);
	var { name, password, repassword, gender } = req.fields,
		avatar = req.files.avatar.path.split(path.sep).pop();

	// 校验参数
	try {
		if (name.length < 1 || name.length > 10) {
			throw new Error('名字长度超限');
		}
		if (['m', 'f'].indexOf(gender) === -1) {
			throw new Error('性别无效');
		}
		if (!req.files.avatar.name) {
			throw new Error('avatar lost');
		}
		if (password.length < 6) {
			throw new Error('密码最少6位');
		}
		if (password !== repassword) {
			throw new Error('两次密码输入不一致');
		}
	} catch(e) {
		fs.unlink(req.files.avatar.path);
		res.send('Register fail');
	}

	password = sha1(password);

	var user = {
		name,
		password,
		repassword,
		gender,
		avatar
	};

	UserModel.create(user)
		.then((result) => {
			user = result.ops[0];
			req.session.user = user;
			res.send(result);
		})
		.catch((e) => {
			fs.unlink(req.files.avatar.path);
			if (e.errmsg.match('E11000 duplicate key')) {
				res.send('用户名已存在');
			}
			next(e);
		});
});

module.exports = router;