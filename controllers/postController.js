import { Post } from '../models/post.js';

async function getAllPosts(req, res, next) {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
    const { title, content } = req.body;
    const userId = req.user?.userId; // Ensure userId is correctly extracted
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      const post = await Post.create({ title, content, userId });
      res.status(201).json(post);
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  }
  
//   async function getPostById(req, res, next) {
//     const { id } = req.params;
  
//     try {
//       const post = await Post.findByPk(id);
//       if (!post) {
//         return res.status(404).json({ message: 'Post not found' });
//       }
  
//       res.json(post);
//     } catch (error) {
//       next(error);
//     }
//   }

async function updatePost(req, res, next) {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title;
    post.content = content;
    await post.save();
    
    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export {
  getAllPosts,
  
  createPost,
  updatePost,
  deletePost
};
