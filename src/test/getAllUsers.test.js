const getAllUsers = require('../controllers/user/getAllUsers');
const { User } = require('../db');

// Mock del modelo User
jest.mock('../db', () => ({
  User: {
    findAll: jest.fn(),
  },
}));

describe("getAllUsers Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  it("should return all users if users exist", async () => {
    const mockUsers = [
      { id: 1, name: "User 1", email: "user1@example.com", role: "user", state: true },
      { id: 2, name: "User 2", email: "user2@example.com", role: "editor", state: true },
    ];
    User.findAll.mockResolvedValue(mockUsers);

    const result = await getAllUsers();
    expect(result).toEqual(mockUsers);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if no users exist", async () => {
    User.findAll.mockResolvedValue([]);
    await expect(getAllUsers()).rejects.toThrow("No users found");
  });

  it("should throw a database error if something goes wrong", async () => {
    User.findAll.mockRejectedValue(new Error("Database connection failed"));
    await expect(getAllUsers()).rejects.toThrow("Database error: Database connection failed");
  });
});
