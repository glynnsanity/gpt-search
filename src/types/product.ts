export interface ProductInfo {
  id: number;
  title: string;
  description: string;
  long_description: string;
  price: number;
  tags: string[];
  featured_image_url: string | null;
  additional_images: { src: string }[];
  embedding_vector: number[];
  product_url: string;  // Added product URL field
}
