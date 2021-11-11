import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { DataStore } from './data-store';
import { Concrete, StorableEntity, StoredEntityState } from './types';

export class StoredEntity<EntityType> implements StorableEntity<EntityType> {
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
