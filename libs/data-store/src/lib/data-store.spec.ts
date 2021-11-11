import { DataStore } from './data-store';
import { Person } from './data-store.mocks';
import { StorableEntity } from './types';

describe('DataStore', () => {
  let personStore: DataStore<Person, 'id'>;

  beforeEach(() => {
    personStore = new DataStore({
      extractIdentifier: 'id',
    });
  });

  test('when store 1 entity then check changed$', (doneFn: jest.DoneCallback) => {
    // WHEN
    personStore.store({
      firstName: 'Gaetan',
      lastName: 'REDIN',
    });

    // THEN
    personStore.changed$.subscribe((changed: StorableEntity<Person>[]) => {
      expect(changed).toMatchSnapshot();
      changed.forEach(({ state }: StorableEntity<Person>) =>
        expect(state).toEqual('initialized')
      );
      doneFn();
    });
  });

  test('when store 2 entities at the same time then check changed$', (doneFn: jest.DoneCallback) => {
    // WHEN
    personStore.store(
      {
        firstName: 'Elisa',
        lastName: 'REDIN',
        age: 25,
      },
      {
        firstName: 'Gaetan',
        lastName: 'REDIN',
      }
    );

    // THEN
    personStore.changed$.subscribe((changed: StorableEntity<Person>[]) => {
      expect(changed).toMatchSnapshot();
      changed.forEach(({ state }: StorableEntity<Person>) =>
        expect(state).toEqual('initialized')
      );
      doneFn();
    });
  });

  test('when store 2 entities one after another then check last changed$', (doneFn: jest.DoneCallback) => {
    // WHEN
    personStore
      .store({
        firstName: 'Elisa',
        lastName: 'REDIN',
        age: 25,
      })
      .store({
        firstName: 'Gaetan',
        lastName: 'REDIN',
      });

    // THEN
    personStore.changed$.subscribe((changed: StorableEntity<Person>[]) => {
      expect(changed).toMatchSnapshot();
      changed.forEach(({ state }: StorableEntity<Person>) =>
        expect(state).toEqual('initialized')
      );
      doneFn();
    });
  });

  test('when get entity and empty store then return null', () => {
    expect(personStore.get({ id: 1 })).toBeNull();
  });

  test('when get entity and store contains entity then return it', () => {
    // GIVEN
    personStore.store({
      id: 1,
      firstName: 'Gaetan',
      lastName: 'REDIN',
    });

    // WHEN
    const current: StorableEntity<Person> | null = personStore.get({ id: 1 });

    // THEN
    expect(current).toMatchSnapshot({
      entity: {
        id: 1,
        firstName: 'Gaetan',
        lastName: 'REDIN',
      },
    });
    expect(current?.state).toEqual('initialized');
  });

  test('when delete entity then check changed$', (doneFn: jest.DoneCallback) => {
    // GIVEN
    personStore.store({
      id: 1,
      firstName: 'Gaetan',
      lastName: 'REDIN',
    });

    // WHEN
    personStore.delete({ id: 1 });

    // THEN
    personStore.changed$.subscribe((changed: StorableEntity<Person>[]) => {
      expect(changed).toMatchSnapshot();
      expect(changed[0].state).toEqual('deleted');
      doneFn();
    });
  });

  test('when update entity then check changed$', (doneFn: jest.DoneCallback) => {
    // GIVEN
    const entity: Person = {
      id: 1,
      firstName: 'Gaetan',
      lastName: 'REDIN',
    };
    personStore.store(entity);

    // WHEN
    entity.age = 31;
    personStore.update({ id: 1 }, entity);

    // THEN
    personStore.changed$.subscribe((changed) => {
      expect(changed).toMatchSnapshot();
      expect(changed[0].state).toEqual('updated');
      doneFn();
    });
  });

  test('when create entity then check changed$', (doneFn: jest.DoneCallback) => {
    // GIVEN
    const entity: Person = {
      firstName: 'Gaetan',
      lastName: 'REDIN',
    };

    // WHEN
    personStore.create(entity);

    // THEN
    personStore.changed$.subscribe((changed) => {
      expect(changed).toMatchSnapshot();
      expect(changed[0].state).toEqual('created');
      doneFn();
    });
  });

  test('when partialUpdate entity then check changed$', (doneFn: jest.DoneCallback) => {
    // GIVEN
    const entity: Person = {
      id: 1,
      firstName: 'Gaetan',
      lastName: 'REDIN',
    };
    personStore.store(entity);

    // WHEN
    personStore.partialUpdate({ id: 1 }, { age: 31 });

    // THEN
    personStore.changed$.subscribe((changed: StorableEntity<Person>[]) => {
      expect(changed).toMatchSnapshot();
      expect(changed[0].state).toEqual('partial');
      doneFn();
    });
  });

  test.todo('when flush store then check changed$');
});
