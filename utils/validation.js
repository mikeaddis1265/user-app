import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Invalid email format').max(100, 'Email must be 100 characters or less'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(255, 'Password must be 255 characters or less'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').max(100, 'Email must be 100 characters or less'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(255, 'Password must be 255 characters or less'),
});



export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().optional(),
  category: z.string().optional(),
});


export const commentSchema = z.object({
  postId: z.number().int().positive('Post ID must be a positive integer'),
  content: z.string().min(1, 'Content is required'),
});


export const validate = (schema, data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Input data must be a valid object');
    }
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error); // Log for debugging
    if (error instanceof z.ZodError && error.errors) {
      throw new Error(error.errors.map((e) => e.message).join(', '));
    }
    throw new Error(error.message || 'Invalid input data');
  }
};