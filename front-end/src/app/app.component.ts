import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DataService } from "./services/data.service";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { AddDialogComponent } from "./dialogs/add/add.dialog.component";
import { EditDialogComponent } from "./dialogs/edit/edit.dialog.component";
import { DeleteDialogComponent } from "./dialogs/delete/delete.dialog.component";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GraphqlServerService } from "./graphql-server.service";
import { Vehicle } from "./models/vehicle";
import { ToastrService } from "ngx-toastr";
import { FileDialogComponent } from "./dialogs/file/file.dialog.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  displayedColumns = [
    "id",
    "licencePlateNumber",
    "brand",
    "model",
    "engineNumber",
    "vinNumber",
    "mfgDate",
    "actions",
  ];
  VehicleDatabase: DataService | null;
  dataSource: VehicleDataSource | null;
  index: number;
  id: number;
  fileAttr = "Choose File";

  constructor(
    public toastr: ToastrService,
    public dialog: MatDialog,
    public dataService: DataService,
    public graphqlServerService: GraphqlServerService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild("fileInput") fileInput: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { vehicle: Vehicle },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.VehicleDatabase.dataChange.value.push(
          this.dataService.getDialogData()
        );
        this.refreshTable();
      }
    });
  }

  startEdit(
    i: number,
    id: number,
    licencePlateNumber: string,
    brand: string,
    model: string,
    engineNumber: string,
    vinNumber: string,
    mfgDate: string
  ) {
    this.id = id;
    this.index = i;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        id: id,
        licencePlateNumber: licencePlateNumber,
        brand: brand,
        model: model,
        engineNumber: engineNumber,
        vinNumber: vinNumber,
        mfgDate: mfgDate,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.VehicleDatabase.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        this.VehicleDatabase.dataChange.value[foundIndex] =
          this.dataService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(
    i: number,
    id: number,
    licencePlateNumber: string,
    brand: string,
    model: string,
    engineNumber: string,
    vinNumber: string,
    mfgDate: string
  ) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        id: id,
        licencePlateNumber: licencePlateNumber,
        brand: brand,
        model: model,
        engineNumber: engineNumber,
        vinNumber: vinNumber,
        mfgDate: mfgDate,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.VehicleDatabase.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        this.VehicleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  uploadFile() {
    const dialogRef = this.dialog.open(FileDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      this.refresh();
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.VehicleDatabase = new DataService(
      this.toastr,
      this.graphqlServerService
    );
    this.dataSource = new VehicleDataSource(
      this.VehicleDatabase,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter.nativeElement, "keyup").subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
}

export class VehicleDataSource extends DataSource<Vehicle> {
  _filterChange = new BehaviorSubject("");

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Vehicle[] = [];
  renderedData: Vehicle[] = [];

  constructor(
    public _VehicleDatabase: DataService,
    public _paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
  }

  connect(): Observable<Vehicle[]> {
    const displayDataChanges = [
      this._VehicleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._VehicleDatabase.getAllIssues();

    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this._VehicleDatabase.data
          .slice()
          .filter((vehicle: Vehicle) => {
            const searchStr = (
              vehicle.licencePlateNumber +
              vehicle.brand +
              vehicle.model +
              vehicle.engineNumber
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this._paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }

  disconnect() {}
  sortData(data: Vehicle[]): Vehicle[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";

      switch (this._sort.active) {
        case "id":
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case "licencePlateNumber":
          [propertyA, propertyB] = [a.licencePlateNumber, b.licencePlateNumber];
          break;
        case "brand":
          [propertyA, propertyB] = [a.brand, b.brand];
          break;
        case "model":
          [propertyA, propertyB] = [a.model, b.model];
          break;
        case "engineNumber":
          [propertyA, propertyB] = [a.engineNumber, b.engineNumber];
          break;
        case "vinNumber":
          [propertyA, propertyB] = [a.vinNumber, b.vinNumber];
          break;
        case "mfgDate":
          [propertyA, propertyB] = [a.mfgDate, b.mfgDate];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}
