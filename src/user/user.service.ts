import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errorCode, failCode, successCode, successCodeProduct } from 'src/Config/response';
// THƯ VIỆN MÃ HÓA PASSWORD
// yarn add bcrypt
import * as bcrypt from 'bcrypt';
// import * as fs from 'fs';

import { UserUpdateDto } from './dto/update-user.dto';
import { FileUploadDto_user } from './dto/upload.dto';
import { Response } from 'express';

// =================CLOUDYNARY=====================
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
const streamifier = require('streamifier');


@Injectable()
export class UserService {
    constructor() { }

    model = new PrismaClient();


    // ============================================
    //   LẤY THÔNG TIN CHI TIẾT TẤT CẢ NGƯỜI DÙNG
    // ============================================
    async getInforAllUser(res: Response) {
        try {
            let data = await this.model.nguoiDung.findMany({
                where: {
                    isDelete: false
                }
                // ,include: {
                //     DonHang: {
                //         include: {
                //             ChiTietDonHang: true
                //         }
                //     }
                // }
            });

            if (data.length === 0) {
                return successCode(res, data, 200, "Chưa có người dùng nào được thêm vào dữ liệu!")
            }

            successCode(res, data, 200, "Thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: user.service.ts:44 ~ UserService ~ getInforAllUser ~ exception:", exception);
            errorCode(res, "Lỗi BE")
        }
    }


    // ============================================
    //    LẤY DANH SÁCH NGƯỜI DÙNG PHÂN TRANG
    // ============================================
    async getListUserPanigation(vaiTroID: number, pageIndex: number, pageSize: number, search: string, res: Response) {
        try {
            if (pageIndex <= 0 || pageSize <= 0) {
                return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
            }

            let index = (pageIndex - 1) * pageSize;

            if (+vaiTroID === 0) {
                let total = await this.model.nguoiDung.findMany({
                    where: {
                        ho_ten: {
                            contains: search   // LIKE '%nameProduct%'
                        },
                        isDelete: false
                    }
                });

                if (total.length === 0) {
                    return successCode(res, total, 200, "Chưa có người dùng nào được thêm vào dữ liệu")
                }

                let data = await this.model.nguoiDung.findMany({
                    skip: +index,     // Sử dụng skip thay vì offset
                    take: +pageSize,  // Sử dụng take thay vì limit
                    where: {
                        ho_ten: {
                            contains: search   // LIKE '%nameProduct%'
                        },
                        isDelete: false
                    },
                    include: {
                        DonHang: {
                            include: {
                                ChiTietDonHang: true
                            }
                        }
                    }
                });

                if (data.length === 0) {
                    return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu người dùng được tìm thấy")
                }

                return successCodeProduct(res, data, 200, total.length, "Thành công !")
            }

            let total = await this.model.nguoiDung.findMany({
                where: {
                    vai_tro_id: +vaiTroID,
                    ho_ten: {
                        contains: search   // LIKE '%nameProduct%'
                    },
                    isDelete: false
                }
            });

            if (total.length === 0) {
                return successCode(res, total, 200, "Không có dữ liệu người dùng được tìm thấy !")
            }

            let data = await this.model.nguoiDung.findMany({
                skip: +index,     // Sử dụng skip thay vì offset
                take: +pageSize,  // Sử dụng take thay vì limit
                where: {
                    ho_ten: {
                        contains: search   // LIKE '%nameProduct%'
                    },
                    vai_tro_id: +vaiTroID,
                    isDelete: false
                },
                include: {
                    DonHang: {
                        include: {
                            ChiTietDonHang: true
                        }
                    }
                }
            });

            if (data.length === 0) {
                return successCodeProduct(res, data, 200, total.length, "Không tìm thấy dữ liệu bạn đang tìm !")
            }

            successCodeProduct(res, data, 200, total.length, "Thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: product.service.ts:109 ~ ProductService ~ getAllProductsByTypeId ~ exception:", exception);
            errorCode(res, "Lỗi BE")
        }
    }

