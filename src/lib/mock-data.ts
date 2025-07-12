import type { User, Question, Answer } from './types';

export const users: { [key: string]: User } = {
  jane: { name: 'Jane Doe', avatarUrl: 'https://placehold.co/40x40/64B5F6/FFFFFF.png?text=JD' },
  john: { name: 'John Smith', avatarUrl: 'https://placehold.co/40x40/4CAF50/FFFFFF.png?text=JS' },
  alex: { name: 'Alex Ray', avatarUrl: 'https://placehold.co/40x40/F44336/FFFFFF.png?text=AR' },
};

const answers: Answer[] = [
  {
    id: 'ans-1',
    author: users.john,
    content: 'You can use `useEffect` with an empty dependency array to run a function only once when the component mounts. This is the standard way to fetch initial data in a React component.',
    votes: 15,
    isAccepted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'ans-2',
    author: users.alex,
    content: 'Another approach is to use a custom hook like `useSWR` or `react-query` which handles caching, re-fetching, and loading states for you automatically. It simplifies data fetching logic a lot.',
    votes: 8,
    isAccepted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
];

export const questions: Question[] = [
  {
    id: 'q-1',
    title: 'How to fetch data in Next.js 14 with App Router?',
    description: 'I\'m new to the Next.js App Router and I\'m confused about the best way to fetch data. Should I use Server Components, Client Components with `useEffect`, or something else? I want to fetch a list of products from an API and display them on a page. What are the best practices for this?',
    tags: ['nextjs', 'react', 'data-fetching', 'app-router'],
    author: users.jane,
    votes: 24,
    answers: answers,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: 'q-2',
    title: 'What is the difference between JWT and session-based authentication?',
    description: 'I\'m building a web application and need to implement authentication. I\'ve heard about JWT (JSON Web Tokens) and traditional session-based authentication. What are the main differences, pros, and cons of each approach? When should I prefer one over the other?',
    tags: ['authentication', 'jwt', 'security', 'webdev'],
    author: users.john,
    votes: 42,
    answers: [
      {
        id: 'ans-3',
        author: users.jane,
        content: 'JWTs are stateless and stored on the client, which makes them great for APIs and microservices. Session-based auth stores data on the server, making it stateful but potentially easier to invalidate.',
        votes: 22,
        isAccepted: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
  },
  {
    id: 'q-3',
    title: 'How to center a div both horizontally and vertically in CSS?',
    description: 'This seems like a classic problem, but I always forget the best way to do it. What is the modern, recommended way to perfectly center a `div` or any other element within its parent container using CSS? I\'m looking for a solution that works well with Flexbox or Grid.',
    tags: ['css', 'flexbox', 'css-grid', 'layout'],
    author: users.alex,
    votes: 101,
    answers: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
  },
];
