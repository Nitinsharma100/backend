import asyncHandler from "../utils/asynchandler.js";

const registerUser=asyncHandler(async (req,res)=>{
    res.status(201).json({
        message:"success"
    })
})

export default registerUser