import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import NotificationPreference from "./NotificationPreference";

export interface IMentor {
  _id?: mongoose.Types.ObjectId;
  firebaseUID: string; // Should be autogenerated by client-side firebase.
  name: string;
  email: string;
  timezone: string;
  phone: string;
  pronouns: string;
  avatar: string; // Assumed to be a URL
  bio: string;
  major: string;
  notificationPreference: NotificationPreference;
  gradeLevels: number[];
}

export class Mentor implements IMentor {
  public _id: mongoose.Types.ObjectId;

  @prop({ required: true })
  public firebaseUID: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public email: string;

  @prop({ required: true })
  public timezone: string;

  @prop({ required: true })
  public phone: string;

  @prop({ required: true })
  public pronouns: string;

  @prop({ required: true })
  public major: string;

  @prop({ required: true })
  public notificationPreference: NotificationPreference;

  @prop({ required: true })
  public gradeLevels: number[];

  @prop({ required: true })
  public bio: string;

  @prop({ required: true })
  public avatar: string;
}

const MentorModel = getModelForClass(Mentor);

export default MentorModel;
