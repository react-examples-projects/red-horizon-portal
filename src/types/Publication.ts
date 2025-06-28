export interface Publication {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  documents: string[];
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
