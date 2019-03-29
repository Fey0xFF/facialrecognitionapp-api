const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'Sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	// bcrypt.compare("apples", "$2a$10$hx3Nx6nH7HtjroN3aDa.8OarxFiBKHH0K6aPGt.ee8NnlG0/J2twa", function(err, res) {
 //    	console.log('first guess', res);
	// });
	// bcrypt.compare("veggies", "$2a$10$hx3Nx6nH7HtjroN3aDa.8OarxFiBKHH0K6aPGt.ee8NnlG0/J2twa", function(err, res) {
	//     console.log('second guess', res);
	// });
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;

	bcrypt.hash(password, null, null, function(err, hash) {
    	console.log(hash);
	});

	database.users.push({
		id:'125',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			res.json(user);
			found = true;
		} 
	})
	if (!found) {
		res.status(400).json('Error request');
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			user.entries++;
			res.json(user.entries);
			found = true;
		} 
	})
	if (!found) {
		res.status(404).json('Error request');
	}		
})



// Load hash from your password DB.


app.listen(3000, () => {
	console.log("app is running on port 3000");
})
