import z from "zod";

export const ApplicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  coverLetter: z.string().max(5000).optional(),
  resume: z.instanceof(File, { message: "Resume file required" }),
  agreedToTerms: z.literal(true, {
    message: "You must accept terms", 
  }),
});
