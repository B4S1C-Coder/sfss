const { Controller, Post, Get } = require('../utils/decorators');
const validateDto = require('../middlewares/validateDto');
const PresignedUrlDto = require('../dtos/PresignedUrlDto');
const logger = require('../config/logger');

@Controller('/upload')
class UploadController {
  constructor({ s3Service }) {
    this.s3Service = s3Service;
  }

  @Post('/presigned-url', [validateDto(PresignedUrlDto), 'authenticate'])
  async getPresignedUrl(req, res) {
    const { fileName, fileType, folder } = req.body;
    const result = await this.s3Service.generatePresignedUploadUrl(fileName, fileType, folder);

    logger.info('Presigned URL Generated', {
      userId: req.user.id, fileName, key: result.key
    });

    res.json({
      success: true,
      data: result,
      message: 'Upload the file directly to the uploadUrl via PUT'
    });
  }

  @Post('/confirm', ['authenticate'])
  async confirmUpload(req, res) {
    const { key, fileUrl } = req.body;
    const userId = req.user.id;

    logger.info('File upload confirmed', { userId, key });

    res.json({
      success: true,
      message: 'Upload confirmed',
      data: { key, fileUrl }
    });
  }

  @Get('/download/:key', ['authenticate'])
  async getDownloadUrl(req, res) {
    const key  = req.params.key;
    const downloadUrl = await this.s3Service.generatePresignedDownloadUrl(key);

    res.json({
      success: true,
      data: {downloadUrl}
    });
  }
}

module.exports = UploadController;