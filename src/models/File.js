const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number },
  s3Key: { type: String, required: true, unique: true },
  fileUrl: { type: String, required: true },
  folder: { type: String, default: 'uploads' },
  status: {
    type: String,
    enum: ['pending', 'uploaded', 'deleted'],
    default: 'pending'
  }
},{
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);