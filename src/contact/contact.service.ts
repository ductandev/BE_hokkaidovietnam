import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import {
  errorCode,
  failCode,
  successCode,
  successCodeProduct,
} from 'src/Config/response';
import { CreateContactDto, UpdateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor() {}

  model = new PrismaClient();

  // ============================================
  //            GET ALL CONTACT
  // ============================================
  async getAll(res: Response) {
    try {
      let data = await this.model.lienHe.findMany({
        where: {
          isDelete: false,
        },
        orderBy: {
          lien_he_id: 'desc', // Đảm bảo lấy dữ liệu mới nhất trước
        },
        include: {
          TrangThaiLienHe: true,
        },
      });

      if (data.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Chưa có liên hệ nào được thêm vào dữ liệu',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:32 ~ getAll ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  // GET ALL CONTACT PAGINATION BY TYPE_ID SEARCH
  // ============================================
  async getAllPagination(
    typeID: number,
    pageIndex: number,
    pageSize: number,
    search: string,
    res: Response,
  ) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, 'page và limit phải lớn hơn 0 !');
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.lienHe.findMany({
          where: {
            ho_ten: {
              contains: search, // LIKE '%nameProduct%'
            },
            isDelete: false,
          },
        });

        if (total.length === 0) {
          return successCode(
            res,
            total,
            200,
            'Chưa có liên hệ nào được thêm vào dữ liệu',
          );
        }

        let data = await this.model.lienHe.findMany({
          skip: +index, // Sử dụng skip thay vì offset
          take: +pageSize, // Sử dụng take thay vì limit
          where: {
            ho_ten: {
              contains: search, // LIKE '%nameProduct%'
            },
            isDelete: false,
          },
          orderBy: {
            lien_he_id: 'desc', // Đảm bảo lấy dữ liệu mới nhất trước
          },
          include: {
            TrangThaiLienHe: true,
          },
        });

        if (data.length === 0) {
          return successCodeProduct(
            res,
            data,
            200,
            total.length,
            'Không có dữ liệu liên hệ được tìm thấy',
          );
        }

        return successCodeProduct(res, data, 200, total.length, 'Thành công !');
      }

      let total = await this.model.lienHe.findMany({
        where: {
          trang_thai_lien_he_id: +typeID,
          ho_ten: {
            contains: search, // LIKE '%nameProduct%'
          },
          isDelete: false,
        },
      });

      if (total.length === 0) {
        return successCode(
          res,
          total,
          200,
          'Không có dữ liệu liên hệ được tìm thấy !',
        );
      }

      let data = await this.model.lienHe.findMany({
        skip: +index, // Sử dụng skip thay vì offset
        take: +pageSize, // Sử dụng take thay vì limit
        where: {
          ho_ten: {
            contains: search, // LIKE '%nameProduct%'
          },
          trang_thai_lien_he_id: +typeID,
          isDelete: false,
        },
        orderBy: {
          lien_he_id: 'desc', // Đảm bảo lấy dữ liệu mới nhất trước
        },
        include: {
          TrangThaiLienHe: true,
        },
      });

      if (data.length === 0) {
        return successCodeProduct(
          res,
          data,
          200,
          total.length,
          'Không tìm thấy dữ liệu bạn đang tìm !',
        );
      }

      successCodeProduct(res, data, 200, total.length, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:115 ~ ContactService ~ getAllPagination ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //            GET ALL CONTACT SUMMARY
  // ============================================
  async getContactSummary(res: Response) {
    try {
      const totalContact = await this.model.lienHe.findMany({
        where: {
          isDelete: false,
        },
      });

      const content = {
        totalContact: totalContact.length,
      };

      successCode(res, content, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:154 ~ ContactService ~ getContactSummary ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //           GET BY ID
  // ============================================
  async getById(id: number, res: Response) {
    try {
      let data = await this.model.lienHe.findFirst({
        where: {
          lien_he_id: +id,
          isDelete: false,
        },
      });

      if (data === null) {
        return failCode(res, '', 404, 'Liên hệ ID không tồn tại');
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:179 ~ ContactService ~ getById ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               POST CONTACT
  // ============================================
  async postContact(body: CreateContactDto, res: Response) {
    try {
      let { email } = body;

      let checkContact = await this.model.lienHe.findMany({
        where: {
          email,
          isDelete: false,
        },
      });

      if (checkContact.length >= 15) {
        return failCode(res, '', 400, 'Spam !');
      }

      await this.model.lienHe.create({
        data: body,
      });

      successCode(res, body, 201, 'Thêm thông tin liên hệ thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:209 ~ ContactService ~ postContact ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               PUT CONTACT
  // ============================================
  // async putContact(id: number, body: UpdateContactDto, res: Response) {
  //   try {

  //     let checkContactID = await this.model.lienHe.findFirst({
  //       where: {
  //         lien_he_id: +id,
  //         isDelete: false
  //       }
  //     });

  //     if (checkContactID === null) {
  //       return failCode(res, '', 400, "Dữ liệu liên hệ không tồn tại !")
  //     }

  //     await this.model.lienHe.update({
  //       where: {
  //         lien_he_id: +id,
  //         isDelete: false
  //       },
  //       data: body
  //     });

  //     successCode(res, body, 200, "Cập nhật dữ liệu liên hệ thành công !")
  //   }
  //   catch (exception) {
  //     console.log("🚀 ~ file: contact.service.ts:208 ~ ContactService ~ putContact ~ exception:", exception);
  //     errorCode(res, "Lỗi BE")
  //   }
  // }

  // ============================================
  //               PATCH CONTACT
  // ============================================
  async patchContact(id: number, body: UpdateContactDto, res: Response) {
    try {
      let checkContact = await this.model.lienHe.findFirst({
        where: {
          lien_he_id: +id,
          isDelete: false,
        },
      });

      if (checkContact === null) {
        return failCode(res, '', 400, 'Dữ liệu ID liên hệ không tồn tại !');
      }

      let data = await this.model.lienHe.update({
        where: {
          lien_he_id: +id,
        },
        data: body,
      });

      successCode(res, data, 200, 'Cập nhật trạng thái liên hệ thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:275 ~ ContactService ~ patchContact ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //                DELETE CONTACT
  // ============================================
  async deleteContact(id: number, res: Response) {
    try {
      let checkContact = await this.model.lienHe.findFirst({
        where: {
          lien_he_id: +id,
          isDelete: false,
        },
      });

      if (checkContact === null) {
        return failCode(res, '', 400, 'Liên hệ ID không tồn tại !');
      }

      await this.model.lienHe.delete({
        where: {
          lien_he_id: +id,
        },
      });

      successCode(res, checkContact, 200, 'Xóa liên hệ thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: contact.service.ts:307 ~ ContactService ~ deleteContact ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }
}