    // ============================================
    //            GET ALL USER SUMARY
    // ============================================
    async getUserSummary(res: Response) {
        try {
            const totalUser = await this.model.nguoiDung.findMany({
                where: {
                    isDelete: false
                }
            });

            const content = {
                totalUser: totalUser.length
            }

            successCode(res, content, 200, "Thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: order.service.ts:188 ~ OrderService ~ getOrderSummary ~ exception:", exception);
            errorCode(res, "Lỗi BE")
        }
    }


    // ============================================
    // LẤY THÔNG TIN CHI TIẾT NGƯỜI DÙNG BY USER_ID
    // ============================================
    async getInfoUserByUserId(id: number, res: Response) {
        try {
            let data = await this.model.nguoiDung.findFirst({
                where: {
                    nguoi_dung_id: +id,
                    isDelete: false
                },
                include: {
                    DonHang: true
                }
            });

            if (data === null) {
                return failCode(res, data, 400, "Người dùng không tồn tại !")
            }

            successCode(res, data, 200, "Thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: user.service.ts:102 ~ UserService ~ getInfoUserByUserId ~ exception:", exception);
            errorCode(res, "Lỗi BE")
        }
    }


    // ============================================
    //        TÌM TÊN NGƯỜI DÙNG THEO TÊN
    // ============================================ 
    async searchUserByName(userName: string, res: Response) {
        try {
            let data = await this.model.nguoiDung.findMany({
                where: {
                    ho_ten: {
                        contains: userName      // LIKE '%userName%'
                    },
                    isDelete: false
                }
            });

            if (data.length === 0) {
                return successCode(res, data, 200, "Không tìm thấy tên người dùng này !")
            }

            successCode(res, data, 200, "Thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: user.service.ts:111 ~ UserService ~ searchUserByName ~ exception:", exception)
            errorCode(res, "Lỗi BE")
        }
    }


    // // ====================================================
    // //      POST THÊM 1 ẢNH CỦA USER VÀO LOCAL SOURCE 
    // // ====================================================
    // async uploadImg(file: Express.Multer.File, userID: number, body: FileUploadDto_user, res: Response) {
    //   try {
    //     let { email } = body

    //     let checkUserID = await this.model.nguoiDung.findFirst({
    //       where: {
    //         nguoi_dung_id: +userID,
    //         email,
    //         isDelete: false
    //       },
    //     });

    //     if (checkUserID === null) {
    //       fs.unlink(process.cwd() + "/public/img/" + file.filename, (err) => {    // xóa file ảnh theo đường dẫn nếu người dùng ko tồn tại
    //         if (err) {
    //           console.error("Error deleting file:", err);
    //         }
    //       });

    //       return failCode(res, '', 400, "Email hoặc ID người dùng không tồn tại !")
    //     }

    //     const createdImage = await this.model.nguoiDung.update({
    //       where: {
    //         nguoi_dung_id: +userID,
    //       },
    //       data: {
    //         anh_dai_dien: file.filename,
    //         // duong_dan: process.cwd() + "/public/img/" + file.filename,
    //       }
    //     });

    //     successCode(res, file, 201, 'Thêm ảnh đại diện thành công !');
    //   }
    //   catch (exception) {
    //     console.log("🚀 ~ file: user.service.ts:234 ~ UserService ~ uploadImg ~ exception:", exception)
    //     errorCode(res, 'Lỗi BE !');
    //   }
    // }



