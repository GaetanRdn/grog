import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

type PatchType<EntityType, Identifier> = Partial<EntityType> & Identifier;
type PostType<EntityType, Identifier> = Required<EntityType> & Identifier;
type PutType<EntityType, Identifier> = Required<EntityType> & Identifier;

export const CRUD_SERVICE_TOKEN: InjectionToken<CrudService<unknown>> =
  new InjectionToken<CrudService<unknown>>('CRUD_SERVICE_TOKEN');

@Injectable()
export abstract class CrudService<EntityType, EntityIdentifierType = never> {
  abstract get(filters: EntityIdentifierType): Observable<EntityType>;

  abstract getAll(filters: Partial<EntityType>): Observable<EntityType[]>;

  abstract delete(identifier: EntityIdentifierType): Observable<boolean>;

  abstract patch(
    body: PatchType<EntityType, EntityIdentifierType>
  ): Observable<boolean>;

  abstract post(
    body: PostType<EntityType, EntityIdentifierType>
  ): Observable<boolean>;

  abstract put(
    body: PutType<EntityType, EntityIdentifierType>
  ): Observable<boolean>;
}
