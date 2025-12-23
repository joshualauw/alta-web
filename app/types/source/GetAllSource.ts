export interface GetAllSourceResponse {
  id: number;
  name: string;
  fileUrl: string | null;
  groupId: number | null;
  groupName: string | null;
  status: "PENDING" | "FAILED" | "DONE";
  createdAt: string;
}
