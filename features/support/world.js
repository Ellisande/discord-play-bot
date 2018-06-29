const { setWorldConstructor } = require("cucumber");
const { MockDbBuilder } = require("./dbMock");
const sinon = require("sinon");

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
    this.dbBuilder = new MockDbBuilder();
    this.mocks = {
      bot: botMock(),
      user: sinon.fake(),
      even: sinon.fake()
    };
  }

  updateDbBuilder(updateFunc) {
    this.dbBuilder = updateFunc(this.dbBuilder);
  }

  createDbMock() {
    if (this.mocks.db) {
      throw "Cannot set db mock twice in one test";
    }
    const dbMock = this.dbBuilder.build();
    this.mocks = {
      ...this.mocks,
      db: dbMock
    };
    return dbMock;
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
