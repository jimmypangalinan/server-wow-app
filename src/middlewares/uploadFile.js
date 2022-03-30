const multer = require("multer");

exports.uploadFile = (bookFile, imageFile) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === imageFile) {
        cb(null, "uploads/cover");
      } else {
        cb(null, "uploads/books");
      }
    },

    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });
  console.log(bookFile);
  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }

    if (file.fieldname === bookFile) {
      if (!file.originalname.match(/\.(epub|EPUB)$/)) {
        req.fileValidationError = {
          message: "Only epib files are allowed",
        };
        return cb(new Error("Only epub files are allowed"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMB = 100;
  const maxSize = sizeInMB * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: imageFile,
      maxCount: 1,
    },
    {
      name: bookFile,
      maxCount: 1,
    },
  ]);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (!req.files && !err) {
        return res.status(400).send({
          message: "Please select file to upload",
        });
      }

      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file size 100 MB",
          });
        }
        return res.status(400).send(err);
      }
      return next();
    });
  };
};
