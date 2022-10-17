export enum Priority {
  VeryHigh = "very-high",
  High = "high",
  Normal = "normal",
  Low = "low",
  VeryLow = "very-low",
}

export interface TodoAttributes {
  id?: number;

  title: string;
  is_active: boolean;
  priority: Priority;

  activity_group_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TodoCreationAttributes {
  title: string;
  is_active?: boolean;
  priority?: Priority;
  activity_group_id: number;
}
