import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CrudService } from './crud.service';
import {
  PersonWithId,
  PersonWithIdCrudService,
  PersonWithIdIdentifier,
  PersonWithoutId,
  PersonWithoutIdCrudService,
  PersonWithoutIdIdentifier,
} from './data-store.mocks';
import { DataStoreService } from './data-store.service';

describe('DataStoreService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('Entity has id as identifier', () => {
    let store: DataStoreService<PersonWithId, PersonWithIdIdentifier>;
    let crud: CrudService<PersonWithId>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          DataStoreService,
          PersonWithIdCrudService,
          { provide: CrudService, useClass: PersonWithIdCrudService },
        ],
      });
      store =
        TestBed.inject<DataStoreService<PersonWithId, PersonWithIdIdentifier>>(
          DataStoreService
        );
      crud = TestBed.inject(CrudService);
    });

    test.each([
      {
        id: 1,
        firstName: 'Gaetan',
        lastName: 'Redin',
        age: 31,
      },
      {
        id: 2,
        firstName: 'Virginie',
        lastName: 'Robert',
        age: 36,
      },
    ])(
      'when get person by its id then call crud',
      async (expected: PersonWithId) => {
        // GIVEN
        jest.spyOn(crud, 'get').mockReturnValueOnce(of(expected));

        // WHEN
        const person: PersonWithId = await store
          .get({ id: expected.id })
          .toPromise();

        // THEN
        expect(person).toEqual(expected);
        expect(crud.get).toHaveBeenCalledWith({ id: expected.id });
        expect(crud.get).toHaveBeenCalledTimes(1);
      }
    );

    test('when get person by its id twice then call crud once', async () => {
      // GIVEN
      const p: PersonWithId = {
        id: 1,
        firstName: 'Gaetan',
        lastName: 'Redin',
        age: 31,
      };

      jest.spyOn(crud, 'get').mockReturnValueOnce(of(p));

      // WHEN
      await store.get({ id: 1 }).toPromise();
      const person: PersonWithId = await store.get({ id: 1 }).toPromise();

      // THEN
      expect(person).toMatchInlineSnapshot(`
              Object {
                "age": 31,
                "firstName": "Gaetan",
                "id": 1,
                "lastName": "Redin",
              }
          `);
      expect(crud.get).toHaveBeenCalledWith({ id: 1 });
      expect(crud.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Entity has complex object as identifier', () => {
    let store: DataStoreService<PersonWithoutId, PersonWithoutIdIdentifier>;
    let crud: CrudService<PersonWithoutId>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          DataStoreService,
          PersonWithoutIdCrudService,
          { provide: CrudService, useClass: PersonWithoutIdCrudService },
        ],
      });
      store =
        TestBed.inject<
          DataStoreService<PersonWithoutId, PersonWithoutIdIdentifier>
        >(DataStoreService);
      crud = TestBed.inject(CrudService);
    });

    test('when get person by its identifier twice then call crud once', async () => {
      // GIVEN
      jest.spyOn(crud, 'get').mockReturnValueOnce(
        of({
          firstName: 'Gaetan',
          lastName: 'Redin',
          age: 31,
        })
      );

      // WHEN
      await store.get({ lastName: 'Redin', firstName: 'Gaetan' }).toPromise();
      const person: PersonWithoutId = await store
        .get({ lastName: 'Redin', firstName: 'Gaetan' })
        .toPromise();

      // THEN
      expect(person).toMatchInlineSnapshot(`
        Object {
          "age": 31,
          "firstName": "Gaetan",
          "lastName": "Redin",
        }
      `);
      expect(crud.get).toHaveBeenCalledWith({
        lastName: 'Redin',
        firstName: 'Gaetan',
      });
      expect(crud.get).toHaveBeenCalledTimes(1);
    });
  });
});
