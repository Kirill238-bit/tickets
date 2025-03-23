const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const convertCurrency = require('./convertCurrency');

const app = express();
const port = 7070; 


app.use(cors());
app.use(express.json());
app.use(express.static('../front/build'));

const db = new sqlite3.Database('db.sqlite', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к базе данных SQLite.');
  }
});

app.get('/', (req, res) => {
  res.sendFile('index.html');
});


// Get all tickets
app.get('/api/tickets', (req, res) => {
    const { transfers, currency } = req.query;
    console.log('Currency parameter:', currency);
    let query = 'SELECT * FROM tickets';
    const params = [];

    if (transfers !== undefined) {
        const transferValues = transfers.split(';').map(Number);
        const placeholders = transferValues.map(() => '?').join(',');
        query += ` WHERE stops IN (${placeholders})`;
        params.push(...transferValues);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (currency) {
            rows = rows.map(ticket => {
                ticket.price = convertCurrency(ticket.price, currency);
                return ticket;
            });
        }

        res.json({ tickets: rows });
    });
});

// Get ticket by ID
app.get('/api/tickets/:id', (req, res) => {
    const id = req.params.id;
    const { currency } = req.query;
    db.get('SELECT * FROM tickets WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (currency) {
            row.price = convertCurrency(row.price, currency);
        }

        res.json(row);
    });
});

// Book a ticket
app.post('/api/tickets/book', (req, res) => {
    const { email, ticketId,username } = req.body;

    db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const userId = user ? user.id : null;

        const bookTicket = (userId) => {
            db.run('INSERT INTO bookings (user_id, ticket_id) VALUES (?, ?)', [userId, ticketId], function(err) {
                if (err) {
                    res.status(400).json({ error: 'Этот пользователь уже забронировали этот билет' });
                    return;
                }
                res.json({ message: `Билет ${ticketId} успешно забронирован ${email}` });
            });
        };

        if (userId) {
            bookTicket(userId);
        } else {
            db.run('INSERT INTO users (email, username) VALUES (?, ?)', [email, username], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                bookTicket(this.lastID);
            });
        }
    });
});

// Canceling a booking
app.post('/api/tickets/cancel', (req, res) => {
    const { email, ticketId } = req.body;

    db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }

        db.run('DELETE FROM bookings WHERE user_id = ? AND ticket_id = ?', [user.id, ticketId], function(err) {
            if (err || this.changes === 0) {
                res.status(400).json({ error: 'Booking not found or already canceled' });
                return;
            }
            res.json({ message: `Booking for ticket ${ticketId} canceled successfully for user ${email}` });
        });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});