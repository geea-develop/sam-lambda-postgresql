// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const { getClient, releaseClient } = require('./rds/connection.js');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.pgCreateHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false

    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await getClient();
    let response = {};
    const { body } = event;

    try {
        
        const student = JSON.parse(body);
        // const ret = await axios(url);
        // await client.query('BEGIN')
        // const queryText = 'INSERT INTO students(name) VALUES($1) RETURNING id';
        // const created = [student.name];
        // const results = await client.query(queryText, created)
        // await client.query('COMMIT')
        // const rowCount = results.rowCount;
        const rowCount = 1;
        let createdItems = [];
        // if (rowCount) {
        //     createdItems = results.rows;
        //     console.log('result', results.rows[0]);
        // }

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `created ${rowCount} items`,
                items: createdItems
            })
        }

    } catch (err) {
        await client.query('ROLLBACK')
        console.error(err);
        response = err;
    } finally {
        if (client)
            await releaseClient(client);
    }

    return response;
};

exports.pgSelectHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false

    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await getClient();
    let response = {};

    try {
        
        // const ret = await axios(url);
        const results = await client.query('SELECT * FROM students')
        let foundItems = [];
        const rowCount = results.rowCount
        if (rowCount) {
            foundItems = results.rows;
            console.log('result', results.rows[0]);
        }

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: `found ${rowCount} items`,
                items: [foundItems.pop()]
            })
        }

    } catch (err) {
        console.error(err);
        response = err;
    } finally {
        if (client)
            await releaseClient(client);
    }

    return response;
};