export type IUserFilters = {
  searchTerm?: string;
};
export type IAdminOverview = {
  totalUser: number;
  totalBook: number;
  totalBlog: number;
  totalNewsletter: number;
  totalAuthor: number;
  totalPublisher: number;
  totalCategory: number;
  totalWishList: number;
};
export type IAdminChartInfo = {
  topBook: {
    name: string;
    id: string;
    totalRead: number;
  }[];
  totalPublishBlog: number;
  totalPendingBlog: number;
  totalDeniedBlog: number;
};
