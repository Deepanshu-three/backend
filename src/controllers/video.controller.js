import mongoose,{ isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getAllVideos = asyncHandler( async(req, res) => {

    try{

        const videos = await Video.find({})
        console.log(videos);

        res.status(200).json(
           new ApiResponse( 200, videos,
            "Successfully fetched all vidoes")
        )

    }catch(error){
        throw new ApiError(500, `Error: ${error}`)
    }

})

export const publishVideo = asyncHandler(async (req, res) => {

    try {
        const {title, description, duration} = req.body
    
        if([title, description, duration].some((field) => field?.trim() === "")){
            throw new ApiError(400, "All feilds are required")
        }
    
        const videoLocalPath = req.files?.videoFile[0]?.path
    
        let thumbnailLocalPaht;
    
        if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0){
            thumbnailLocalPaht = req.files.thumbnail[0].path
        }
    
        if(!videoLocalPath){
            throw new ApiError(400, "Video file is required")
        }
        console.log(videoLocalPath)
        const uploadvideo = await uploadOnCloudinary(videoLocalPath)
        const uploadthumbnail = await uploadOnCloudinary(thumbnailLocalPaht)
        console.log(uploadvideo)

        const videoUpload = await Video.create({
            videoFile: uploadvideo.url,
            thumbnail: uploadthumbnail.url || "",
            title,
            description,
            duration
        })
    
        return res.status(201).json(
            new ApiResponse(200, videoUpload, "Video uploaded successfully")
        )
    } catch (error) {
        throw new ApiError(500, `Error: ${error}`)
    }

})


export const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        
        console.log(videoId)

        const video = await Video.findById(videoId)
        console.log(video)
    
        res.status(200).json(
            new ApiResponse( 200, video,
             "Video fetched Successfully")
         )
    
    } catch (error) {
        throw new ApiError(500, `Error: ${error}`)
    
    }

})

export const getComment = asyncHandler(async(req, res) => {
    const videoId = "6621f7d9707abcde5768bb86"

    const video = await Video.findById(videoId)

    res.status(201).json(
        new ApiResponse(200, video.comment, "comments fetched successfully")
    )


    
})

export const addComment = asyncHandler(async(req, res) => {
    try {
        const { comment } = req.body;
        const user = req.user;

        const commentsArr = {
            user: user,
            text: comment,
        };

        console.log(comment);
        console.log(commentsArr);
        const videoId = "6621f7d9707abcde5768bb86";
        const video = await Video.findById(videoId);

        console.log(video)
        // Add the comment to the video
        video.comment.push(commentsArr);

        // Save the changes to the database
        await video.save();

        res.status(201).json(
            new ApiResponse(200, video, "Comment added successfully")
        );
    } catch (error) {
        // Handle errors
        throw new ApiError(500, `Error: ${error}`);
    }
});

