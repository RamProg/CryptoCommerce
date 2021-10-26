import { ConditionsType } from "../model/Product";

export default interface DAOInterface {
  getAll: (table: string) => Promise<object[]>;
  getAllWithConditions: (
    table: string,
    conditions: ConditionsType
  ) => Promise<object[]>;
  getOne: (table: string, id: string) => Promise<object[]>;
  addElement: (table: string, element: object) => Promise<object>;
  deleteElement: (table: string, id: string) => Promise<object>;
  updateElement: (
    table: string,
    id: string,
    element: object
  ) => Promise<object>;
  addElementToArray: (
    table: string,
    newElementToAdd: object
  ) => Promise<object>;
  removeElementFromCollection: (
    table: string,
    idElementToRemove: string
  ) => Promise<object>;
}
