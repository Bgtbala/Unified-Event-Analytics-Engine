// tests/setup/mongooseMock.js
import { jest } from "@jest/globals";

jest.unstable_mockModule("mongoose", () => {
  const store = new Map();
  let idCounter = 1;

  class MockSchema {
    constructor(definition, options) {
      this.definition = definition;
      this.options = options;
    }
    index() {
      // no-op for tests
      return this;
    }
  }

  MockSchema.Types = {
    ObjectId: class MockObjectId {
      constructor(value) {
        this.value = value || String(idCounter++);
      }
      toString() {
        return this.value;
      }
    },
  };

  const makeMatcher =
    (query = {}) =>
    (doc) => {
      return Object.entries(query).every(([key, value]) => {
        if (value && typeof value === "object") {
          // simple $gte / $lte for Date ranges
          if ("$gte" in value || "$lte" in value) {
            const v = doc[key];
            if ("$gte" in value && !(v >= value.$gte)) return false;
            if ("$lte" in value && !(v <= value.$lte)) return false;
            return true;
          }
        }
        return doc[key] === value;
      });
    };

  const getModel = (name) => {
    if (!store.has(name)) {
      const data = [];
      const matcher = makeMatcher;

      const model = {
        data,

        create: jest.fn(async (doc) => {
          const withId = { _id: doc._id || String(idCounter++), ...doc };
          data.push(withId);
          return withId;
        }),

        insertMany: jest.fn(async (docs) => {
          const arr = Array.isArray(docs) ? docs : [docs];
          const inserted = arr.map((doc) => {
            const withId = { _id: doc._id || String(idCounter++), ...doc };
            data.push(withId);
            return withId;
          });
          return inserted;
        }),

        findOne: jest.fn(async (query = {}) => {
          return data.find(matcher(query)) || null;
        }),

        findById: jest.fn(async (id) => {
          return data.find((d) => d._id === id) || null;
        }),

        find: jest.fn(async (query = {}) => {
          return data.filter(matcher(query));
        }),

        updateOne: jest.fn(async (query, update = {}) => {
          const doc = data.find(matcher(query));
          if (!doc) return { modifiedCount: 0 };
          const changes = update.$set || update;
          Object.assign(doc, changes);
          return { modifiedCount: 1 };
        }),

        updateMany: jest.fn(async (query, update = {}) => {
          let modified = 0;
          const changes = update.$set || update;
          for (const doc of data) {
            if (matcher(query)(doc)) {
              Object.assign(doc, changes);
              modified += 1;
            }
          }
          return { modifiedCount: modified };
        }),

        deleteOne: jest.fn(async (query = {}) => {
          const idx = data.findIndex(matcher(query));
          if (idx === -1) return { deletedCount: 0 };
          data.splice(idx, 1);
          return { deletedCount: 1 };
        }),
      };

      store.set(name, model);
    }
    return store.get(name);
  };

  const mongooseMock = {
    Schema: MockSchema,
    model: (name) => getModel(name),
    Types: MockSchema.Types,
    connect: jest.fn(),
    disconnect: jest.fn(),
  };

  return {
    __esModule: true,
    default: mongooseMock,
    ...mongooseMock,
  };
});
