const express=require("express")
const bcrypt=require("bcrypt")
const { UserModel } = require("../models/user.model")
const { PostModel } = require("../models/post.model")
require("dotenv").config()


const apiRouter=express.Router()

apiRouter.get("/",(req,res)=>{
    res.send("All Good")
})

apiRouter.post("/register",async (req,res)=>{
      let {name,email,password,bio,dob,posts,friends,friendRequests}=req.body
      try {
        let user=await UserModel.find({email})
        if(user.length==0){
            bcrypt.hash(password,5,async (err,hash_password) => {
                if(err){
                   console.log(err)
                }else{
                   let user=new UserModel({name,email,password:hash_password,bio,dob,posts,friends,friendRequests})
                   await user.save()
                   res.status(201).send({"msg":"User Register Sucessfully"})
                }
           })

        }else{
            res.send("Email Id already registered.")
        }
        
      } catch (error) {
        console.log("Error while registering")
        res.send({"msg":error})
      }
      
})

apiRouter.get("/users",async (req,res)=>{
    try {
        let users= await UserModel.find()
        res.send(users)
        
    } catch (error) {
        console.log(error)
        res.send("Error while getting user Details")
    }
})

apiRouter.post("/users/:id/friends", async (req,res)=>{
    let id=req.params.id
    let {friendId}=req.body
    try {
        let user=await UserModel.find({_id:id})
        let obj={friendId,status:"pending"}
        user[0].friendRequests.push(obj)
        let payload=user[0]
        await UserModel.findByIdAndUpdate({_id:id},payload)
         res.send(user)
        
    } catch (error) {
        console.log(error)
        res.send("Error while sending friend Request")
    }
})

apiRouter.patch("/users/:id/friends/:friendId",async (req,res)=>{
      let {id,friendId}=req.params
      let {status}=req.body
      try {
        let user=await UserModel.find({_id:id})
        let friendRequests=user[0].friendRequests

        for(let i=0;i<friendRequests.length;i++){
            if(friendRequests[i].friendId==friendId){
               if(status=="Accept"){
                user[0].friends.push(friendId)
                let payload=user[0]
                  await UserModel.findByIdAndUpdate({_id:id},payload)
                  res.send("Accept Friend request")
               }else{
                 res.send("Reject Friend Request")
               }
            }
        }
      } catch (error) {
          console.log(error)
          res.send("error while accepting friend request")
      }
})

apiRouter.get("/users/:id/friends",async (req,res)=>{
    let id=req.params.id
    try {
        let user=await UserModel.find({_id:id})
        let arr=[]
        let friends=user[0].friends
         for(let i=0;i<friends.length;i++){
            let friendUser=await UserModel.findById(friends[i])
            arr.push(friendUser)
         }
        res.send(arr)
    } catch (error) {
        console.log(error)
    }
})

apiRouter.post("/posts",async (req,res)=>{
    let {user,text,image,likes,comments}=req.body
    try {
        let createdAt=Date.now()
        let post=await PostModel.insertMany({user,text,image,createdAt,likes,comments})
        let userData=await UserModel.find({_id:user})
        userData[0].posts.push(post[0]._id)
        let payload=userData[0]
        await UserModel.findByIdAndUpdate({_id:user},payload)
        res.send("post created sucessfully.")
    } catch (error) {
        console.log(error)
        res.send("error while post the data")
    }
})

apiRouter.get("/posts",async (req,res)=>{
    try {
        let posts=await PostModel.find()
        res.send(posts)
        
    } catch (error) {
        console.log(error)
        res.send("Error While Getting all Posts")
    }
})

apiRouter.patch("/posts/:id",async (req,res)=>{
    let id=req.params.id
    let payload=req.body
    try {
        await PostModel.findByIdAndUpdate({_id:id},payload)
        res.send("Posts Data Update Sucessfully.")
        
    } catch (error) {
       console.log(error)
       res.send("error while updating posts data")   
    }
})

apiRouter.delete("/posts/:id",async (req,res)=>{
    let id=req.params.id
    try {
        await PostModel.findByIdAndDelete({_id:id})
        res.send("Posts Data Delete Sucessfully.")
        
    } catch (error) {
       console.log(error)
       res.send("error while updating posts data")   
    }
})

apiRouter.post("/posts/:id/like",async (req,res)=>{
    let id=req.params.id
    let likeUserId=req.body
    try {
        let post=await PostModel.findById(id)
        post.likes.push(likeUserId)
        await PostModel.findByIdAndUpdate({_id:id},post)
        res.send("User Like the post")
        
    } catch (error) {
        console.log(error)
        res.send("error while like a post") 
    }
})


module.exports={
    apiRouter
}