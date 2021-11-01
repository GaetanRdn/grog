import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CRUD_SERVICE_TOKEN, CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class DataStore<EntityType> {
  private _store: BehaviorSubject<EntityType[]> = new BehaviorSubject<
    EntityType[]
  >([]);

  constructor(
    @Inject(CRUD_SERVICE_TOKEN) private _crud: CrudService<EntityType, unknown>
  ) {}

  public get<GetParam = Parameters<CrudService<EntityType>['get']>[0]>(
    identifier: GetParam
  ): Observable<EntityType> {
    const find: EntityType | undefined = this._store
      .getValue()
      .find((entity: EntityType) => {
        const keys: [keyof GetParam] = Object.keys(identifier) as [
          keyof GetParam
        ];

        return keys.every(
          (key: keyof GetParam) =>
            (entity as unknown as GetParam)[key] === identifier[key]
        );
      });

    if (find) {
      return of(find);
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
