import { gql, Apollo } from "apollo-angular";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Vehicle, VehicleInput } from "./models/vehicle";

@Injectable({
  providedIn: "root",
})
export class GraphqlServerService {
  private query: any;

  // private allPosts = gql`
  //   {
  //     allPosts {
  //       id
  //       postid
  //       title
  //       author
  //     }
  //   }
  // `;

  private allVehicles = gql`
    {
      vehicles {
        id
        licencePlateNumber
        brand
        model
        engineNumber
        vinNumber
        mfgDate
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  getVehicleGraphql(): Observable<any> {
    return this.apollo.watchQuery({
      query: this.allVehicles,
    }).valueChanges;
  }

  // addVehicleGraphql(vehicle: VehicleInput): Observable<any> {
  //   this.query = gql`
  //     mutation ($id: ID!, $postid: Int!, $title: String!, $author: String!) {
  //       createPost(id: $id, postid: $postid, title: $title, author: $author) {
  //         id
  //         postid
  //         title
  //         author
  //       }
  //     }
  //   `;

  //   interface Response {
  //     createPost: Post;
  //   }

  //   return this.apollo.mutate<Response, Post>({
  //     mutation: this.query,
  //     variables: post,
  //     update: (store, { data: { createPost } }) => {
  //       const existingPosts: any = store.readQuery({ query: this.allPosts });
  //       const newPosts = [...existingPosts.allPosts, createPost];
  //       store.writeQuery({
  //         query: this.allPosts,
  //         data: { allPosts: newPosts },
  //       });
  //     },
  //   });
  // }
  // mutation ($id: ID!, $title: String!) {
  //   updatePost(id: $id, title: $title) {
  //     id
  //     postid
  //     title
  //     author
  //   }
  // }
  updateVehicleGraphql(updateObj: any): Observable<any> {
    this.query = gql`
      mutation ($data: UpdateVehicleInput!, $id: Float!) {
        updateVehicle(updateVehicleInput: $data, id: $id) {
          id
          licencePlateNumber
          brand
          model
          engineNumber
          vinNumber
          mfgDate
        }
      }
    `;

    return this.apollo.mutate({
      mutation: this.query,
      variables: updateObj,
    });
  }
  addVehicleGraphql(updateObj: any): Observable<any> {
    this.query = gql`
      mutation ($data: CreateVehicleInput!) {
        createVehicle(createVehicleInput: $data) {
          id
          licencePlateNumber
          brand
          model
          engineNumber
          vinNumber
          mfgDate
        }
      }
    `;

    return this.apollo.mutate({
      mutation: this.query,
      variables: updateObj,
    });
  }
  fileUploadGraphql(file: any): Observable<any> {
    this.query = gql`
      mutation ($file: Upload!) {
        csvFile(file: $file)
      }
    `;

    return this.apollo.mutate({
      mutation: this.query,
      variables: file,
    });
  }
  deleteVehicleGraphql(deleteObj: any): Observable<any> {
    this.query = gql`
      mutation ($id: Float!) {
        deleteVehicle(id: $id) {
          id
          licencePlateNumber
          brand
          model
          engineNumber
          vinNumber
          mfgDate
        }
      }
    `;

    return this.apollo.mutate({
      mutation: this.query,
      variables: { id: deleteObj },
    });
  }
}
