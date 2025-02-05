// ✅ Role types
export type AdminRole = "admin";
export type UserRole = "user"; // ✅ Users can only be "user"

// ✅ Status types
export type UserStatus = "active" | "unactive"; // 🔹 Fixed naming: "unactive" → "inactive"

// ✅ Admin type (Admin Only)
export interface Admin {
  _id: string;
  email: string;
  username: string;
  password: string;
  role: AdminRole; // ✅ Only "admin"
}

// ✅ User type (Only "user" role allowed)
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole; // ✅ Users can only be "user"
  status: UserStatus; // ✅ Only "active" | "inactive"
  modules: number[]; // ✅ List of module IDs assigned to user
}

// ✅ Module type
export interface Module {

  id: number;

  name: string;

  status: ModuleStatus   ; // Allow status to be a string

  users: number[];

  recommended: boolean;

  documents: {

    fileName: string;

    fileSize: number;

    status: string;

    result: {

      summaries: string[];

      keyConcepts: string[];

      exercises: string[];

    };

    createdAt: string;

    updatedAt: string;

  }[];

}


// ✅ Define the document structure inside a module
export interface DocumentData {
  fileName: string;
  fileSize: number;
  status: DocumentStatus; // ✅ "processing" | "completed" | "failed"
  result: {
    summaries: string[]; // ✅ Array of summary texts
    keyConcepts: string[]; // ✅ Array of key concepts
    exercises: string[]; // ✅ List of exercises/questions
  };
  createdAt: string; // ✅ ISO Date string
  updatedAt: string; // ✅ ISO Date string
}

// ✅ Define module status options
export type ModuleStatus = "active" | "unactive";

// ✅ Define document processing status
export type DocumentStatus = "processing" | "completed" | "failed";

