const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'anthony',
	  password : '',
	  database : 'facialrec'
	}
});


db.select('*').from('users').then(data => {	
	console.log('users', data);
});

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

	// bcrypt.hash(password, null, null, function(err, hash) {
 //    	console.log(hash);
	// });

	db('users')
		.returning('*')
		.insert({
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
		if(user.length) {
			res.json(user[0])	
		} else {
			res.status(400).json('Not found')
		}
		
	})
	.catch(err => res.status(400).json('Not found'))
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries!'))
})



// Load hash from your password DB.


app.listen(3000, () => {
	console.log("app is running on port 3000");
})
