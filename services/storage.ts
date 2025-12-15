import { FileSystemItem, User } from '../types';

const USERS_KEY = 'organisa_users';
const CURRENT_USER_KEY = 'organisa_current_user';
const DATA_KEY_PREFIX = 'organisa_data_';

// Auth Helpers
export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const registerUser = (user: User): boolean => {
  const users = getUsers();
  if (users.find(u => u.username === user.username)) {
    return false; // User exists
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const loginUser = (username: string, password: string): boolean => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.passwordHash === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, username);
    return true;
  }
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(CURRENT_USER_KEY);
};

// File System Helpers
const getDataKey = (username: string) => `${DATA_KEY_PREFIX}${username}`;

export const getItems = (username: string): FileSystemItem[] => {
  const stored = localStorage.getItem(getDataKey(username));
  return stored ? JSON.parse(stored) : [];
};

export const saveItem = (username: string, item: FileSystemItem) => {
  const items = getItems(username);
  items.push(item);
  localStorage.setItem(getDataKey(username), JSON.stringify(items));
};

export const deleteItem = (username: string, itemId: string) => {
  let items = getItems(username);
  
  // Recursive delete function to remove children of folders
  const getIdsToDelete = (parentId: string): string[] => {
    const children = items.filter(i => i.parentId === parentId);
    let ids = children.map(c => c.id);
    children.forEach(c => {
      if (c.type === 'folder') {
        ids = [...ids, ...getIdsToDelete(c.id)];
      }
    });
    return ids;
  };

  const idsToDelete = [itemId, ...getIdsToDelete(itemId)];
  items = items.filter(i => !idsToDelete.includes(i.id));
  
  localStorage.setItem(getDataKey(username), JSON.stringify(items));
};
