import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreEntity } from './data-store.service';

@Injectable()
export abstract class CrudService<EntityType extends StoreEntity> {
  protected _url!: string;

  protected constructor(protected _httpClient: HttpClient) {}

  public get(identifier: Partial<EntityType>): Observable<EntityType> {
    return this._httpClient.get<EntityType>(`${this._url}/${identifier}`);
  }
}
