const Joi = require('joi');

const PresignedUrlDto = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required(),
  folder: Joi.string().optional().default('uploads'),
});

module.exports = PresignedUrlDto;