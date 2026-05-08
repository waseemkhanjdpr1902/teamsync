const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this';

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5500', 'https://yourdomain.com'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// ============ DATABASE SETUP ============
const db = new sqlite3.Database('./teamsync.db');

db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        team_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Teams table
    db.run(`CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Employees table
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        team TEXT,
        process TEXT,
        status TEXT DEFAULT 'active',
        doj DATE,
        team_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Monthly performance data
    db.run(`CREATE TABLE IF NOT EXISTS monthly_performance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_code TEXT NOT NULL,
        year_month TEXT NOT NULL,
        achieved REAL,
        target REAL,
        csat REAL,
        attendance REAL,
        auto_rating INTEGER,
        final_rating INTEGER,
        comment TEXT,
        updated_by INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(employee_code, year_month)
    )`);

    // Audit logs
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default admin if not exists
    const defaultAdmin = {
        email: 'admin@teamsync.com',
        name: 'Admin User',
        role: 'admin'
    };
    
    db.get("SELECT * FROM users WHERE email = ?", [defaultAdmin.email], (err, row) => {
        if (!row) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            db.run("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
                [defaultAdmin.email, hashedPassword, defaultAdmin.name, defaultAdmin.role]);
        }
    });
});

// ============ AUTH MIDDLEWARE ============
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// ============ API ROUTES ============

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, role } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, name, role || 'user'],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            
            const token = jwt.sign({ id: this.lastID, email, role: role || 'user' }, JWT_SECRET, { expiresIn: '30d' });
            res.json({ token, user: { id: this.lastID, email, name, role: role || 'user' } });
        });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    });
});

// Employee CRUD
app.get('/api/employees', authenticateToken, (req, res) => {
    db.all("SELECT * FROM employees WHERE status = 'active'", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/employees', authenticateToken, requireAdmin, (req, res) => {
    const { code, name, team, process, doj } = req.body;
    
    db.run("INSERT INTO employees (code, name, team, process, doj) VALUES (?, ?, ?, ?, ?)",
        [code, name, team, process, doj],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // Log audit
            db.run("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
                [req.user.id, 'CREATE_EMPLOYEE', `Created employee: ${code}`]);
            
            res.json({ id: this.lastID, code, name, team, process, doj });
        });
});

app.put('/api/employees/:code', authenticateToken, requireAdmin, (req, res) => {
    const { code } = req.params;
    const { name, team, process, status } = req.body;
    
    db.run("UPDATE employees SET name = ?, team = ?, process = ?, status = ? WHERE code = ?",
        [name, team, process, status, code],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Employee updated' });
        });
});

// Performance data endpoints
app.get('/api/performance/:yearMonth', authenticateToken, (req, res) => {
    const { yearMonth } = req.params;
    
    db.all(`SELECT mp.*, e.name, e.team, e.process 
            FROM monthly_performance mp
            JOIN employees e ON mp.employee_code = e.code
            WHERE mp.year_month = ?`, [yearMonth], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/performance', authenticateToken, (req, res) => {
    const { employee_code, year_month, achieved, target, csat, attendance, auto_rating, final_rating, comment } = req.body;
    
    db.run(`INSERT OR REPLACE INTO monthly_performance 
            (employee_code, year_month, achieved, target, csat, attendance, auto_rating, final_rating, comment, updated_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [employee_code, year_month, achieved, target, csat, attendance, auto_rating, final_rating, comment, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Performance data saved' });
        });
});

// Bulk upload endpoint
app.post('/api/performance/bulk', authenticateToken, (req, res) => {
    const { year_month, data } = req.body;
    
    const stmt = db.prepare(`INSERT OR REPLACE INTO monthly_performance 
        (employee_code, year_month, achieved, target, csat, attendance, auto_rating, final_rating, comment, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    let successCount = 0;
    let errorCount = 0;
    
    data.forEach(item => {
        stmt.run([item.code, year_month, item.achieved, item.target, item.csat, item.attendance, item.auto_rating, item.final_rating, item.comment, req.user.id], (err) => {
            if (err) errorCount++;
            else successCount++;
        });
    });
    
    stmt.finalize();
    
    db.run("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
        [req.user.id, 'BULK_UPLOAD', `Uploaded ${successCount} records for ${year_month}`]);
    
    res.json({ success: true, uploaded: successCount, errors: errorCount });
});

// Reports endpoint
app.get('/api/reports/annual/:fy', authenticateToken, (req, res) => {
    const { fy } = req.params;
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const yearStart = parseInt(fy.split('-')[0]);
    const yearEnd = parseInt(fy.split('-')[1]);
    const monthYears = months.map((m, idx) => {
        const year = idx < 3 ? yearEnd : yearStart;
        return `${m} ${year}`;
    });
    
    db.all(`SELECT e.code, e.name, e.team, mp.year_month, mp.final_rating
            FROM employees e
            LEFT JOIN monthly_performance mp ON e.code = mp.employee_code
            WHERE e.status = 'active'`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const result = {};
        rows.forEach(row => {
            if (!result[row.code]) {
                result[row.code] = {
                    name: row.name,
                    team: row.team,
                    ratings: {}
                };
            }
            if (row.year_month) {
                result[row.code].ratings[row.year_month] = row.final_rating;
            }
        });
        
        res.json({ months: monthYears, data: result });
    });
});

// Dashboard stats
app.get('/api/stats', authenticateToken, (req, res) => {
    db.get(`SELECT 
                (SELECT COUNT(*) FROM employees WHERE status = 'active') as total_employees,
                (SELECT AVG(final_rating) FROM monthly_performance WHERE year_month = (
                    SELECT year_month FROM monthly_performance ORDER BY updated_at DESC LIMIT 1
                )) as current_avg_rating,
                (SELECT COUNT(*) FROM monthly_performance WHERE updated_at > datetime('now', '-30 days')) as recent_updates`,
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
});

// Export full database as JSON (for backup)
app.get('/api/export', authenticateToken, requireAdmin, (req, res) => {
    const backup = {};
    
    db.all("SELECT * FROM employees", (err, employees) => {
        if (err) return res.status(500).json({ error: err.message });
        backup.employees = employees;
        
        db.all("SELECT * FROM monthly_performance", (err, performance) => {
            if (err) return res.status(500).json({ error: err.message });
            backup.performance = performance;
            backup.exportDate = new Date().toISOString();
            res.json(backup);
        });
    });
});

// Import backup
app.post('/api/import', authenticateToken, requireAdmin, (req, res) => {
    const { employees, performance } = req.body;
    
    db.run("BEGIN TRANSACTION");
    
    employees.forEach(emp => {
        db.run(`INSERT OR REPLACE INTO employees (code, name, team, process, status, doj) 
                VALUES (?, ?, ?, ?, ?, ?)`, [emp.code, emp.name, emp.team, emp.process, emp.status, emp.doj]);
    });
    
    performance.forEach(perf => {
        db.run(`INSERT OR REPLACE INTO monthly_performance 
                (employee_code, year_month, achieved, target, csat, attendance, auto_rating, final_rating, comment)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [perf.employee_code, perf.year_month, perf.achieved, perf.target, perf.csat, perf.attendance, perf.auto_rating, perf.final_rating, perf.comment]);
    });
    
    db.run("COMMIT", (err) => {
        if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Import successful' });
    });
});

// Shareable link endpoint (creates temporary token)
app.post('/api/share', authenticateToken, (req, res) => {
    const { data, expiresIn } = req.body;
    const shareToken = jwt.sign({ data, expiresAt: Date.now() + (expiresIn || 7 * 24 * 60 * 60 * 1000) }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${shareToken}` });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at /api/`);
});
