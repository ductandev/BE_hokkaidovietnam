// success => 200, 201
const successCode = (res, content, statusCode, message) => {
    res.status(statusCode).json({       // res.status(200) thiết lập mã trạng thái của phản hồi HTTP
        message,
        statusCode,
        content,
        date: new Date()
    })
}
const successCodeAuth = (res, content, token, statusCode, message) => {
    res.status(statusCode).json({       // res.status(200) thiết lập mã trạng thái của phản hồi HTTP
        message,
        statusCode,
        content,
        token,
        date: new Date()
    })
}

const successCodeProduct = (res, content, statusCode, total, message) => {
    res.status(statusCode).json({       // res.status(200) thiết lập mã trạng thái của phản hồi HTTP
        message,
        statusCode,
        content,
        total,
        date: new Date()
    })
}

// fail => 400, 401, 404
const failCode = (res, content, statusCode, message) => {
    res.status(statusCode).json({
        message,
        statusCode,
        content,
        date: new Date()
    })
}

// error => 500
const errorCode = (res, message) => {
    res.status(500).json({
        message,
        statusCode: 500,
        date: new Date()
    })
}

export {
    successCode,
    successCodeAuth,
    successCodeProduct,
    failCode,
    errorCode,
}