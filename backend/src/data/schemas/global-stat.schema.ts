import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataDocumentGlobalStat = GlobalStatData & Document;

@Schema()
export class GlobalStatData {
  @Prop()
  query: string;

  @Prop()
  queryHash: string;

  @Prop()
  value: number;

  @Prop()
  date: Date;
}

export const Datachema = SchemaFactory.createForClass(GlobalStatData);
