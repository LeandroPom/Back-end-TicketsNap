const { Show, Ticket, Place } = require('../../db');

module.exports = async (id) => {

  if (!/^\d+$/.test(id)) throw new Error('Invalid ID format');

  const show = await Show.findByPk(id, {

    include: [
      { model: Ticket, attributes: ['id', 'price'] },
      { model: Place, attributes: ['id', 'name', 'location'] }
    ]
    
  });

  if (!show) throw new Error(`Show with ID ${id} not found`);

  return show;
};
