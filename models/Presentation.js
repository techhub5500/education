const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    originalText: {
        type: String,
        required: true
    },
    elements: [{
        type: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        highlights: [String],
        animation: {
            duration: Number
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

presentationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Presentation', presentationSchema);
