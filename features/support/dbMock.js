const sinon = require("sinon");

const createMockDb = (initialState = {}, initialCollection = []) => {
  let mockState = { ...initialState };
  const collection = [...initialCollection];

  const mockDoc = {
    exists: true,
    data: sinon.fake.returns(mockState)
  };

  const mockDocRef = sinon.fake.returns({
    get: sinon.fake.resolves(mockDoc)
  });

  const collectionDocs = {
    docs: sinon.fake.returns(collection)
  };

  const collectionRefMock = {
    get: sinon.fake.resolves(collectionDocs)
  };

  const collectionMock = sinon.fake.returns(collectionRefMock);

  const setMock = sinon.fake((doc, newState) => {
    mockState = newState;
    return Promise.resolve(newState);
  });

  const getMock = sinon.fake.resolves(mockDoc);

  const transactionMock = {
    get: getMock,
    set: setMock
  };
  const runTransactionMock = callback => {
    return callback(transactionMock);
  };

  const dbMock = {
    // Peer inside mocked db
    getMock: getMock,
    setMock: setMock,
    get lastStateUpdate() {
      return setMock.lastArg;
    },
    get lastUpdatedPath() {
      return mockDocRef.lastArg;
    },
    // Actual db funcs
    doc: mockDocRef,
    collection: collectionMock,
    runTransaction: runTransactionMock
  };

  return dbMock;
};

class MockDbBuilder {
  constructor(initalState = {}, collection = []) {
    this.state = { ...initalState };
    this.collection = [...collection];
  }
  updateState(updateFunc) {
    return new MockDbBuilder(updateFunc(this.state), this.collection);
  }
  updateCollection(updateFunc) {
    return new MockDbBuilder(this.state, updateFunc(this.collection));
  }
  build() {
    return createMockDb(this.state, this.collection);
  }
}

const emptyMockDb = createMockDb({});

module.exports = { createMockDb, emptyMockDb, MockDbBuilder };
