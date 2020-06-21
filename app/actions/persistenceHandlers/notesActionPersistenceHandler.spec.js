'use strict';

const NotesActionPersistenceHandler = require("@actions/persistenceHandlers/notesActionPersistenceHandler");
const faker = require('faker'); // https://github.com/marak/Faker.js/

describe("notesActionPersistenceHandler", () => {
  const logger = {
    log: function () { }
  };

  it("sets logger to .logger property", () => {
    const handler = new NotesActionPersistenceHandler({ logger });
    expect(handler.logger).toBe(logger);
  });

  it("sets notesRepository to .repository property", () => {
    const notesRepository = {};
    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });
    expect(handler.repository).toBe(notesRepository);
  });

  it("sets logPrefix to square-bracketed constructor name with space suffix", () => {
    const notesRepository = {};
    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });
    expect(handler.logPrefix).toBe("[NotesActionPersistenceHandler] ");
  });

  //////////////////
  // insertNote
  //////////////////
  it("insertNote calls repository.insertNote with passed parameters", async () => {
    // Arrange
    var notesRepository = jasmine.createSpyObj("notesRepository", ["insertNote"])
    notesRepository.insertNote.and.returnValue(Promise.resolve());

    const timestamp = faker.date.recent;
    const userID = faker.random.number;
    const channelID = faker.random.number;
    const nick = faker.userName;
    const message = faker.lorem.sentence;

    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });

    // Act
    await handler.insertNote(timestamp, userID, channelID, nick, message);

    // Assert
    expect(notesRepository.insertNote)
      .toHaveBeenCalledWith(timestamp, userID, channelID, nick, message);
  });

  it("insertNote returns repository.insertNote as result", async () => {
    // Arrange
    const expectedResult = faker.fake;
    var notesRepository = jasmine.createSpyObj("notesRepository", ["insertNote"])
    notesRepository.insertNote.and.returnValue(expectedResult);

    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });

    // Act & Assert
    await expectAsync(handler.insertNote()).toBeResolvedTo(expectedResult);
  });

  //////////////////
  // getRandomNote
  //////////////////
  it("getRandomNote returns repository.getRandomNote as result", async () => {
    // Arrange
    const expectedResult = faker.fake;
    var notesRepository = jasmine.createSpyObj("notesRepository", ["getRandomNote"])
    notesRepository.getRandomNote.and.returnValue(expectedResult);

    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });

    // Act & Assert
    await expectAsync(handler.getRandomNote()).toBeResolvedTo(expectedResult);
  });

  //////////////////
  // getRandomNoteByContent
  //////////////////
  it("getRandomNoteByContent calls repository.getRandomNoteByContent with passed parameters", async () => {
    // Arrange
    var notesRepository = jasmine.createSpyObj("notesRepository", ["getRandomNoteByContent"])
    notesRepository.getRandomNoteByContent.and.returnValue(Promise.resolve());
    const searchPhrase = faker.lorem.sentence;

    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });

    // Act
    await handler.getRandomNoteByContent(searchPhrase);

    // Assert
    expect(notesRepository.getRandomNoteByContent)
      .toHaveBeenCalledWith(searchPhrase);
  });

  it("getRandomNoteByContent returns repository.getRandomNoteByContent as result", async () => {
    // Arrange
    const expectedResult = faker.fake;
    var notesRepository = jasmine.createSpyObj("notesRepository", ["getRandomNoteByContent"])
    notesRepository.getRandomNoteByContent.and.returnValue(expectedResult);

    const handler = new NotesActionPersistenceHandler({ logger, notesRepository });

    // Act & Assert
    await expectAsync(handler.getRandomNoteByContent()).toBeResolvedTo(expectedResult);
  });
});
