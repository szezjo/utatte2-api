import multer from "multer";
import fs from "fs-extra";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirsSync('./uploads/images');
        cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
const createUserImage = upload.single('photo');

export default createUserImage;