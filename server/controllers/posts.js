import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        // The 3 informations we need from frontend when user create
        // a post
        const { userId, description, picturePath } = req.body;

        // We find the current user using his userId
        const user = await User.findById(userId);

        const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
        });

        // We save that post in the MongoDB
        await newPost.save();

        // We find and gather all the post made by the current user
        // to be posted in the frontend timeline
        const post = await Post.find();

        // the 201 represents we created something
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        // We gather all the post to be posted in the newsfeed
        const post = await Post.find();
        
        // The 200 represents successful request
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        // We take the userId of the current user
        const { userId } = req.params

        // We gather all the post of the user for the newsfeed
        const post = await Post.find({ userId });
        
        // The 200 represents successful request
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
    
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
    
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
    
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
        }
};