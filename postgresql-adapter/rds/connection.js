const { Pool } = require('pg');

/**
 * https://node-postgres.com/features/pooling
 */
const pool = new Pool();

function logPoolDetails() {
    console.log('[connection] PG Pool Details', {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
    });
}

pool.on('error', (err, client) => {
    console.error('[connection] PG Pool Error', err);
});

module.exports = {
    getClient: () => pool.connect(),
    releaseClient: (client) => client.release(),
    query: (text, params) => pool.query(text, params),
    logPoolDetails,
};

