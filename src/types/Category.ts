import { AbstractEntity } from "types/AbstractEntity";

export type CategoryId = number;

class Category extends AbstractEntity {
  constructor(s?: any) {
    super(s);

    this.name = s?.name || "";
    this.description = s?.description || "";
    this.id = s?.id || 0;
    this.protected = s?.protected || false;
  }

  public id: CategoryId;

  public name: string;

  public description: string;

  public protected: boolean;
}

export default Category;
