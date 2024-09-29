export interface IRoleModel {
  id?: number;
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export class RoleModel implements IRoleModel {
  id?: number;
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    name: string = "", // Default value for name
    isActive: boolean = false, // Default value for isActive
    id?: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
