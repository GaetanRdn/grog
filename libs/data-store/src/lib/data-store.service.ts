import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CrudService } from './crud.service';

export interface StoreEntity {
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class DataStoreService<
  EntityType extends StoreEntity,
  IdentifierType extends Partial<EntityType>
> {
  private _store: BehaviorSubject<EntityType[]> = new BehaviorSubject<
    EntityType[]
  >([]);

  constructor(private _crud: CrudService<EntityType, IdentifierType>) {}

  public get(identifier: IdentifierType): Observable<EntityType> {
    const found: EntityType | undefined = this._store
      .getValue()
      .find((entity: EntityType) =>
        Object.keys(identifier).every(
          (key: string) => identifier[key] === entity[key]
        )
      );

    if (found) {
      return of(found);
    }

    return this._crud
      .get(identifier)
      .pipe(
        tap((entity: EntityType) =>
          this._store.next([...this._store.getValue(), entity])
        )
      );
  }
}
