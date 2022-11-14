import { Injectable } from '@nestjs/common';
import { ILead, Lead } from '../entities/Lead';
import { FileDB, Store } from '../store';

@Injectable()
export class LeadRepository {
  #db: Store<Lead>;

  constructor() {
    this.#db = new FileDB('lead-db');
  }

  // for now, we'll keep name as pk

  async addLead(name: string, email: string, favProducts: string[]): Promise<ILead> {
    const lead = new Lead(name, email, favProducts);
    await this.#db.put(name, new Lead(name, email, favProducts));
    return lead.getJSON();
  }

  async updateFavoriteProducts(name: string, favProducts: string[]) {}

  async getFavoriteProducts(name: string): Promise<ILead['favorite_products']> {
    const lead = await this.#db.get(name);
    if (!lead) return null;
    return lead.getJSON?.().favorite_products ?? (lead as unknown as ILead).favorite_products;
  }
}
