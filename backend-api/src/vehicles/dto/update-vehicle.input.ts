import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class UpdateVehicleInput {
  @Field({ nullable: true })
  licencePlateNumber?: string;

  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  engineNumber?: string;

  @Field({ nullable: true })
  vinNumber?: string;

  @Field({ nullable: true })
  mfgDate?: string;
}
