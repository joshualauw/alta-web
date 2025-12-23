export interface MetadataFilter {
  name: string;
  operator: "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte" | "$in" | "$nin";
  value: any;
}
