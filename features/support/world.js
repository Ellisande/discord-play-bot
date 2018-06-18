const { setWorldConstructor } = require("cucumber");
const sinon = require("sinon");

const dbMock = () => {
  const collection = sinon.fake();
  const docMock = {
    exists: true,
    data: sinon.fake()
  };
  const doc = sinon.fake.returns({
    get: sinon.fake.resolves(docMock)
  });
  const transactionGet = sinon.fake.resolves(doc);
  const transactionSet = sinon.fake.resolves();
  const runTransaction = sinon.fake(func => {
    return Promise.resolve(
      func({
        get: transactionGet,
        set: transactionSet
      })
    );
  });
  return {
    collection,
    doc,
    runTransaction,
    transactionGet,
    transactionSet,
    docRef: docMock
  };
};

const botMock = () => ({
  sendMessage: sinon.fake()
});

const given = Symbol("given");
const when = Symbol("when");
const then = Symbol("then");

class CustomWorld {
  constructor() {
    this[given] = {};
    this[when] = {};
    this[then] = {};
    this.mocks = {
      db: dbMock(),
      bot: botMock(),
      user: sinon.fake(),
      even: sinon.fake()
    };
  }

  setValue(storySection, updateFunction) {
    this[storySection] = updateFunction(this[storySection]);
  }

  setGiven(updateFunction) {
    this.setValue(given, updateFunction);
  }

  setWhen(updateFunction) {
    this.setValue(when, updateFunction);
  }

  setThen(updateFunction) {
    this.setValue(then, updateFunction);
  }

  get given() {
    return { ...this[given] };
  }

  get when() {
    return { ...this[when] };
  }

  get then() {
    return { ...this[then] };
  }
}

setWorldConstructor(CustomWorld);
