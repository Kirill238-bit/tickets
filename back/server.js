const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database(':memory:');

// Create tickets table
db.serialize(() => {
    db.run(`CREATE TABLE tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin TEXT,
        origin_name TEXT,
        destination TEXT,
        destination_name TEXT,
        departure_date TEXT,
        departure_time TEXT,
        arrival_date TEXT,
        arrival_time TEXT,
        carrier TEXT,
        stops INTEGER,
        price INTEGER,
        booked BOOLEAN DEFAULT 0
    )`);

    // Insert sample data
    const tickets = require('../front/public/tickets.json').tickets;
    const stmt = db.prepare(`INSERT INTO tickets (
        origin, origin_name, destination, destination_name, 
        departure_date, departure_time, arrival_date, arrival_time, 
        carrier, stops, price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    tickets.forEach(ticket => {
        stmt.run(
            ticket.origin, ticket.origin_name, ticket.destination, ticket.destination_name,
            ticket.departure_date, ticket.departure_time, ticket.arrival_date, ticket.arrival_time,
            ticket.carrier, ticket.stops, ticket.price
        );
    });
    stmt.finalize();
});

// Get all tickets
app.get('/tickets', (req, res) => {
    db.all('SELECT * FROM tickets', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ tickets: rows });
    });
});

// Get ticket by ID
app.get('/tickets/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM tickets WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// Book a ticket
app.post('/tickets/:id/book', (req, res) => {
    const id = req.params.id;
    db.run('UPDATE tickets SET booked = 1 WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Ticket ${id} booked successfully` });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});