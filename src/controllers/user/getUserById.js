const { User, Ticket } = ('../../db');

module.exports = async (id) => {

  if (!/^\d+$/.test(id)) throw new Error('Invalid ID format');

  const user = await User.findByPk(id, {
    include: [
      { model: Ticket, attributes: ['id', 'showId', 'price'] }
    ]
  });

  if (!user) throw new Error(`User with ID ${id} not found`);

  return user;
};