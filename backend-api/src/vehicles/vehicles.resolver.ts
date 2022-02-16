import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UpdateResult } from 'typeorm';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { Vehicle } from './vehicle.entity';
import { VehiclesService } from './vehicles.service';
import * as fs from 'fs/promises';
import * as csv from 'csvtojson';

@Resolver((of) => Vehicle)
export class VehiclesResolver {
  constructor(private vehiclesService: VehiclesService) {}
  @Query((returns) => Vehicle)
  getVehicle(@Args('id', { type: () => Int }) id: number): Promise<Vehicle> {
    return this.vehiclesService.findOne(id);
  }
  @Query((returns) => [Vehicle])
  vehicles(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  @Mutation((returns) => Vehicle)
  createVehicle(
    @Args('createVehicleInput') createVehicleInput: CreateVehicleInput,
  ): Promise<Vehicle> {
    return this.vehiclesService.createVehicle(createVehicleInput);
  }

  @Mutation((returns) => Vehicle)
  updateVehicle(
    @Args('id') id: number,
    @Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput,
  ): Promise<Vehicle> {
    return this.vehiclesService.updateVehicle(id, updateVehicleInput);
  }

  @Mutation(() => Vehicle)
  async deleteVehicle(@Args('id') id: number) {
    return this.vehiclesService.remove(id);
  }

  @Mutation(() => Int, { name: 'csvFile' })
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<number> {
    try {
      const { createReadStream } = file;
      const stream = createReadStream();
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString('base64');
      const json = await csv().fromString(buffer.toString());
      return this.vehiclesService.createVehicles(json);
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}