    // ====================================================
    //      POST THÊM 1 ẢNH CỦA USER VÀO CLOUDINARY 
    // ====================================================
    async uploadImg(file: Express.Multer.File, id: number, body: FileUploadDto_user, res: Response) {
        try {


            let { email } = body

            let checkUserID = await this.model.nguoiDung.findFirst({
                where: {
                    nguoi_dung_id: +id,
                    email,
                    vai_tro_id: 2,
                    isDelete: false
                },
            });

            if (checkUserID === null) {
                return failCode(res, '', 400, "Email hoặc ID người dùng không tồn tại !");
            }

            if (!file || !file.buffer) {
                return failCode(res, '', 400, "Dữ liệu file không hợp lệ !");
            }

            // ⭐****************** CLOUDINARY **************************⭐
            const dataCloudinary = await new Promise<CloudinaryResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    },
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
            // console.log(dataCloudinary.url)
            // ************************ END *****************************


            const createdImage = await this.model.nguoiDung.update({
                where: {
                    nguoi_dung_id: +id,
                },
                data: {
                    anh_dai_dien: dataCloudinary.secure_url,
                    // duong_dan: process.cwd() + "/public/img/" + file.filename,
                }
            });

            successCode(res, dataCloudinary, 201, 'Thêm ảnh đại diện thành công !');
        }
        catch (exception) {
            console.log("🚀 ~ file: user.service.ts:234 ~ UserService ~ uploadImg ~ exception:", exception)
            errorCode(res, 'Lỗi BE !');
        }
    }


    // ============================================
    //             CẬP NHẬT NGƯỜI DÙNG 
    // ============================================  
    async updateUserById(id: string, body: UserUpdateDto, res: Response) {
        try {
            let { ho_ten, email, mat_khau, dia_chi, phuong_id, quan_id, tinh_thanh_id, so_dien_thoai, gioi_tinh } = body;

            let checkEmail = await this.model.nguoiDung.findFirst({
                where: {
                    nguoi_dung_id: +id,
                    email,
                    vai_tro_id: 2,
                    isDelete: false
                }
            });

            if (checkEmail === null) {
                return failCode(res, checkEmail, 400, "Email hoặc người dùng ID không đúng !")
            }


            const checkPhone = await this.model.nguoiDung.findFirst({
                where: {
                    so_dien_thoai,
                    NOT: {
                        nguoi_dung_id: +id // Bỏ qua người dùng hiện tại đang được cập nhật
                    }
                }
            });

            if (checkPhone) {
                return failCode(res, null, 400, "Số điện thoại này đã được sử dụng cho người dùng khác !");
            }


            let newData = await this.model.nguoiDung.update({
                where: {
                    nguoi_dung_id: +id,
                    email,
                    isDelete: false
                },
                data: {
                    ho_ten,
                    mat_khau: await bcrypt.hash(mat_khau, 10), //  thay đổi bcrypt.hashSync thành await bcrypt.hash để sử dụng hàm hash bất đồng bộ. Điều này cần thiết để tránh blocking thread chính khi mã hóa mật khẩu.
                    dia_chi,
                    phuong_id,
                    quan_id,
                    tinh_thanh_id,
                    so_dien_thoai,
                    gioi_tinh
                }
            });

            successCode(res, newData, 200, "Cập nhật thông tin thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: user.service.ts:166 ~ UserService ~ updateUserById ~ exception:", exception)
            errorCode(res, "Lỗi BE");
        }
    }


    // ============================================
    //                XÓA NGƯỜI DÙNG 
    // ============================================
    async deleteUserById(id: string, res: Response) {
        try {
            let data = await this.model.nguoiDung.findFirst({
                where: {
                    nguoi_dung_id: +id,
                    isDelete: false
                },
            });

            if (data === null) {
                return failCode(res, data, 400, "Người dùng không tồn tại !")
            }

            await this.model.nguoiDung.update({
                where: {
                    nguoi_dung_id: +id,
                },
                data: {
                    isDelete: true
                }
            });

            successCode(res, data, 200, "Đã xóa người dùng thành công !")
        }
        catch (exception) {
            console.log("🚀 ~ file: user.service.ts:120 ~ UserService ~ deleteUserById ~ exception:", exception)
            errorCode(res, "Lỗi BE")
        }
    }

}

