export type IBookFilters = {
  searchTerm?: string;
  author?: string;
  category?: string;
  publisher?: string;
};
export type IRelatedBook = {
  id: string;
  name: string;
  photo: string;
  description: string;
  totalRead: number;
};
export enum IRelatedBookType {
  CATEGORY = 'category',
  AUTHOR = 'author',
  PUBLISHER = 'publisher',
  LATEST = 'latest',
  FEATURED = 'featured',
  WISHLIST = 'wishlist',
}
