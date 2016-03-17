/* Author: Luigi Vincent */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');
var onlineUsers = [];

app.use('/assets', serveStatic(__dirname + '/node_modules'));
app.use(require('serve-favicon')(__dirname + '/assets/icon.ico'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

app.get('/login', function(req, res) {
	res.redirect("/");
})

app.get('/register', function(req, res) {
	res.sendFile(__dirname + '/registration.html');
})

app.get('/app', function(req, res) {
	res.sendFile(__dirname + '/app.html');
})

io.on('connection', function(socket) {
	var user = '';
	socket.on('user connect', function() {
		socket.emit('chat message', 'Registered users: ' + getUserList());
		user = onlineUsers.pop();
	});

	socket.on('chat message', function(msg) {
		if (msg.length > 0) {
			io.emit('chat message', user + ": " + msg);
		}
	});

	socket.on('login', function(username, password) {
		if (isValidUser(username, password)) {
			onlineUsers.push(username);
			io.emit('chat message', username + " has logged in.");
			socket.emit('redirect', '/app');
		} else {
			socket.emit('invalid', null);
		}
	});

	socket.on('register', function() {
		socket.emit("redirect", '/register');
	});

	socket.on('registration', function(username, password) {
		if (isExistingUser(username)) {
			socket.emit('exists', null);
		} else {
			addUser(username, password);
			socket.emit("redirect", '/login');
		}
	});
});

http.listen(8080, function(){
	console.log('listening on: 8080');
});

function User(name, password) {
	this.name = name;
	this.password = password;
}

var kerules = new User("Kerules", "123");
var xiaoding = new User("Xiaoding", "1234");
var luigi = new User("pi", "3.14");
var users = [kerules, xiaoding, luigi];

function isExistingUser(username) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].name === username) {
			return true;
		}
	}
	return false;
}

function isValidUser(username, password) {
	for (var i = 0; i < users.length; i++) {
		if (username === users[i].name) {
			return password === users[i].password;
		}
	}
	return false;
}

function addUser(username, password) {
	users.push(new User(username, password));
}

function getUserList() {
	userList = "";
	for (var i = 0; i < users.length; i++) {
		userList += ', ' + users[i].name;
	}
	return userList.substring(2);
}

function removeUser(username) {
	for (var i = 0; i < users.length; i++) {
		if (users[i] == username) {
			users.splice(i, 1);
			break;
		}
	}
}