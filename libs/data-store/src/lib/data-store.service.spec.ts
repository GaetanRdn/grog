import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CRUD_SERVICE_TOKEN } from './crud.service';
import { PersonWithId, PersonWithIdCrudService } from './data-store.mocks';
import { DataStore } from './data-store.service';

describe('DataStoreService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('Simple Entity identified by an id', () => {
    let store: DataStore<PersonWithId>;
    let crud: PersonWithIdCrudService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DataStore,
          // PersonWithIdCrudService,
          {
            provide: CRUD_SERVICE_TOKEN,
            useClass: PersonWithIdCrudService,
          },
        ],
      });

      store = TestBed.inject(DataStore);
      crud = TestBed.inject(CRUD_SERVICE_TOKEN) as PersonWithIdCrudService;
    });

    test('When call get once then check crud has been called once', async () => {
      // GIVEN
      jest
        .spyOn(crud, 'get')
        .mockReturnValueOnce(
          of({ id: 1, firstName: 'Gaetan', lastName: 'Redin' })
        );

      // WHEN
      const personWithId: PersonWithId = await store.get({ id: 1 }).toPromise();

      // THEN
      expect(personWithId).toMatchInlineSnapshot(`
        Object {
          "firstName": "Gaetan",
          "id": 1,
          "lastName": "Redin",
        }
      `);
      expect(crud.get).toHaveBeenCalledTimes(1);
    });

    test('When call get twice then check crud has been called once', async () => {
      // GIVEN
      jest
        .spyOn(crud, 'get')
        .mockReturnValue(of({ id: 1, firstName: 'Gaetan', lastName: 'Redin' }));

      // WHEN
      await store.get({ id: 1 }).toPromise();
      await store.get({ id: 1 }).toPromise();

      // THEN
      expect(crud.get).toHaveBeenCalledTimes(1);
    });
  });
});
