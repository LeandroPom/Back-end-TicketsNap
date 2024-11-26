const { User } = require('../db');
const createUser = require('../controllers/user/createUser');

// Mock de las funciones del modelo
jest.mock('../db', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));


describe("createUser Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if name is missing", async () => {
    await expect(createUser("", "test@example.com", "password123", null, "user", "Admin"))
      .rejects.toThrow("Name is required and must not exceed 40 characters");
  });

  it("should throw an error if email format is invalid", async () => {
    await expect(createUser("Test User", "invalidemail", "password123", null, "user", "Admin"))
      .rejects.toThrow("Invalid email format: must contain '@'");
  });

  it("should throw an error if email already exists", async () => {
    User.findOne.mockResolvedValueOnce({ id: 1, email: "test@example.com" }); // Mock duplicado
    await expect(createUser("Test User", "test@example.com", "password123", null, "user", "Admin"))
      .rejects.toThrow("Email already registered");
  });

  it("should throw an error if name already exists", async () => {
    User.findOne
      .mockResolvedValueOnce(null) // Email no duplicado
      .mockResolvedValueOnce({ id: 1, name: "Test User" }); // Mock duplicado nombre
    await expect(createUser("Test User", "new@example.com", "password123", null, "user", "Admin"))
      .rejects.toThrow("Name already registered");
  });

  it("should create a new user with default values", async () => {
    User.findOne.mockResolvedValue(null); // Ningún duplicado
    User.create.mockResolvedValue({
      id: 1,
      name: "New User",
      email: "new@example.com",
      role: "user",
      state: true,
      confirmed: false,
      disabled: false,
      createdBy: "Admin",
    });

    const newUser = await createUser("New User", "new@example.com", "password123", null, null, "Admin");

    expect(newUser).toHaveProperty("id");
    expect(newUser.role).toBe("user");
    expect(newUser.state).toBe(true);
    expect(User.create).toHaveBeenCalledTimes(1);
  });
});
