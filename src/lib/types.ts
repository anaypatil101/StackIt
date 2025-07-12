
// This interface is for client-side user objects, which won't include sensitive data.
// It can also be used for populated fields from Mongoose.
export interface User {
  _id: string;
  name: string;
  avatarUrl: string;
};

export interface Answer {
  _id: string;
  author: User;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string; // Dates are stringified when passed from server to client
};

export interface Question {
  _id: string;
  title: string;
  description:string;
  tags: string[];
  author: User;
  votes: number;
  answers: Answer[];
  createdAt: string; // Dates are stringified when passed from server to client
};

// For JWT payload
export interface DecodedUser {
  id: string;
  name: string;
  avatarUrl: string;
}
