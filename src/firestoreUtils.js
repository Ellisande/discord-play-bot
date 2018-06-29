const docOrDefault = defaultValue => doc =>
  doc.exists ? doc.data() : defaultValue;

const update = db => docPath => updateFunction =>
  db.runTransaction(t => {
    const docRef = db.doc(docPath);
    return t.get(docRef).then(oldState => {
      const newState = updateFunction(oldState.data());
      if (oldState === newState) {
        return;
      }
      t.set(docRef, newState);
    });
  });

module.exports = { docOrDefault, update };
