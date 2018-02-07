const companyData = require('./company-names.json')


const createCompany = (knex, companyData) => {
  return knex('topcompanies').insert({
    companyName: companyData.companyName,
    industry: companyData.industry,
    location: companyData.location,
    revenueGrowth: companyData.revenueGrowth
  }, 'id')
  .then(companyId => {
    let footnotePromises = [];

    paper.footnotes.forEach(footnote => {
      footnotePromises.push(
        createFootnote(knex, {
          note: footnote,
          paper_id: paperId[0]
        })
      )
    });

    return Promise.all(footnotePromises);
  })
};

const createFootnote = (knex, footnote) => {
  return knex('footnotes').insert(footnote);
};

exports.seed = (knex, Promise) => {
  return knex('footnotes').del() // delete footnotes first
    .then(() => knex('papers').del()) // delete all papers
    .then(() => {
      let paperPromises = [];

      papersData.forEach(paper => {
        paperPromises.push(createCompany(knex, paper));
      });

      return Promise.all(paperPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
