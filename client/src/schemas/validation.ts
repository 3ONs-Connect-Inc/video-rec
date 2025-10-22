import { z } from "zod";




export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    linkedin: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // it's optional
          return /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/.test(
            val
          );
        },
        {
          message:
            "Must be a valid LinkedIn profile URL (e.g. https://linkedin.com/in/your-name)",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const validateFile = (file: File, type: "step" | "pdf") => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const minSize = 1024; // 1KB

  if (file.size > maxSize) {
    return `File size exceeds 50MB limit. Current size: ${(
      file.size /
      1024 /
      1024
    ).toFixed(2)}MB`;
  }

  if (file.size < minSize) {
    return "File appears to be corrupted or too small";
  }

  if (type === "step") {
    const validExtensions = [".step", ".stp"];
    if (!validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      return "Please upload a valid STEP file (.step or .stp)";
    }
  }

  if (type === "pdf") {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return "Please upload a valid PDF file";
    }
    if (file.type !== "application/pdf") {
      return "File type is not recognized as PDF";
    }
  }

  return "";
};

export const validateSubmission = (
  title: string,
  stepFile: File | null,
  pdfFile: File | null,
  explanation: string
) => {
  const newErrors = {
    title: "",
    stepFile: "",
    pdfFile: "",
    explanation: "",
    general: "",
  };

  if (!stepFile) {
    newErrors.stepFile = "STEP file is required";
  }

  if (!pdfFile) {
    newErrors.pdfFile = "PDF file is required";
  }

  if (!title.trim()) {
    newErrors.title = "Project title is required";
  } else if (title.trim().length < 3) {
    newErrors.title = "Title must be at least 3 characters long";
  } else if (title.trim().length > 100) {
    newErrors.title = "Title must not exceed 100 characters";
  }

  if (!explanation.trim()) {
    newErrors.explanation = "Project explanation is required";
  } else if (explanation.trim().length < 50) {
    newErrors.explanation = "Explanation must be at least 50 characters long";
  } else if (explanation.trim().length > 2000) {
    newErrors.explanation = "Explanation must not exceed 2000 characters";
  }

  return newErrors;
};
