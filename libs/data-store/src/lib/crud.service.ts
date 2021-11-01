import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreEntity } from './data-store.service';

@Injectable()
export abstract class CrudService<
  EntityType extends StoreEntity,
  IdentifierType = never
> {
  protected _url!: string;

  protected constructor(protected _httpClient: HttpClient) {}

  public get(identifier: IdentifierType): Observable<EntityType> {
    return this._httpClient.get<EntityType>(`${this._url}/${identifier}`);
  }
}
