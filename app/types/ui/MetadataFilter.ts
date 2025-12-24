export type MetadataFilterOperator = "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte" | "$in" | "$nin";

export interface MetadataFilter {
  name: string;
  operator: MetadataFilterOperator;
  value: any;
}
