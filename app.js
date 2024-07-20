const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mentorRoutes = require('./routes/mentor');
const studentRoutes = require('./routes/student');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(mentorRoutes);
app.use(studentRoutes);

mongoose.connect('mongodb://localhost:27017/mentor-student', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
