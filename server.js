const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 2000;

// Define the path for comments.json inside the public directory
const COMMENTS_FILE_PATH = path.join(__dirname, 'public', 'comments.json');

// Helper function to read comments from the JSON file
function readCommentsFromFile() {
    try {
        const data = fs.readFileSync(COMMENTS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading comments.json:", err);
        return [];
    }
}

// Helper function to write comments to the JSON file
function writeCommentsToFile(comments) {
    try {
        fs.writeFileSync(COMMENTS_FILE_PATH, JSON.stringify(comments, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error posting your review, try again!", err);
    }
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Handle comments submission
app.post('/comments', (req, res) => {
    const { name, comment } = req.body;
    if (!name || !comment) {
        return res.status(400).send('Name and comment are required.');
    }

    // Read existing comments
    const comments = readCommentsFromFile();

    // Add the new comment
    comments.push({ name, comment });

    // Save back to the JSON file
    writeCommentsToFile(comments);

    res.status(200).send('Comment received');
});

// Serve saved comments
app.get('/comments', (req, res) => {
    const comments = readCommentsFromFile();
    res.json(comments);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
