import Posts from '../models/posts.Model.js'
import User from '../models/user.Model.js'

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body
    const user = await User.findById(userId)
    const newPosts = new Posts({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: []
    })
    await newPosts.save()

    const posts = await Posts.find()
    res.status(201).json(posts)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

/* READ */
export const getPosts = async (req, res) => {
  try {
    const posts = await Posts.find()
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Posts.find({ userId })
    res.status(200).json(posts)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const posts = await Posts.findById(id)
    const isLiked = posts.likes.get(userId)

    if (isLiked) {
      posts.likes.delete(userId)
    } else {
      posts.likes.set(userId, true)
    }

    const updatedPosts = await Posts.findByIdAndUpdate(id, { likes: posts.likes }, { new: true })

    res.status(200).json(updatedPosts)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
