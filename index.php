<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="description" content="A web chatting application by LKX"/>
		<meta name="keywords" content=""/>
		<meta name="robots" content="index, follow"/>
		<meta name="author" content="Luigi Vincent, Kerules Fareg, Xiaoding Lin"/>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Web Chatter</title>
		<script src="index.js"></script>
		<link rel="stylesheet" href="index.css"/>
		<link rel="shortcut icon" href="assets/icon.ico"/>
	</head>

	<body>
		<form id='login-form' action="index.php" method="post">
			<h1 id='title'>Welcome to Chatter</h1>
			Username: <input type="text" class="input" name="username" required="required"><br>
			Password: <input type="password" class="input" name="password" style="margin-left: 3px;" required="required"><br>
			<input id="login" type="submit" name="submit" value="Log in">
		</form>

		<?php
			//include("connection.php"); 
			$name = $_POST['username'];
			$password = sha1($_POST['password']);
			if(isset($_POST['submit'])) {
				echo "<span class='response success'>Your username is $name.</span>";
			}

			/*$SQL = "SELECT username, password FROM users WHERE username=$name AND password=$password;";

			if (mysqli_query($dbc, $SQL)) {
				echo "span class='success'>Success</span>";
			} else {
				echo "<span class='error'>Error</span>" . mysqli_error($dbc);
			}*/
		?>
	</body>
</html>