import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateVehicleInput {
  @IsNotEmpty()
  @Field()
  licencePlateNumber: string;

  @IsAlpha()
  @IsNotEmpty()
  @Field()
  brand: string;

  @Field()
  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  @Field()
  engineNumber: string;

  @IsNotEmpty()
  @Field()
  vinNumber: string;

  @IsNotEmpty()
  @Field()
  mfgDate: string;
}
