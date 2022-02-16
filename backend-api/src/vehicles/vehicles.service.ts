import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import { Repository, UpdateResult } from 'typeorm';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehiclesRepository: Repository<Vehicle>,
  ) {}

  createVehicle(createVehicleInput: CreateVehicleInput): Promise<Vehicle> {
    const newVehicle = this.vehiclesRepository.create(createVehicleInput);
    return this.vehiclesRepository.save(newVehicle);
  }

  async updateVehicle(
    id: number,
    updateVehicleInput: UpdateVehicleInput,
  ): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) throw new Error('Vehicle not found!');
    Object.assign(vehicle, updateVehicleInput);
    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOneOrFail(id);
    const vehicle_res = await this.vehiclesRepository.remove(vehicle);
    return vehicle_res;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    return this.vehiclesRepository.findOneOrFail(id);
  }

  async createVehicles(vehicleList: CreateVehicleInput[]): Promise<any> {
    try {
      const newVehicle = this.vehiclesRepository.create(vehicleList);
      await this.vehiclesRepository.save(newVehicle);
    } catch (err) {
      console.log(err);
    }
    return 1;
  }
}
