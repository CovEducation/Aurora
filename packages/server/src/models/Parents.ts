import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import CommunicationPreference from "./CommunicationPreference";
import { IStudent, Student } from "./Students";

export interface IParent {
  _id?: mongoose.Types.ObjectId;
  firebaseUID: string; // Should be autogenerated by client-side firebase.
  name: string;
  email: string;
  region?: string;
  phone?: string;
  pronouns?: string;
  avatar?: string; // Assumed to be a URL
  communicationPreference: CommunicationPreference;
  students: IStudent[];
}

export class Parent implements IParent {
  public _id: mongoose.Types.ObjectId;

  @prop({ required: true, unique: true })
  public firebaseUID: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: false })
  public region?: string;

  @prop({ required: false })
  public phone?: string;

  @prop({ required: false })
  public pronouns?: string;

  @prop({ required: true })
  public communicationPreference: CommunicationPreference;

  @prop({ required: false })
  public avatar?: string;

  @prop({
    required: true,
    validate: {
      validator: (v) => v.length >= 1,
      message: "Parent must specific at least one student.",
    },
  })
  public students: Student[];
}

const ParentModel = getModelForClass(Parent);

export default ParentModel;
