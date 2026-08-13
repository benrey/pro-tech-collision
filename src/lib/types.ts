/** Shared data shapes, mirroring supabase/schema.sql. */

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  vehicle: string | null;
  before_path: string;
  after_path: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  author: string;
  quote: string;
  rating: number | null;
  source: string | null;
  source_url: string | null;
  reviewed_on: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type QuoteRequest = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicle: string | null;
  message: string | null;
  handled: boolean;
  created_at: string;
};
