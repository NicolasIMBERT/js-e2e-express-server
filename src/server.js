const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
const data = require('./data');
// fn to create express server
const create = async () => {
    const dbConnected = await data.connectToDatabase();

    // server
    const app = express();
    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    
    // Log request
    app.use(utils.appLogger);

    // root route - serve static file
    app.get('/api/hello', (req, res) => {
        const initialData = {
            data: [],
            dbStatus: !!dbConnected
        };
        console.dir(initialData);
        // get all items
        // initialData.data = (dbConnected ? data.findDocuments({}) : initialData);
        data.findDocuments({}, (cmdErr, result) => {
            if (!cmdErr)
                console.dir(result);
            else
                console.dir(cmdErr);

        });
        //= [{ a: 1, serial:'Gronf1' }, { a: 2, serial:'Gronf2' }, { a: 3, serial:'Gronf3' }]
        data.insertDocuments([{ a: 15, serial:'Gronf15' }, { a: 16, serial:'Gronf16' }]);
        // data.listDocuments();
        // const coll = client.db('stocks').collection('Fiches');
        // coll.find(filter, (cmdErr, result) => {
        //   assert.equal(null, cmdErr);
        // });

        res.json({hello: 'goodbye'});
        res.end();
    });
    app.get('/api/findbyserial/:key', (req, res) => {
        // const szKey = parseInt(req.params.key, 2);
        // const szKey = req.params.key;
        
        data.findDocument({serial: req.params.key})
            .then(result => {
                res.json({found: result}); 
                res.end();
            });
    });
    app.get('/api/listall', (req, res) => {
        data.listAll({})
            .then(result => {
                res.json({listall: result}); 
                res.end();
            });
    });
    app.get('/api/insert', (req, res) => {
        data.insertDocuments([{ a: 5, serial:'Gronf5' }, { a: 6, serial:'Gronf6' }])
            .then(result => {
                res.json({insert: result}); 
                res.end();
            });
    });

    // root route - serve static file
    app.get('/', (req, res) => {
        return res.sendFile(path.join(__dirname, '../public/client.html'));

    });

    // Catch errors
    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};
