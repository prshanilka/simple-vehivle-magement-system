import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Vehicle {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  licencePlateNumber: string;

  @Column()
  @Field()
  brand: string;

  @Column()
  @Field()
  model: string;

  @Column()
  @Field()
  engineNumber: string;

  @Column()
  @Field()
  vinNumber: string;

  @Column()
  @Field()
  mfgDate: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;
}
