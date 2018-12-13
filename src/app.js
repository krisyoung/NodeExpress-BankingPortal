const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
const accountData = fs.readFileSync(path.join(__dirname, 'json/accounts.json'), 'utf8');
const userData = fs.readFileSync(path.join(__dirname, 'json/users.json'), 'utf8');
const accounts = JSON.parse(accountData);
const users = JSON.parse(userData);

app.get('/', (req, res) => res.render('index', { title: 'Account Summary', accounts }));
app.get('/profile', (req, res) => res.render('profile', { user: users[0] }));
app.get('/savings', (req, res) => res.render('account', { account: accounts.savings }));
app.get('/checking', (req, res) => res.render('account', { account: accounts.checking }));
app.get('/credit', (req, res) => res.render('account', { account: accounts.credit }));
app.get('/transfer', (req, res) => res.render('transfer'));
app.post('/transfer', (req, res) => {
	accounts[req.body.from].balance = accounts[req.body.from].balance - parseInt(req.body.amount, 10);
	accounts[req.body.to].balance = accounts[req.body.to].balance + parseInt(req.body.amount, 10);
	const accountsJSON = JSON.stringify(accounts, null, 4);
	fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');
	res.render('transfer', { message: 'Transfer Completed' });
});
app.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
app.post('/payment', (req, res) => {
	accounts.credit.balance -= parseInt(req.body.amount, 10);
	accounts.credit.available += parseInt(req.body.amount, 10);
	const accountsJSON = JSON.stringify(accounts, null, 4);
	fs.writeFileSync(path.join(__dirname, 'json/accounts.json'), accountsJSON, 'utf8');
	res.render('payment', { message: 'Payment Successful', account: accounts.credit });
})

app.listen(3000, () => console.log('PS project running on port 3000'));

