exports.getProfile = async (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
