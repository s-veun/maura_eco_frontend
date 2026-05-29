export type CategoryDto = {
  catId: number;
  catName: string;
  catDesc?: string;
  imageUrl?: string;
  slug?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryTreeNode = CategoryDto & {
  children?: CategoryTreeNode[];
};

