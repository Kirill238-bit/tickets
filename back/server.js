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
    const { transfers, currency, departure, arrive, date_from } = req.query;
    let query = 'SELECT * FROM tickets';
    const params = [];

    if (transfers !== undefined) {
        const transferValues = transfers.split(';').map(Number);
        const placeholders = transferValues.map(() => '?').join(',');
        query += ` WHERE stops IN (${placeholders})`;
        params.push(...transferValues);
    }
    if (departure && arrive && date_from) {
        //const formattedDate = new Date(date_from).toISOString().split('T')[0]; // Ensure date is in YYYY-MM-DD format
        query += transfers !== undefined ? ' AND' : ' WHERE';
        query += ' LOWER(origin_name) = LOWER(?) AND LOWER(destination_name) = LOWER(?) AND departure_date = ?';
        params.push(decodeURIComponent(departure), decodeURIComponent(arrive), date_from);
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


app.get('/api/tickets/:id', (req, res) => {
    const id = req.params.id;
    const { currency } = req.query;
    
    db.get('SELECT * FROM tickets WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        if (currency) {
            row.price = convertCurrency(row.price, currency);
        }

        if (row.stops > 0) {
            db.all('SELECT layover_location, layover_arrival_time FROM layovers WHERE ticket_id = ?', [id], (err, layovers) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                row.layovers = layovers;
                res.json(row);
            });
        } else {
            row.layovers = [];
            res.json(row);
        }
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
                    res.status(400).json({ error: 'Этот пользователь уже забронировал этот билет' });
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