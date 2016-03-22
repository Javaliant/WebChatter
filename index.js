/* Author: Luigi Vincent */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serveStatic = require('serve-static');
var connectingUser = [];

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Chatter'
});
connection.connect();

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
		retrieveUserList(function(err, userList) {
			socket.emit('chat message', userList);
		});
		user = connectingUser.pop();
	});

	socket.on('chat message', function(msg) {
		if (msg.length > 0) {
			io.emit('chat message', user + ": " + msg);
		}
	});

	socket.on('login', function(username, password) {
		isValidUser(username, password, function(err, result) {
			if (result) {
				connectingUser.push(username);
				io.emit('chat message', username + " has logged in.");
				socket.emit('redirect', '/app');
			} else {
				socket.emit('invalid', null);
			}
		});
	});

	socket.on('register', function() {
		socket.emit("redirect", '/register');
	});

	socket.on('registration', function(username, password) {
		isExistingUser(username, function(err, result) {
			if (result) {
				socket.emit('exists', null);
			} else {
				addUser(username, password);
				socket.emit("redirect", '/login');
			}
		});
	});
});

http.listen(8080, function(){
	console.log('listening on: 8080');
});

function addUser(username, password) {
	connection.query('INSERT INTO users(username, password) VALUES("'
		+ username + '", "' + password +'")',
		function(err) {
			if (err) {
				console.error("Error while performing user addition query.");
			}
		}
	);
}

function isExistingUser(username, callback) {
	connection.query("SELECT username FROM users WHERE username=\"" + username + "\"",
		function(err, rows) {
			if (!err) {
				callback(null, rows.length > 0);
			} else {
				console.error('Error while performing user existential query.');
			}
		}
	);
}

function isValidUser(username, password, callback) {
	connection.query("SELECT username FROM users WHERE username=\"" + username
		+ "\" AND password=\"" + password + "\"",
		function(err, rows) {
			if (!err) {
				callback(null, rows.length > 0);
			} else {
				console.error('Error while performing user validation query.');
			}
		}
	);
}

function retrieveUserList(callback) {
	connection.query("SELECT username FROM users", function(err, rows) {
		var list = 'Registered Users: ';
		if (!err) {
			var listBuilder = '';
			for (var i = 0; i < rows.length; i++) {
				listBuilder += ', ' + rows[i].username;
			}
			list += listBuilder.substring(2);
			callback(null, list);
		} else {
			console.error('Error while performing user list query.');
		}
	});
}
