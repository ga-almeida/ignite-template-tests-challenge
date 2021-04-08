import {createConnection, getConnection} from 'typeorm';

const connection = {
  async create(){
    await createConnection();
  },

  async close(){
    await getConnection().close();
  },

  async clear(){
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const entitiyDeletionPromises = entities.map((entity) => async () => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });

    await Promise.all(entitiyDeletionPromises);
  },
};

export default connection;
