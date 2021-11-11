import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoredEntity } from './stored-entity';
import {
  Concrete,
  MandatoryPropertiesOf,
  StorableEntity,
  StoreConfig,
  StoredEntityState,
} from './types';
import { deepCopy } from './utils';

@Injectable({
  providedIn: 'root',
})
export class DataStore<
  EntityType,
  Identifier extends keyof Concrete<EntityType> = keyof MandatoryPropertiesOf<EntityType>
> {
  private _store: BehaviorSubject<StoredEntity<EntityType>[]> =
    new BehaviorSubject<StoredEntity<EntityType>[]>([]);

  private _identifierKeys: (keyof EntityType)[];

  get changed$(): Observable<StorableEntity<EntityType>[]> {
    return this._store.asObservable();
  }

  constructor(private _config: StoreConfig<EntityType>) {
    this._identifierKeys = Array.isArray(this._config.extractIdentifier)
      ? this._config.extractIdentifier
      : [this._config.extractIdentifier];
  }

  public store(...entities: EntityType[]): DataStore<EntityType, Identifier> {
    this._store.next([
      ...this._store.getValue(),
      ...entities.map(
        (entity: EntityType) => new StoredEntity(deepCopy(entity), this)
      ),
    ]);

    return this;
  }

  public get(
    identifier: Pick<EntityType, Identifier>
  ): StorableEntity<EntityType> | null {
    return (
      this._store
        .getValue()
        .find((storedEntity: StoredEntity<EntityType>) =>
          this.sameEntity(identifier, storedEntity.entity)
        ) ?? null
    );
  }

  public delete(identifier: Pick<EntityType, Identifier>): void {
    this.updateState(identifier, 'deleted');
  }

  public update(
    entity: Pick<EntityType, Identifier>,
    change: Partial<EntityType> & MandatoryPropertiesOf<EntityType>
  ): void {
    this.updateState(entity, 'updated', change);
  }

  public partialUpdate(
    entity: Pick<EntityType, Identifier>,
    change: Partial<EntityType>
  ): void {
    this.updateState(entity, 'partial', change);
  }

  public create(entity: MandatoryPropertiesOf<EntityType>): void {
    this._store.next([
      ...this._store.getValue(),
      new StoredEntity(deepCopy(entity) as EntityType, this, 'created'),
    ]);
  }

  private updateState(
    identifier: Pick<EntityType, Identifier>,
    state: StoredEntityState,
    change?: Partial<EntityType>
  ): void {
    this._store.next(
      this._store.getValue().map((storedEntity: StoredEntity<EntityType>) => {
        if (this.sameEntity(identifier, storedEntity.entity)) {
          storedEntity['_state'] = state;

          if (change) {
            storedEntity.change = change;
          }
        }
        return storedEntity;
      })
    );
  }

  private sameEntity(
    identifier: Pick<EntityType, Identifier>,
    entity: EntityType
  ): boolean {
    return this._identifierKeys.every(
      (key: keyof EntityType) => (identifier as EntityType)[key] === entity[key]
    );
  }
}
