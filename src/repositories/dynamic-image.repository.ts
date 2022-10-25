import { Injectable } from '@nestjs/common';
import { DynamicImage, IDynamicImage } from '../entities/DynamicImage';
import { Cache } from '../store/cache.store';

@Injectable()
export class DynamicImageRepository {
  private db: Cache<DynamicImage> = new Cache<DynamicImage>();

  constructor() {
    this.db.put(
      '5ca5a12c-83d2-453b-8afe-d6eefed0bb7c',
      new DynamicImage(
        `<div style="width: 400px; height: 400px; background-color: dodgerblue; color: white; display: flex; align-items: center; justify-content: center">
          <h1>{{name}}</h1>
        </div>`,
        'http://localhost:3000/dicto',
        {
          height: 400,
          width: 400,
        },
      ),
    );
  }

  getDynamicImageRecord(id: string): IDynamicImage {
    return this.db.get(id)?.getJSON();
  }

  addDIRecordEntry({ component, apiEndPt, dimensions }: IDynamicImage) {
    const diRecord = new DynamicImage(component, apiEndPt, dimensions);
    this.db.put(diRecord.id, diRecord);
    return diRecord;
  }
}
