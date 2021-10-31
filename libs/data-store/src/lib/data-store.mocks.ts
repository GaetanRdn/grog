import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { StoreEntity } from './data-store.service';

@Injectable()
export class PersonWithIdCrudService extends CrudService<PersonWithId> {
  protected _url = '/persons';
}

@Injectable()
export class PersonWithoutIdCrudService extends CrudService<PersonWithoutId> {
  protected _url = '/persons-no-id';
}

export interface PersonWithId extends StoreEntity {
  id: number;
  firstName: string;
  lastName: string;
  age?: number | null;
}

export interface PersonWithoutId extends StoreEntity {
  firstName: string;
  lastName: string;
  age?: number | null;
}

export type PersonWithoutIdIdentifier = Pick<
  PersonWithoutId,
  'firstName' | 'lastName'
>;
export type PersonWithIdIdentifier = Pick<PersonWithId, 'id'>;
