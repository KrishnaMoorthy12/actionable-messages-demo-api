import { Injectable } from '@nestjs/common';
import { DynamicImage, IDynamicImage } from '../entities/DynamicImage';
import { Application } from '../platform';
import { Cache } from '../store/cache.store';

@Injectable()
export class DynamicImageRepository {
  private db: Cache<DynamicImage> = new Cache<DynamicImage>();

  constructor() {
    Application.getInstance().then((app) => {
      const port = app.getRunningPort();
      const apiUrl = `http://localhost:${port}/dicto`;
      const template = `
        <div style="width: 400px; height: 400px; background-color: dodgerblue; color: white; display: flex; align-items: center; justify-content: center">
          <h1>{{name}}</h1>
        </div>`;
      const dimensions = { height: 400, width: 400 };
      const di = new DynamicImage(template, apiUrl, dimensions);
      this.db.put(di.id, di);
    });
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
