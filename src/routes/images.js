const aws = require('aws-sdk');
const router = require('express').Router()

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, 'misImagenes/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const sessionTokenaws = process.env.AWS_SESSION_TOKEN;


async function getImages(){
    try {

        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId : accessKeyId,
            secretAccessKey : secretAccessKey, 
            region : region,
            sessionToken : sessionTokenaws
        });

        const s3 = new aws.S3();
        const response = await s3.listObjectsV2({
            Bucket : bucketName
        }).promise();
        
        // console.log(response);
        return response;

    } catch (e) {
        console.log('Something went wrong getting the image', e);
    }
}

// upload file to s3
function uploadFile(file) {
    try {

        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId : accessKeyId,
            secretAccessKey : secretAccessKey, 
            region : region,
            sessionToken : sessionTokenaws
        });

        const s3 = new aws.S3();
        const fileStream = fs.createReadStream(file.path)
        const uploadParams = {
            Bucket : bucketName,
            Body: fileStream,
            Key: file.filename
        }
    
        return s3.upload(uploadParams).promise()


    } catch (e) {
        console.log('Something wrong uploading the image', e);
    }


}

router.route('/', upload.single('photo') ).post( (req, res , next) => {
    // get file from file system.
    
    console.log(req.file)
    // const result = await uploadFile(file)
    // console.log(result)

    res.status(200);
})

router.route('/').get(async (req, res) =>  {

    imagesList = await getImages();
    // console.log(imagesList.Contents);
    // res.set('Content-Type', 'text/html')

    // html = imagesListContents.map(e => 
    //     `<li>${e['Key']}</li>`
    //     ).join();
    
    // html = '<ul>' + html +'</ul>'  
    // console.log(html);  
    res.send({'images' : imagesList.Contents});

})
  

module.exports = router