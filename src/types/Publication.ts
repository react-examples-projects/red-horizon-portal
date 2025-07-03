export interface Publication {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: Array<{
    _id: string;
    url: string;
    filename: string;
    size: number;
  }>;
  documents: Array<{
    _id: string;
    url: string;
    filename: string;
    size: number;
  }>;
  author: {
    _id: string;
    name: string;
    email: string;
    perfil_photo?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
