const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { connectDB } = require('./config/db');
const ThemeConfig = require('./models/ThemeConfig');
const dashboardController = require('./controllers/dashboardController');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Theme Cache
let themeCache = null;
const THEME_CACHE_TTL = 60000; // 1 minute
let lastThemeFetch = 0;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            "style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
            "font-src": ["'self'", "cdnjs.cloudflare.com", "fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https:"]
        },
    }
}));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware for Theme and Navigation
app.use(async (req, res, next) => {
    try {
        const now = Date.now();
        if (!themeCache || (now - lastThemeFetch) > THEME_CACHE_TTL) {
            themeCache = await ThemeConfig.findOne();
            lastThemeFetch = now;

            if (!themeCache) {
                themeCache = {
                    primaryColor: '#0d6efd',
                    secondaryColor: '#6c757d',
                    accentColor: '#f39c12',
                    dangerColor: '#dc3545',
                    backgroundColor: '#ffffff',
                    textColor: '#212529',
                    sidebarColor: '#343a40',
                    sidebarTextColor: '#ffffff',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    spacing: '1rem',
                    darkMode: false
                };
            }
        }
        res.locals.theme = themeCache;
        next();
    } catch (err) {
        console.error('Theme middleware error:', err);
        next();
    }
});

// Routes
app.use('/admin/theme', require('./routes/theme'));
app.use('/admin/rates', require('./routes/rates'));
app.use('/admin/products', require('./routes/products'));
app.get('/', dashboardController.getDashboardStats);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { title: 'Error', message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
