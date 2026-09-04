const { connectDB, disconnectDB } = require('../src/config/db');
const models = require('../src/models');

const createIndexes = async () => {
  try {
    console.log('[Indexes] Connecting to DB...');
    await connectDB();

    for (const [modelName, Model] of Object.entries(models)) {
      console.log(`[Indexes] Creating indexes for model: ${modelName}`);
      await Model.createIndexes();
    }

    console.log('[Indexes] All indexes created successfully!');
  } catch (error) {
    console.error('[Indexes] Error creating indexes:', error);
  } finally {
    await disconnectDB();
  }
};

createIndexes();
