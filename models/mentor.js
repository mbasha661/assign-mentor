const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema);
