import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js"
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import ApiResponse from "../utils/apiresponce.js";
import { response } from "express";

const registerUser=asyncHandler(async (req,res)=>{
    // get user detail from fronted
    // validation 
    // check if user already exists:
    // check image,avatar
    // upload them to cloundiry
    // create user object 
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const {fullname,username,email,password}=req.body
    console.log(fullname,email);

    if (
        [fullname,email,username,password].some((field)=>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if (existedUser){
        throw new ApiError(409,"User with email already exists")
    }

    const avatarlocalPath=req.files?.avatar[0]?.path
    const coverImagelocalPath=req.files?.coverImage[0]?.path
    if(!avatarlocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarlocalPath)
    const coverImage=await uploadOnCloudinary(coverImagelocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()

    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshtoken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while regiter a user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
    
})

export default registerUser