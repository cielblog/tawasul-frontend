interface Report {
  const: number;
  delivered_recipients: number;
  undelivered_recipients: number;
  unknown_recipients: number;
}
export interface MessageListItem {
  id: number;
  subject?: string;
  message: string;
  type: 'sms' | 'email' | 'pushNotification';
  state: 'accepted' | 'succeed' | 'failed' | 'needApproving' | 'rejected';
  cost: number;
  numberRecipients: string;
  description: string;
  sentAt: Date;
  report: Report;
}

export interface MessageListPagination {
  total: number;
  size: number;
  page: number;
}

export interface MessageListData {
  list: MessageListItem[];
  pagination: Partial<MessageListPagination>;
}

export interface MessageListParams {
  sort?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  size?: number;
  page?: number;
}
