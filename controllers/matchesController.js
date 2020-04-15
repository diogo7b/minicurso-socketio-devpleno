const db = require('../routes/database');
const _ =require('lodash');

module.exports = {
    async index(req, res, next){

        const matches = await db.get('matches').value();
        
        res.render('index', { matches })
    },

    uniqueIndex(req, res, next) {

        const matches = db.get('matches').value();
        const match = db.get('matches['+req.params.id+']').value();
      
        match.bids = _.orderBy(match.bids, ['half', 'time'], ['desc', "desc"])
      
        res.render('match', { matches, match, id: req.param.id });
    },
};