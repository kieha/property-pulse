export type Property = {
  _id: string;
  owner: string;
  name: string;
  type: string;
  description?: string;
  location: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities?: string[];
  rates: {
    nightly?: number;
    weekly?: number;
    monthly?: number;
  };
  seller_info?: {
    name: string;
    email: string;
    phone: string;
  };
  images: string[];
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  _id: string;
  body: string;
  email: string;
  name: string;
  phone: string;
  property: {
    _id: string;
    name: string;
  }
  read: boolean;
  recipient: string;
  sender: {
    _id: string;
    username: string;
  }
  createdAt: string;
  updatedAt: string;
};