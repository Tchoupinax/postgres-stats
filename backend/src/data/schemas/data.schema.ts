import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataDocument = Data & Document;

@Schema()
export class Data {
  @Prop()
  query: string;

  @Prop()
  queryHash: string;

  @Prop()
  value: number;

  @Prop()
  callCountSinceLast: number;

  @Prop()
  date: Date;
}

export const Datachema = SchemaFactory.createForClass(Data);
