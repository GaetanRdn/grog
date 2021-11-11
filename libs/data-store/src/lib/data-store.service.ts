import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface StorableEntity<EntityType> {
  entity: EntityType;
  change: Partial<EntityType> | null;
  readonly state: StoredEntityState;
  readonly stateChanged$: Observable<StoredEntityState>;
  delete: () => void;
}

class StoredEntity<EntityType> implements StorableEntity<EntityType> {
  public change: Partial<EntityType> | null = null;

  #store: DataStore<EntityType>;

  #_state$: BehaviorSubject<StoredEntityState> =
    new BehaviorSubject<StoredEntityState>('initialized');

  get stateChanged$(): Observable<StoredEntityState> {
    return this.#_state$.asObservable().pipe(distinctUntilChanged());
  }

  get state(): StoredEntityState {
    return this.#_state$.getValue();
  }

  /**
   * @internal
   * @private
   */
  private set _state(state: StoredEntityState) {
    this.#_state$.next(state);
  }

  constructor(
    public entity: EntityType,
    _store: DataStore<EntityType, keyof Concrete<EntityType>>,
    state: StoredEntityState = 'initialized'
  ) {
    this.#store = _store;
    this._state = state;
  }

  public delete(): void {
    this.#store.delete(this.entity);
  }
}

export type StoredEntityState =
  | 'initialized'
  | 'deleted'
  | 'updated'
  | 'partial'
  | 'created';

type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type OptionalPropertiesOf<Type> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof Type]-?: {} extends Pick<Type, K> ? K : never;
}[keyof Type];

type MandatoryPropertiesOf<Type> = Omit<Type, OptionalPropertiesOf<Type>>;

function deepCopy<Type>(obj: Type): Type {
  return JSON.parse(JSON.stringify(obj));
}

interface StoreConfig<EntityType> {
  extractIdentifier: keyof EntityType | (keyof EntityType)[];
}

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
          this.isSame(identifier, storedEntity.entity)
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
        if (this.isSame(identifier, storedEntity.entity)) {
          storedEntity['_state'] = state;

          if (change) {
            storedEntity.change = change;
          }
        }
        return storedEntity;
      })
    );
  }

  private isSame(
    identifier: Pick<EntityType, Identifier>,
    entity: EntityType
  ): boolean {
    return this._identifierKeys.every(
      (key: keyof EntityType) => (identifier as EntityType)[key] === entity[key]
    );
  }
}
