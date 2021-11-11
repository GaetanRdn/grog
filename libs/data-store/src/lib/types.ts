import { Observable } from 'rxjs';

export type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

export type OptionalPropertiesOf<Type> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof Type]-?: {} extends Pick<Type, K> ? K : never;
}[keyof Type];

export type MandatoryPropertiesOf<Type> = Omit<
  Type,
  OptionalPropertiesOf<Type>
>;

export interface StorableEntity<EntityType> {
  entity: EntityType;
  change: Partial<EntityType> | null;
  readonly state: StoredEntityState;
  readonly stateChanged$: Observable<StoredEntityState>;
  delete: () => void;
}

export type StoredEntityState =
  | 'initialized'
  | 'deleted'
  | 'updated'
  | 'partial'
  | 'created';

export interface StoreConfig<EntityType> {
  extractIdentifier: keyof EntityType | (keyof EntityType)[];
}
