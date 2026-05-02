const ThemeConfig = require('../models/ThemeConfig');

exports.getThemeSettings = async (req, res) => {
    try {
        let theme = await ThemeConfig.findOne();
        if (!theme) {
            theme = await ThemeConfig.create({});
        }
        res.render('admin/theme/index', { title: 'Theme Settings', themeConfig: theme });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateThemeSettings = async (req, res) => {
    try {
        const { darkMode } = req.body;
        const updateData = {
            ...req.body,
            darkMode: darkMode === 'on'
        };

        let theme = await ThemeConfig.findOne();
        if (theme) {
            theme = await ThemeConfig.findByIdAndUpdate(theme._id, updateData, { new: true });
        } else {
            theme = await ThemeConfig.create(updateData);
        }
        res.redirect('/admin/theme?success=Theme updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
