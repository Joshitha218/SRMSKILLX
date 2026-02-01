require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { db, initDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL (adjust as needed)
    credentials: true
}));

// Session Config
app.use(session({
    secret: process.env.SESSION_SECRET || 'srm-skillx-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Initialize DB
initDb();

// Middleware to check auth
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// --- AUTH ROUTES ---

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password, year } = req.body;

    // Validate Email
    if (!email.endsWith('@srmap.edu.in')) {
        return res.status(400).json({ error: 'Only @srmap.edu.in emails are allowed.' });
    }

    try {
        // Check if user exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) return res.status(400).json({ error: 'User already exists.' });

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert User
            db.run(
                'INSERT INTO users (name, email, password, year) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, year],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    
                    // Auto-login
                    req.session.userId = this.lastID;
                    req.session.user = { id: this.lastID, name, email, year };
                    
                    // Award 'Beginner' badge
                    db.run('INSERT INTO badges (user_id, badge_name) VALUES (?, ?)', [this.lastID, 'Beginner']);

                    res.status(201).json({ message: 'User registered successfully', user: req.session.user });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid email or password' });

        req.session.userId = user.id;
        req.session.user = { id: user.id, name: user.name, email: user.email, year: user.year };
        res.json({ message: 'Login successful', user: req.session.user });
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// Get Current User
app.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
});

// --- USER & PROFILE ROUTES ---

// Get User Profile with Skills/Badges
app.get('/api/users/:id', isAuthenticated, (req, res) => {
    const userId = req.params.id;
    
    db.get('SELECT id, name, email, year FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });

        db.all('SELECT skill_name FROM skills WHERE user_id = ?', [userId], (err, skills) => {
            if (err) return res.status(500).json({ error: err.message });
            
            db.all('SELECT badge_name FROM badges WHERE user_id = ?', [userId], (err, badges) => {
                if (err) return res.status(500).json({ error: err.message });
                
                db.all('SELECT goal_text, status FROM goals WHERE user_id = ?', [userId], (err, goals) => {
                     if (err) return res.status(500).json({ error: err.message });
                     
                     res.json({ ...user, skills, badges, goals });
                });
            });
        });
    });
});

// Update Profile (Add Skill)
app.post('/api/skills', isAuthenticated, (req, res) => {
    const { skill_name } = req.body;
    db.run('INSERT INTO skills (user_id, skill_name) VALUES (?, ?)', [req.session.userId, skill_name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, skill_name });
    });
});

// Search Users by Skill
app.get('/api/search', isAuthenticated, (req, res) => {
    const { q } = req.query; // query skill
    const sql = `
        SELECT u.id, u.name, u.email, u.year, s.skill_name 
        FROM users u 
        JOIN skills s ON u.id = s.user_id 
        WHERE s.skill_name LIKE ? OR u.name LIKE ?
    `;
    db.all(sql, [`%${q}%`, `%${q}%`], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
