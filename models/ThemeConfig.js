const mongoose = require('mongoose');

const ThemeConfigSchema = new mongoose.Schema({
    primaryColor: { type: String, default: '#0d6efd' },
    secondaryColor: { type: String, default: '#6c757d' },
    accentColor: { type: String, default: '#f39c12' },
    dangerColor: { type: String, default: '#dc3545' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#212529' },
    sidebarColor: { type: String, default: '#343a40' },
    sidebarTextColor: { type: String, default: '#ffffff' },
    borderRadius: { type: String, default: '0.375rem' },
    fontSize: { type: String, default: '1rem' },
    spacing: { type: String, default: '1rem' },
    darkMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ThemeConfig', ThemeConfigSchema);
