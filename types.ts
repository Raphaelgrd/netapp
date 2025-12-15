export type ItemType = 'folder' | 'note' | 'link' | 'file';

export interface FileSystemItem {
  id: string;
  parentId: string | null; // null represents the root directory
  type: ItemType;
  name: string;
  content?: string; // URL for links, Text for notes, Base64 for small files
  createdAt: number;
}

export interface User {
  username: string;
  passwordHash: string; // In a real app, this would be secure. Here it's a mock.
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: string | null;
}
