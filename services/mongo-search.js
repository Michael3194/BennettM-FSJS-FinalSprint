const { connect } = require('./mongo-database');

const search = async (searchString) => {
  if (DEBUG)
    console.log('mongodb search() function called from mongo-search.js');

  const client = await connect();

  try {
    const db = client.db('fsjs_final_sprint');
    const collection = db.collection('moviedata');

    const searchStringRegExp = new RegExp(searchString, 'i');

    // Perform a search in the collection
    const results = await collection
      .find({
        $or: [
          { title: searchStringRegExp },
          { genre: searchStringRegExp },
          { description: searchStringRegExp },
        ],
      })
      .toArray();

    if (DEBUG)
      console.log(`Search successful. ${results.length} results found`);

    return results;
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
};

module.exports = { search };
