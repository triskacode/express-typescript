export interface ActivityAttributes {
  id?: number;

  title: string;
  email: string;

  created_at?: Date;
  updated_at?: Date;
}

export interface ActivityCreationAttributes {
  title: string;
  email: string;
}
