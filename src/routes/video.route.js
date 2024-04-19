import {Router} from 'express'

import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {addComment, getAllVideos, getComment, getVideoById, publishVideo} from '../controllers/video.controller.js'

const router = Router();
router.use(verifyJWT)


router.route("/").get(getAllVideos).post(

    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishVideo

)

router.route("/getComments").get(getComment)
router.get("/:videoId", getVideoById)

router.route("/comment/:videoId").post(addComment)



export default router