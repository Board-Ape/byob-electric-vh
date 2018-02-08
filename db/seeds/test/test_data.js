
exports.seed = function(knex, Promise) {
  
  return knex('branches').del()
    .then(() => knex('topcompanies').del())

    .then(function () {

      return Promise.all([
        knex('topcompanies').insert(
        {
          companyName: 'API Industries',
          industry: 'machinery',
          location: 'New South Wales',
          revenueGrowth: '200%'
        }, 'id')
        .then(branches => {
          return knex('branches').insert([
            {
              companyName: 'API Industries', 
              employees: '1200', 
              location: 'New South Wales', 
              grossRevenue: '1,200,000',
              projects_id: branches[0]
            },
            {
              companyName: 'Stark Industries', 
              employees: '20000', 
              location: 'New York', 
              grossRevenue: '1,200,000,000',
              projects_id: branches[0]
            }
          ])
        })
        .then(() => console.log('seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) //end Promise.all
    });
};
