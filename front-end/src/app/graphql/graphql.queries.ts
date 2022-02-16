import { gql } from 'apollo-angular';

const ALL_VEHICLES = gql`
  query {
    vehicles {
      id
      licencePlateNumber
      brand
      model
      vinNumber
      mfgDate
    }
  }
`;
export { ALL_VEHICLES };
