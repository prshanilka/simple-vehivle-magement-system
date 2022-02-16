import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Vehicle } from "../models/vehicle";
import { GraphqlServerService } from "../graphql-server.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class DataService {
  dataChange: BehaviorSubject<Vehicle[]> = new BehaviorSubject<Vehicle[]>([]);
  dialogData: any;

  constructor(
    private toastr: ToastrService,
    private dataService: GraphqlServerService
  ) {}

  get data(): Vehicle[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllIssues(): void {
    this.dataService.getVehicleGraphql().subscribe(
      (res) => {
        console.log(res.data.vehicles);
        this.dataChange.next(res.data.vehicles);
      },
      (err) => console.error(err)
    );
  }

  addVehicle(vehicle: Vehicle): void {
    const VehicleInput = {
      licencePlateNumber: vehicle.licencePlateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      engineNumber: vehicle.engineNumber,
      vinNumber: vehicle.vinNumber,
      mfgDate: vehicle.mfgDate,
    };
    this.dataService.addVehicleGraphql({ data: VehicleInput }).subscribe(
      (res) => {
        this.toastr.success("Successfully edited");
        this.dialogData = res.data.createVehicle;
      },
      (err) => console.error(err)
    );
  }
  updateVehicle(vehicle: Vehicle): void {
    const vehicleUpdate = {
      licencePlateNumber: vehicle.licencePlateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      engineNumber: vehicle.engineNumber,
      vinNumber: vehicle.vinNumber,
      mfgDate: vehicle.mfgDate,
    };
    this.dataService
      .updateVehicleGraphql({ data: vehicleUpdate, id: vehicle.id })
      .subscribe(
        (res) => {
          this.dialogData = res.data.updateVehicle;
          this.toastr.success("Successfully edited");
        },
        (err) => console.error(err)
      );
  }
  deleteVehicle(id: number): void {
    this.dataService.deleteVehicleGraphql(id).subscribe(
      (res) => {
        this.toastr.success("Successfully Deleted");
        this.dialogData = res.data.deleteVehicle;
      },
      (err) => console.error(err)
    );
  }
  uploadVehicles(file: any): void {
    this.dataService.fileUploadGraphql({ file: file }).subscribe(
      (res) => {
        this.toastr.success("Successfully edited");
      },
      (err) => console.error(err)
    );
  }
}
