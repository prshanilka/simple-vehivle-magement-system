import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, Input } from "@angular/core";
import { DataService } from "../../services/data.service";
import { FormControl, Validators } from "@angular/forms";
import { Vehicle } from "../../models/vehicle";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { environment } from "../../../../src/environments/environment";
@Component({
  selector: "app-file.dialog",
  templateUrl: "../../dialogs/file/file.dialog.html",
  styleUrls: ["../../dialogs/file/file.dialog.css"],
})
export class FileDialogComponent {
  @Input()
  requiredFileType: string;

  fileName = "";
  uploadProgress: number;
  uploadSub: Subscription;

  operations: string = JSON.stringify({
    query: "mutation csvFile($file:Upload!) {csvFile(file: $file)}",
  });
  map: string = JSON.stringify({ "0": ["variables.file"] });
  constructor(
    public dialogRef: MatDialogRef<FileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle,
    public dataService: DataService,
    private http: HttpClient
  ) {}

  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError("required") ? "Required field" : "";
  }

  submit() {
    // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dataService.addVehicle(this.data);
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("operations", this.operations);
      formData.append("map", this.map);
      formData.append("0", file);

      const upload$ = this.http
        .post(environment.graphqlUrl, formData, {
          reportProgress: true,
          observe: "events",
        })
        .pipe(
          finalize(() => {
            this.reset();
            this.dialogRef.close();
          })
        );

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
