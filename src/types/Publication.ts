
export interface Publication {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}
