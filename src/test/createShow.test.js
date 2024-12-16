// tests/createShow.test.js
const createShow = require('../controllers/show/createShow');
const { Show, Tag } = require('../db');

jest.mock('../db', () => ({
  Show: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Tag: {
    findAll: jest.fn(),
  },
}));

describe('createShow Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new show with normalized genres', async () => {
    const validData = {
      name: 'Amazing Show',
      artists: ['Artist 1', 'Artist 2'],
      genre: ['MuSic', 'dRaMa'],
      location: 'Central Theater',
      presentation: [{ date: '2024-12-01', performance: 'Evening' }],
      description: 'A fantastic evening of entertainment',
      coverImage: 'http://example.com/image.jpg',
    };

    // Mock datos
    Tag.findAll.mockResolvedValue([{ name: 'Music' }, { name: 'Drama' }]);
    Show.findOne.mockResolvedValue(null);
    Show.create.mockResolvedValue({ id: 1, ...validData, genre: ['Music', 'Drama'] });

    const result = await createShow(
      validData.name,
      validData.artists,
      validData.genre,
      validData.location,
      validData.presentation,
      validData.description,
      validData.coverImage
    );

    expect(Tag.findAll).toHaveBeenCalledWith({
      where: { name: ['Music', 'Drama'] },
      attributes: ['name'],
    });

    expect(Show.create).toHaveBeenCalledWith(expect.objectContaining({
      name: validData.name,
      genre: ['Music', 'Drama'],
      artists: validData.artists,
      location: validData.location,
      presentation: validData.presentation,
      description: validData.description,
      coverImage: validData.coverImage,
    }));

    expect(result.genre).toEqual(['Music', 'Drama']);
    expect(result).toEqual(expect.objectContaining({
      name: validData.name,
      genre: ['Music', 'Drama'],
    }));
  });

  it('should throw an error if a show with the same name already exists', async () => {
    const duplicateData = {
      name: 'Existing Show',
      artists: ['Artist'],
      genre: ['Music'],
      location: 'Place',
      presentation: [{ date: '2024-12-01', performance: 'Morning' }],
    };

    Show.findOne.mockResolvedValue({ id: 1, name: 'Existing Show' });

    await expect(createShow(
      duplicateData.name,
      duplicateData.artists,
      duplicateData.genre,
      duplicateData.location,
      duplicateData.presentation
    )).rejects.toThrow('Show with this name already exists');

    expect(Show.findOne).toHaveBeenCalledWith({ where: { name: duplicateData.name } });
  });

  it('should throw an error if genre contains invalid tags', async () => {
    const invalidData = {
      name: 'Show',
      artists: ['Artist'],
      genre: ['InvalidGenre'],
      location: 'Place',
      presentation: [{ date: '2024-12-01', performance: 'Evening' }],
    };

    // Mock para devolver solo géneros válidos
    Tag.findAll.mockResolvedValue([{ name: 'Music' }]);

    await expect(createShow(
      invalidData.name,
      invalidData.artists,
      invalidData.genre,
      invalidData.location,
      invalidData.presentation
    )).rejects.toThrow('Invalid genres: Invalidgenre');

    expect(Tag.findAll).toHaveBeenCalledWith({
      where: { name: ['Invalidgenre'] },
      attributes: ['name'],
    });
  });

  it('should throw an error if required fields are missing or invalid', async () => {
    await expect(createShow()).rejects.toThrow('Name is required and must not exceed 125 characters');
    await expect(createShow('Valid Name')).rejects.toThrow('Artists must be a non-empty array');
    await expect(createShow('Valid Name', ['Artist'])).rejects.toThrow('Genre must be a non-empty array');
    await expect(createShow('Valid Name', ['Artist'], ['Music'])).rejects.toThrow('Location must be a valid string');
    await expect(createShow('Valid Name', ['Artist'], ['Music'], 'Central Theater')).rejects.toThrow('presentation must be a non-empty array of objects');
  });
});
