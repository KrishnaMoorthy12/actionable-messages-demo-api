import { randomUUID } from 'crypto';
import { StorageEntity } from './StorageEntity';

export class DynamicImage implements StorageEntity<IDynamicImage> {
  readonly id: string;

  constructor(
    private component: string,
    private apiEndPt: string,
    private dimensions: IDynamicImage['dimensions'],
  ) {
    this.id = randomUUID();
  }

  getJSON(): IDynamicImage {
    return {
      component: this.component,
      apiEndPt: this.apiEndPt,
      dimensions: {
        height: this.dimensions.height,
        width: this.dimensions.width,
      },
    };
  }
}

export interface IDynamicImage {
  component: string;
  apiEndPt: string;
  dimensions: {
    height: number;
    width: number;
  };
}
