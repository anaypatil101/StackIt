export type User = {
  name: string;
  avatarUrl: string;
};

export type Answer = {
  id: string;
  author: User;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: Date;
};

export type Question = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: User;
  votes: number;
  answers: Answer[];
  createdAt: Date;
};
