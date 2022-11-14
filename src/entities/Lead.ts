import { randomUUID } from 'crypto';
import { StorageEntity } from './StorageEntity';

export class Lead implements StorageEntity<ILead> {
  readonly id: string;

  constructor(private name: string, private email: string, private favoriteProducts: string[]) {
    this.id = randomUUID();
  }

  getJSON(): ILead {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      favorite_products: this.favoriteProducts,
    };
  }
}

export interface ILead {
  id: string;
  name: string;
  email: string;
  favorite_products: string[];
}
