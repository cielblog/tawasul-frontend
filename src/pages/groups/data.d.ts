export interface TableListItem {
  id: number;
  title?: boolean;
  number_members: string;
  avatar: string;
  activated: number;
  updated_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sort?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  size?: number;
  page?: number;
}
