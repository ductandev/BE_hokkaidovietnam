import { UploadService } from './upload.service';
import { Controller, Post, Body, HttpCode, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';

import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { FileUploadDto_upload } from './dto/upload.dto';

@ApiTags('Upload')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  // ============================================
  //               POST IMG
  // ============================================
  @ApiConsumes('multipart/form-data')
  @HttpCode(201)
  @Post('/')
  @UseInterceptors(FilesInterceptor('hinh_anh', 20))
  postImgs(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: FileUploadDto_upload,
    @Res() res: Response,
  ) {
    return this.uploadService.postImgs(files, body, res);
  }
}
