// utils/responseHandler.js
const responseHandler = {
  success: (res, message = "Success", data = null, code = 200) => {
    return res.status(code).json({
      success: true,
      message,
      data,
    });
  },

  created: (res, message = "Resource created successfully", data = null) => {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  },

  badRequest: (res, message = "Bad request", error = null) => {
    return res.status(400).json({
      success: false,
      message,
      error,
    });
  },

  unauthorized: (res, message = "Unauthorized", error = null) => {
    return res.status(401).json({
      success: false,
      message,
      error,
    });
  },

  forbidden: (res, message = "Forbidden", error = null) => {
    return res.status(403).json({
      success: false,
      message,
      error,
    });
  },

  notFound: (res, message = "Not found", error = null) => {
    return res.status(404).json({
      success: false,
      message,
      error,
    });
  },

  serverError: (res, message = "Internal server error", error = null) => {
    console.error("Server Error:", error); // untuk log error di console
    return res.status(500).json({
      success: false,
      message,
      error: error?.message || error,
    });
  },
};

module.exports= responseHandler;
// atau kalau pakai CommonJS
// module.exports = responseHandler;
