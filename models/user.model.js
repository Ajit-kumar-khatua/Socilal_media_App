const mongoose=require("mongoose")


const userSchema=mongoose.Schema({
        name: String,
        email: String,
        password: String,
        dob: Date,
        bio: String,
        posts: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        friendRequests: [{ type: Object, ref: 'user' }]    
})

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}