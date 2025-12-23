export interface GetSourceDetailResponse {
  id: number;
  name: string;
  content: string;
  fileUrl: string | null;
  groupId: number | null;
  groupName: string | null;
  metadata: any;
  status: "PENDING" | "FAILED" | "DONE";
  statusReason: string | null;
  createdAt: string;
  updatedAt: string;
}
