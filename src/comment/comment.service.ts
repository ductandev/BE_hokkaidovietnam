import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

import { successCode, failCode, errorCode } from 'src/Config/response';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor() {}

  model = new PrismaClient();

  // ============================================
  //            GET ALL COMMENT
  // ============================================
  async getAllComment(res: Response) {
    try {
      let data = await this.model.binhLuan.findMany({
        where: {
          isDelete: false,
        },
      });

      if (data.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Chưa có dữ liệu bình luận nào được tìm thấy !',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: comment.service.ts:33 ~ CommentService ~ getAllComment ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE !');
    }
  }

  // ============================================
  //         GET COMMENT BY USER ID
  // ============================================
  async getCommentByUserId(userID: number, res: Response) {
    try {
      let data = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: +userID,
          isDelete: false,
        },
        include: {
          BinhLuan: true,
        },
      });

      if (data === null) {
        return failCode(res, '', 400, 'Người dùng id không tồn tại');
      }

      if (data.BinhLuan.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Người dùng này chưa bình luận sản phẩm nào !',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: comment.service.ts:61 ~ CommentService ~ getCommentByUserId ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE !');
    }
  }

  // ============================================
  //         GET COMMENT BY PRODUCT ID
  // ============================================
  async getCommentByProductId(productID: number, res: Response) {
    try {
      let data = await this.model.sanPham.findFirst({
        where: {
          san_pham_id: +productID,
          isDelete: false,
        },
        include: {
          BinhLuan: true,
        },
      });

      if (data === null) {
        return failCode(res, '', 400, 'Sản phẩm id không tồn tại');
      }

      if (data.BinhLuan.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Chưa có ai bình luận sản phẩm này !',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: comment.service.ts:61 ~ CommentService ~ getCommentByUserId ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE !');
    }
  }

  // ============================================
  //               POST COMMENT
  // ============================================
  async postComment(body: CreateCommentDto, res: Response) {
    try {
      let {
        san_pham_id,
        nguoi_dung_id,
        ngay_binh_luan,
        noi_dung,
        sao_binh_luan,
      } = body;

      let checkUserID = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id,
          isDelete: false,
        },
      });

      let checkProductID = await this.model.sanPham.findFirst({
        where: {
          san_pham_id,
          isDelete: false,
        },
      });

      if (checkUserID === null) {
        return failCode(res, '', 400, 'Người dùng không tồn tại !');
      }

      if (checkProductID === null) {
        return failCode(res, '', 400, 'Sản phẩm ID không tồn tại !');
      }

      await this.model.binhLuan.create({
        data: body,
      });

      successCode(res, body, 201, 'Thêm bình luận thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: comment.service.ts:140 ~ CommentService ~ postComment ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               PUT COMMENT
  // ============================================
  async putComment(commentID: number, body: CreateCommentDto, res: Response) {
    try {
      let {
        san_pham_id,
        nguoi_dung_id,
        ngay_binh_luan,
        noi_dung,
        sao_binh_luan,
      } = body;

      let checkCmtID = await this.model.binhLuan.findFirst({
        where: {
          binh_luan_id: +commentID,
          san_pham_id,
          nguoi_dung_id,
          isDelete: false,
        },
      });

      if (checkCmtID === null) {
        return failCode(
          res,
          '',
          400,
          'Dữ liệu không tồn tại hoặc chưa nhập đúng !',
        );
      }

      await this.model.binhLuan.update({
        where: {
          binh_luan_id: +commentID,
          san_pham_id,
          nguoi_dung_id,
        },
        data: {
          san_pham_id,
          nguoi_dung_id,
          ngay_binh_luan,
          noi_dung,
          sao_binh_luan,
        },
      });

      successCode(res, body, 200, 'Cập nhật bình luận thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: comment.service.ts:185 ~ CommentService ~ putComment ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //                DELETE COMMENT
  // ============================================
  async deleteComment(commentID: number, res: Response) {
    try {
      let checkCmtID = await this.model.binhLuan.findFirst({
        where: {
          binh_luan_id: +commentID,
          isDelete: false,
        },
      });

      if (checkCmtID === null) {
        return failCode(res, '', 400, 'Comment ID không tồn tại !');
      }

      await this.model.binhLuan.update({
        where: {
          binh_luan_id: +commentID,
        },
        data: {
          isDelete: true,
        },
      });

      successCode(res, checkCmtID, 200, 'Xóa bình luận thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: comment.service.ts:221 ~ CommentService ~ deleteComment ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }
}
