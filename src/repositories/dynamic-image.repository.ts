import { Injectable } from '@nestjs/common';
import { DynamicImage, IDynamicImage } from '../entities/DynamicImage';
import { FileDB, Store } from '../store';

@Injectable()
export class DynamicImageRepository {
  #db: Store<DynamicImage>;

  constructor() {
    this.#db = new FileDB('di-db');
  }

  async getDynamicImageRecord(id: string): Promise<IDynamicImage> {
    const diRecord = await this.#db.get(id);
    return diRecord?.getJSON?.() ?? (diRecord as unknown as IDynamicImage);
  }

  addDIRecordEntry({ component, apiEndPt, dimensions }: IDynamicImage) {
    const diRecord = new DynamicImage(component, apiEndPt, dimensions);
    this.#db.put(diRecord.id, diRecord);
    return diRecord;
  }

  flush() {
    this.#db.flush();
  }
}
