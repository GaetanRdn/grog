import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';

@Injectable()
export class PersonWithIdCrudService extends CrudService<
  PersonWithId,
  Pick<PersonWithId, 'id'>
> {
  public delete(identifier: { id: number }): Observable<boolean> {
    throw new Error('Unsupported Operation');
  }

  public get(filters: Partial<PersonWithId>): Observable<PersonWithId> {
    throw new Error('Unsupported Operation');
  }

  public patch(body: {
    id: number;
    firstName?: string;
    lastName?: string;
    age?: number | null;
  }): Observable<boolean> {
    throw new Error('Unsupported Operation');
  }

  public post(body: PersonWithId): Observable<boolean> {
    throw new Error('Unsupported Operation');
  }

  public put(body: PersonWithId): Observable<boolean> {
    throw new Error('Unsupported Operation');
  }

  public getAll(filters: Partial<PersonWithId>): Observable<PersonWithId[]> {
    throw new Error('Unsupported Operation');
  }
}

export interface PersonWithId {
  id: number;
  firstName: string;
  lastName: string;
  age?: number | null;
}
