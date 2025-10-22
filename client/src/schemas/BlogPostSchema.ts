import z from "zod";

export const BlogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().min(1, "At least one tag is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  //readTime: z.string().min(1, "Read time is required"),
 image: z
  .string()
  .url("Valid image URL required")
  .or(z.literal("")), // allow empty string during editing
  timestamp: z.number(),
});
