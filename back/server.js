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
    const { transfers, departure, arrive, date_from } = req.query;
    let query = 'SELECT * FROM tickets';
    const params = [];

    if (transfers !== undefined) {
        const transferValues = transfers.split(';').map(Number);
        const placeholders = transferValues.map(() => '?').join(',');
        query += ` WHERE stops IN (${placeholders})`;
        params.push(...transferValues);
    }
    if (departure && arrive && date_from) {
        query += transfers !== undefined ? ' AND' : ' WHERE';
        query += ' LOWER(origin_name) = LOWER(?) AND LOWER(destination_name) = LOWER(?) AND departure_date = ?';
        params.push(decodeURIComponent(departure), decodeURIComponent(arrive), date_from);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({ tickets: rows });
    });
});

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
                    res.status(400).json({ error: 'Этот пользователь уже купил этот билет' });
                    return;
                }
                db.run('UPDATE tickets SET available_seats = available_seats - 1 WHERE id = ?', [ticketId], function(err) {
                    if (err) {
                        res.status(500).json({ error: 'Ошибка обновления количества доступных мест' });
                        return;
                    }
                    res.json({ message: `Билет ${ticketId} успешно забронирован ${email}` });
                });
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



// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});