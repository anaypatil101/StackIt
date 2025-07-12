
// This file is no longer used for primary data but can be kept for reference or testing.
import type { User } from './types';

export const users: { [key: string]: Omit<User, '_id'> } = {
  currentUser: { name: 'Current User', avatarUrl: 'https://placehold.co/40x40/9C27B0/FFFFFF.png?text=CU'},
  jane: { name: 'Jane Doe', avatarUrl: 'https://placehold.co/40x40/64B5F6/FFFFFF.png?text=JD' },
  john: { name: 'John Smith', avatarUrl: 'https://placehold.co/40x40/4CAF50/FFFFFF.png?text=JS' },
  alex: { name: 'Alex Ray', avatarUrl: 'https://placehold.co/40x40/F44336/FFFFFF.png?text=AR' },
};
