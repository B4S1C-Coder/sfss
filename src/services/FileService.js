const { Service } = require('../utils/decorators');
const logger = require('../config/logger');

@Service()
class FileService {
  constructor({ fileModel }) {
    this.fileModel = fileModel;
  }

  async createFileRecord(fileData) {
    const file = new this.fileModel({
      ...fileData,
      status: 'pending'
    });
    return await file.save();
  }

  async confirmUpload(s3Key) {
    return await this.fileModel.findOneAndUpdate(
      { s3Key },
      { status: 'uploaded' },
      { new: true }
    );
  }

  async getUserFiles(userId) {
    return await this.fileModel.find({ userId });
  }

  async deleteFileRecord(s3Key) {
    return await this.fileModel.findOneAndUpdate(
      { s3Key },
      { status: 'deleted' },
      { new: true }
    );
  }
}