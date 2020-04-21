var express = require('express');
var router = express.Router();
const db = require('./database');
const _ =require('lodash');

function indexRouter(dependencies) {

    const { io } = dependencies;

    io.on('connect', (socket) => {

        if (socket.handshake.query.match){
            console.log('a new user', socket.handshake.query.match);
            socket.join('match-'+socket.handshake.query.match);
        }
        console.log('a new client connected ')   
    }
    )

    /* GET home page. */
    router.get('/', (req, res, next) => {
        const matches = db.get('matches').value();     
        res.render('index', { matches });
    },


    router.get('/match/:id', (req, res, next) => {
        const matches = db.get('matches').value();
        const match = db.get('matches['+req.params.id+']').value();
        match.bids = _.orderBy(match.bids, ['half', 'time'], ['desc', "desc"])
        const supportersA = match['team-a'].supporters;
        const supportersB = match['team-b'].supporters;
        const total = supportersA+supportersB;

        const porcentagem = {
            teamA: 50,
            teamB: 50
        }

        if(total > 0){
            porcentagem.teamA = ((supportersA / total) * 100).toFixed(0);
            porcentagem.teamB = ((supportersB / total) * 100).toFixed(0);
        } 

        match.porcentagem = porcentagem;
        res.render('match', { matches, match, id: req.params.id });

    }));

    router.post('/match/:id/supporters', (req, res, next) => {
        const match = db.get('matches['+req.params.id+']').value();

        if(req.body.team === 'a'){
            const newValue = match['team-a'].supporters+1;
            db.set('matches['+req.params.id+'].team-a.supporters', newValue).write();
        }

        if(req.body.team === 'b'){
            const newValue = match['team-b'].supporters+1;
            db.set('matches['+req.params.id+'].team-b.supporters', newValue).write();
        }

        const supportersA = match['team-a'].supporters;
        const supportersB = match['team-b'].supporters;
        const total = supportersA+supportersB;

        const porcentagem = {
            teamA: 50,
            teamB: 50
        }

        if(total > 0){
            porcentagem.teamA = ((supportersA / total) * 100).toFixed(0);
            porcentagem.teamB = ((supportersB / total) * 100).toFixed(0);
        } 


        io.to('match-'+req.params.id).emit('supporters', porcentagem)
        res.send({ ok: true })


    });

    return router;

}


module.exports = indexRouter;
