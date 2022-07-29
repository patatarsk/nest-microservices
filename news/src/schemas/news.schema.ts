import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type NewsDocument = News & mongoose.Document;

@Schema()
export class News {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  owners: mongoose.Schema.Types.ObjectId[];
}

export const NewsSchema = SchemaFactory.createForClass(News);
