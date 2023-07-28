import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { awsBucket, awsRegion } from "../../config/index.js";

const s3 = new aws.S3({
    region: awsRegion,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        acl: "public-read",
        s3: s3,
        bucket: awsBucket,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file["fieldname"] });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file["originalname"]);
        },
        contentType: function (req, file, cb) {
            cb(null, file["mimetype"]);
        },
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
});

export default upload;
