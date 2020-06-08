'use strict';

const MariaDbAdapter = require("@dbAdapters/mariaDbAdapter");
var theoretically = require("jasmine-theories");

describe("mariaDbAdapter", () => {
  const logger = {
    log: function (msg) { }
  };
  const dbConfig = {};

  const mySql = {
    createConnection: function ({ }) {
      return Promise.resolve();
    }
  };

  function getAdapter() {
    return new MariaDbAdapter({ mySql, dbConfig, logger });
  }

  it("sets mySql to .mysql property", () => {
    const dbAdapter = getAdapter();
    expect(dbAdapter.mysql).toBe(mySql);
  });

  theoretically.it(".connect() calls mysql.createConnection if .connection is %s (is not a resolved Promise)", [null, undefined], async (insertedValue) => {
    // Arrange
    spyOn(mySql, 'createConnection');
    const dbAdapter = getAdapter();

    // Act & Assert
    await expectAsync(dbAdapter.connect()).toBeResolved();
    expect(mySql.createConnection).toHaveBeenCalled();
  });
});

