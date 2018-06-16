const docOrDefault = defaultValue => doc =>
  doc.exists ? doc.data() : defaultValue;

const update = db => docRef => updateFunction =>
  db.runTransaction(t => {
    return t.get(docRef).then(oldState => {
      const newState = updateFunction(oldState.data());
      if (oldState === newState) {
        return;
      }
      t.set(docRef, newState);
    });
  });

module.exports = { docOrDefault, update };
