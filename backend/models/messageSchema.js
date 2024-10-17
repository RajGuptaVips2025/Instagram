const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,  // Only for one-to-one chats
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupChat',
        required: false,  // Only for group chats
    },
    message: {
        type: String,
        // required: true,
    },
    mediaUrl: {
        type: String,
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video'],  // Message types
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Message', messageSchema);




// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     reciverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     message: { type: String },
//     mediaUrl: { type: String }, // Store media URL
//     mediaType: {
//         type: String,
//         enum: ['text', 'image', 'video'],
//         default: 'text',
//     },
//     timestamp: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Message', messageSchema);





// const mongoose = require('mongoose');


// const messageSchema = mongoose.Schema({
//     senderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     reciverId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//      message: {
//         type: String,
//         required: true
//     }
// })

// module.exports = mongoose.model('Message', messageSchema);
