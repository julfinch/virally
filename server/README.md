# Socially-Fullstack Back-end
  
## Table of contents

- [My Process](#process)
- [Author](#author)


## My Process
1.  **Create the server folder and install the packages**

    ```shell
    mkdir socially-fullstack
	cd socially-fullstack
	mkdir server
	cd server
	npm init -y
	npm i express body-parser bcrypt cors dotenv gridfs-stream multer multer-gridfs-storage helmet morgan jsonwebtoken mongoose
    ```

1.  **Open package.json and add type**

	This is so that we can use import statements instead of require statements.
    ```shell
    "type": "module",
    ```
	
	Under "scripts" and below "test", add "start"
	```shell
	"start": "nodemon index.js"
	```

1.  **Create index.js under server folder**

    Paste the following inside index.js

    ```shell
    import express from "express"
	import bodyParser from "body-parser"
	import mongoose from "mongoose"
	import cors from "cors"
	import dotenv from "dotenv"
	import multer from "multer"
	import helmet from "helmet"
	import morgan from "morgan"
	import path from "path"
	import { fileURLToPath } from "url"

	/* CONFIGURATIONS */
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	dotenv.config();
	const app = express();
	app.use(express.json());
	app.use(helmet());
	app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
	app.use(morgan("common"));
	app.use(bodyParser.json({ limit: "30mb", extended: true }));
	app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
	app.use(cors());
	app.use("/assets", express.static(path.join(__dirname, "public/assets")));

	/* FILE STORAGE */
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "public/assets");
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		},
	});
	const upload = multer({ storage });

    ```

1.  **Set-up MongoDB account in the website**

	From here, I just created a new project to my existing MongoDB account to be used for Socially database. Set-up Atlas. After that:
	
    1. Connect
	2. Connect your application
	3. Copy the connection string provided in the box
	4. Create a .env  insider server folder and replace <password> with your password.
	```shell
	MONGO_URL="mongodb+srv://julfinch:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority"
	PORT=3001
    ```
	

1.  **Continue setting up the index.js now that we have connected MongooseDB**
	
	The port 6001 is a backup just in case 3001 doesn't work
	
    ```shell
    /* MONGOOSE SETUP */
	const PORT = process.env.PORT || 6001;
	mongoose
	  .connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	  })
	  .then(() => {
		app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

		/* ADD DATA ONE TIME */
		// User.insertMany(users);
		// Post.insertMany(posts);
	  })
	  .catch((error) => console.log(`${error} did not connect`));
    ```
	
	Run npm run start and it should show Server Port: 3001
	```shell
	npm run start
	```

1.  **SET-UP REGISTRATION**

	This is so that we can use import statements instead of require statements.
	
    ```shell
    /* ROUTES WITH FILES */
	app.post("/auth/register", upload.single("picture"), register);
    ```
	
	Import register 
	```shell
	import { register } from "./controllers/auth.js"
	```
	
	Create controllers folder inside server folder. Inside controllers folder, create a file auth.js
	```shell
	import bcrypt from "bcrypt"
	import jwt from "jsonwebtoken"
	import User from "../models/User.js"
	```
	
	Create models folder inside server folder. Inside models folder, create a file named User.js
	```shell
	import mongoose from "mongoose"

	const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    },
    { timestamps: true }
	);

	const User = mongoose.model("User", UserSchema);
	export default User;
	```

	Go back to auth.js and continue writing the codes below:
	Calling to Mongoose Database needs to be asynchronous, the same way when we do an API call from frontend to backend, then backend to database.
	**req** provides the request body that we get from the frontend and **res** is the response we send back to the frontend. Express provides this by default.
	
	Grab the firstName,lastName,email,password,picturePath,friends,location,occupation and destructure when users try to register.
	```shell
	import bcrypt from "bcrypt"
	import jwt from "jsonwebtoken"
	import User from "../models/User.js"
	
	/* REGISTER USER */
	export const register = async (req, res) => {
	  try {
		const {
		  firstName,
		  lastName,
		  email,
		  password,
		  picturePath,
		  friends,
		  location,
		  occupation,
		} = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
		  firstName,
		  lastName,
		  email,
		  password: passwordHash,
		  picturePath,
		  friends,
		  location,
		  occupation,
		  viewedProfile: Math.floor(Math.random() * 10000),
		  impressions: Math.floor(Math.random() * 10000),
		});
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	  } catch (err) {
		res.status(500).json({ error: err.message });
	  }
	};
	```
	
	
1.  **Copy public folder from the repo to server folder**

1.  **SET-UP LOG-IN - AUTHROUTES**

	Go to index.js and import authRoutes.
    ```shell
    import authRoutes from "./routes/auth.js";
    ```
	
	Under "/* ROUTES WITH FILES */" , add the code below:
	```shell
	/* ROUTES */
	app.use("/auth", authRoutes);
	```
	
	Go to server folder and create a new folder called **routes** and inside it, create a file called **auth.js** and paste the code below:
	```shell
	import express from "express"
	import { login } from "../controllers/auth.js"

	const router = express.Router();

	router.post("/login", login);

	export default router;
	```
	
	Go back to the **auth.js** inside controllers folder to set-up login function
	```shell
	/* LOGGING IN */
	export const login = async (req, res) => {
	  try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: "User does not exist. " });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		delete user.password;
		res.status(200).json({ token, user });
	  } catch (err) {
		res.status(500).json({ error: err.message });
	  }
	};
	```
	
	Open .env file and add a **JWT_SECRET**
	```shell
	JWT_SECRET="WriteAnyStringHere"
	```
		
1.  **SET-UP AUTHORIZATION**

	Insider server folder, create a new folder named **middleware** and create a new file inside it called **auth.js**.
    ```shell
    import jwt from "jsonwebtoken";

	export const verifyToken = async (req, res, next) => {
	  try {
		let token = req.header("Authorization");

		if (!token) {
		  return res.status(403).send("Access Denied");
		}

		if (token.startsWith("Bearer ")) {
		  token = token.slice(7, token.length).trimLeft();
		}

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	  } catch (err) {
		res.status(500).json({ error: err.message });
	  }
	};
    ```
	
1.  **USER ROUTES**

	Open index.js and under /* ROUTES */, add the userRoutes
    ```shell
    /* ROUTES */
	app.use("/auth", authRoutes);
	app.use("/users", userRoutes);
    ```
	
	Import userRoutes above
	```shell
	import userRoutes from "./routes/users.js";
	```
	
	Under **routes folder**, create a new file called **users.js**
	```shell
	import express from "express";
	import {
	  getUser,
	  getUserFriends,
	  addRemoveFriend,
	} from "../controllers/users.js";
	import { verifyToken } from "../middleware/auth.js";

	const router = express.Router();

	/* READ */
	router.get("/:id", verifyToken, getUser);
	router.get("/:id/friends", verifyToken, getUserFriends);

	/* UPDATE */
	router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

	export default router;
	```
	
	Go to **controllers** folder and create a file called **users.js**

	```shell
	import User from "../models/User.js";

	/* READ */
	// In the getUser, we grab the id of the user from req.params(1st line) 
	// and then we grab that current user and find that specific user using 
	// his id(2nd line) before we finally send all information of that user 
	// to the frontend(3rd line).

	export const getUser = async (req, res) => {
		try {
			// we grab the id of the user from req.params
			const { id } = req.params;

			// we grab that current user and find that specific user using his id
			const user = await User.findById(id);

			// before we finally send all information of that user to the frontend
			res.status(200).json(user);
		} catch (err) {
			res.status(404).json({ message: err.message });
		}
	};


	export const getUserFriends = async (req, res) => {
		try {
			// Grab the id of the current user and find it from the list of Users
			const { id } = req.params;
			const user = await User.findById(id);

			// We use Promise.all because we are going to make multiple
			// API calls to the databse. Based from the data that we get 
			// from the current user, we map his list of friends and grab 
			// each id of the friends that the user have and grab all the
			//  information of all the friends based on their IDs.
			const friends = await Promise.all(
			user.friends.map((id) => User.findById(id))
			);

			// Now that we have a list of friends, we map each of them to get
			// each of their individual data like id, firstName, lastName, etc.
			// Since it's and array, we format them base on what frontend needs
			// by returning a object
			const formattedFriends = friends.map(
			({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
			}
			);
			res.status(200).json(formattedFriends);
		} catch (err) {
			res.status(404).json({ message: err.message });
		}
	};

	/* UPDATE */
	export const addRemoveFriend = async (req, res) => {
		try {
			const { id, friendId } = req.params;
			const user = await User.findById(id);
			const friend = await User.findById(friendId);
		
			if (user.friends.includes(friendId)) {
				user.friends = user.friends.filter((id) => id !== friendId);
				friend.friends = friend.friends.filter((id) => id !== id);
			} else {
				user.friends.push(friendId);
				friend.friends.push(id);
			}
			await user.save();
			await friend.save();
		
			const friends = await Promise.all(
				user.friends.map((id) => User.findById(id))
			);
			const formattedFriends = friends.map(
				({ _id, firstName, lastName, occupation, location, picturePath }) => {
				return { _id, firstName, lastName, occupation, location, picturePath };
				}
			);
		
			res.status(200).json(formattedFriends);
			} catch (err) {
			res.status(404).json({ message: err.message });
		}
	};
	```
	
1.  **USER ROUTES**
	
	Go back to **index.js** and add posts route
	```shell
	app.use("/posts", postRoutes);
	```
	
	Create an app.post under ** /* ROUTES WITH FILES */ **
	```shell
	app.post("/posts", verifyToken, upload.single("picture"), createPost);
	```

	Import {verifyToken} for posts above
	```shell
	import { verifyToken } from "./middleware/auth.js";
	```
	
	Import {createPost} above
	```shell
	import { createPost } from "./controllers/posts.js";
	```
	
	Under **routes** folder, create a new file called **posts.js**
	```shell
	import express from "express";
	import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
	import { verifyToken } from "../middleware/auth.js";

	const router = express.Router();

	/* READ */
	router.get("/", verifyToken, getFeedPosts);
	router.get("/:userId/posts", verifyToken, getUserPosts);

	/* UPDATE */
	router.patch("/:id/like", verifyToken, likePost);

	export default router;
	```
	
	Under **schema** folder, create a new file called **Post.js**
	```shell
	import mongoose from "mongoose";

	const postSchema = mongoose.Schema(
	  {
		userId: {
		  type: String,
		  required: true,
		},
		firstName: {
		  type: String,
		  required: true,
		},
		lastName: {
		  type: String,
		  required: true,
		},
		location: String,
		description: String,
		picturePath: String,
		userPicturePath: String,
		likes: {
		  type: Map,
		  of: Boolean,
		},
		comments: {
		  type: Array,
		  default: [],
		},
	  },
	  { timestamps: true }
	);

	const Post = mongoose.model("Post", postSchema);

	export default Post;
	```
	
	Under **controllers** folder, create a new file called **posts.js**
	```shell
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
	```
	
	Run npm run start to check if there are errors
	

1.  **TESTING THE APP USING MOCK DATA**

	Go to the **server** folder and create a new folder called **data** and create a new file under it called **index.js**. Paste the mock data so we don't have to start a blank slate and be able to test the app right away.
	```shell
	import mongoose from "mongoose";

	const userIds = [
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	  new mongoose.Types.ObjectId(),
	];

	export const users = [
	  {
		_id: userIds[0],
		firstName: "test",
		lastName: "me",
		email: "aaaaaaa@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p11.jpeg",
		friends: [],
		location: "San Fran, CA",
		occupation: "Software Engineer",
		viewedProfile: 14561,
		impressions: 888822,
		createdAt: 1115211422,
		updatedAt: 1115211422,
		__v: 0,
	  },
	  {
		_id: userIds[1],
		firstName: "Steve",
		lastName: "Ralph",
		email: "thataaa@gmail.com",
		password: "$!FEAS@!O)_IDJda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p3.jpeg",
		friends: [],
		location: "New York, CA",
		occupation: "Degenerate",
		viewedProfile: 12351,
		impressions: 55555,
		createdAt: 1595589072,
		updatedAt: 1595589072,
		__v: 0,
	  },
	  {
		_id: userIds[2],
		firstName: "Some",
		lastName: "Guy",
		email: "someguy@gmail.com",
		password: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
		picturePath: "p4.jpeg",
		friends: [],
		location: "Canada, CA",
		occupation: "Data Scientist Hacker",
		viewedProfile: 45468,
		impressions: 19986,
		createdAt: 1288090662,
		updatedAt: 1288090662,
		__v: 0,
	  },
	  {
		_id: userIds[3],
		firstName: "Whatcha",
		lastName: "Doing",
		email: "whatchadoing@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p6.jpeg",
		friends: [],
		location: "Korea, CA",
		occupation: "Educator",
		viewedProfile: 41024,
		impressions: 55316,
		createdAt: 1219214568,
		updatedAt: 1219214568,
		__v: 0,
	  },
	  {
		_id: userIds[4],
		firstName: "Jane",
		lastName: "Doe",
		email: "janedoe@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p5.jpeg",
		friends: [],
		location: "Utah, CA",
		occupation: "Hacker",
		viewedProfile: 40212,
		impressions: 7758,
		createdAt: 1493463661,
		updatedAt: 1493463661,
		__v: 0,
	  },
	  {
		_id: userIds[5],
		firstName: "Harvey",
		lastName: "Dunn",
		email: "harveydunn@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p7.jpeg",
		friends: [],
		location: "Los Angeles, CA",
		occupation: "Journalist",
		viewedProfile: 976,
		impressions: 4658,
		createdAt: 1381326073,
		updatedAt: 1381326073,
		__v: 0,
	  },
	  {
		_id: userIds[6],
		firstName: "Carly",
		lastName: "Vowel",
		email: "carlyvowel@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p8.jpeg",
		friends: [],
		location: "Chicago, IL",
		occupation: "Nurse",
		viewedProfile: 1510,
		impressions: 77579,
		createdAt: 1714704324,
		updatedAt: 1642716557,
		__v: 0,
	  },
	  {
		_id: userIds[7],
		firstName: "Jessica",
		lastName: "Dunn",
		email: "jessicadunn@gmail.com",
		password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
		picturePath: "p9.jpeg",
		friends: [],
		location: "Washington, DC",
		occupation: "A Student",
		viewedProfile: 19420,
		impressions: 82970,
		createdAt: 1369908044,
		updatedAt: 1359322268,
		__v: 0,
	  },
	];

	export const posts = [
	  {
		_id: new mongoose.Types.ObjectId(),
		userId: userIds[1],
		firstName: "Steve",
		lastName: "Ralph",
		location: "New York, CA",
		description: "Some really long random description",
		picturePath: "post1.jpeg",
		userPicturePath: "p3.jpeg",
		likes: new Map([
		  [userIds[0], true],
		  [userIds[2], true],
		  [userIds[3], true],
		  [userIds[4], true],
		]),
		comments: [
		  "random comment",
		  "another random comment",
		  "yet another random comment",
		],
	  },
	  {
		_id: new mongoose.Types.ObjectId(),
		userId: userIds[3],
		firstName: "Whatcha",
		lastName: "Doing",
		location: "Korea, CA",
		description:
		  "Another really long random description. This one is longer than the previous one.",
		picturePath: "post2.jpeg",
		userPicturePath: "p6.jpeg",
		likes: new Map([
		  [userIds[7], true],
		  [userIds[4], true],
		  [userIds[1], true],
		  [userIds[2], true],
		]),
		comments: [
		  "one more random comment",
		  "and another random comment",
		  "no more random comments",
		  "I lied, one more random comment",
		],
	  },
	  {
		_id: new mongoose.Types.ObjectId(),
		userId: userIds[4],
		firstName: "Jane",
		lastName: "Doe",
		location: "Utah, CA",
		description:
		  "This is the last really long random description. This one is longer than the previous one.",
		picturePath: "post3.jpeg",
		userPicturePath: "p5.jpeg",
		likes: new Map([
		  [userIds[1], true],
		  [userIds[6], true],
		  [userIds[3], true],
		  [userIds[5], true],
		]),
		comments: [
		  "one more random comment",
		  "I lied, one more random comment",
		  "I lied again, one more random comment",
		  "Why am I doing this?",
		  "I'm bored",
		],
	  },
	  {
		_id: new mongoose.Types.ObjectId(),
		userId: userIds[5],
		firstName: "Harvey",
		lastName: "Dunn",
		location: "Los Angeles, CA",
		description:
		  "This is the last really long random description. This one is longer than the previous one. Man I'm bored. I'm going to keep typing until I run out of things to say.",
		picturePath: "post4.jpeg",
		userPicturePath: "p7.jpeg",
		likes: new Map([
		  [userIds[1], true],
		  [userIds[6], true],
		  [userIds[3], true],
		]),
		comments: [
		  "I lied again, one more random comment",
		  "Why am I doing this?",
		  "I'm bored",
		  "I'm still bored",
		  "All I want to do is play video games",
		  "I'm going to play video games",
		],
	  },
	  {
		_id: new mongoose.Types.ObjectId(),
		userId: userIds[6],
		firstName: "Carly",
		lastName: "Vowel",
		location: "Chicago, IL",
		description:
		  "Just a short description. I'm tired of typing. I'm going to play video games now.",
		picturePath: "post5.jpeg",
		userPicturePath: "p8.jpeg",
		likes: new Map([
		  [userIds[1], true],
		  [userIds[3], true],
		  [userIds[5], true],
		  [userIds[7], true],
		]),
		comments: [
		  "I lied again, one more random comment",
		  "Why am I doing this?",
		  "Man I'm bored",
		  "What should I do?",
		  "I'm going to play video games",
		],
	  },
	  {
		_id: new mongoose.Types.ObjectId(),
		userId: userIds[7],
		firstName: "Jessica",
		lastName: "Dunn",
		location: "Washington, DC",
		description:
		  "For the last time, I'm going to play video games now. I'm tired of typing. I'm going to play video games now.",
		picturePath: "post6.jpeg",
		userPicturePath: "p9.jpeg",
		likes: new Map([
		  [userIds[1], true],
		  [userIds[2], true],
		]),

		comments: [
		  "Can I play video games now?",
		  "No let's actually study",
		  "Never mind, I'm going to play video games",
		  "Stop it.",
		  "Michael, stop it.",
		],
	  },
	];
	```
	
	Go to **index.js** and import the following:
	```shell
	import User from "./models/User.js";
	import Post from "./models/Post.js";
	import { users, posts } from "./data/index.js";
	```
	
	Manually add the mock data under ** /* MONGOOSE SETUP */ ** one time only.
	```shell
	    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
	```
	
	Import {createPost} above
	```shell
	import { createPost } from "./controllers/posts.js";
	```
	
---
 
## Author

- Twitter - [@julfinch](https://www.twitter.com/julfinch)
