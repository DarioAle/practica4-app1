const router = require('express').Router();

// importamos los routes
const homeRoute = require('./home');

// paths con su propio route
router.use('/home', homeRoute);

// path con retorno directo
router.route('/').get((req, res) => {
    res.json(
        {   
            version: "0.0.1",
            paths: {
                autor :  "/author",
                home :   "/home",
                status : "/revisavivo"
            }
        }
    );
})

router.route('/author').get((req,res) =>{
    res.json(
        {
            author : "Dario Arias",
        }
    )
})

router.route('/revisavivo').get((req,res) =>{
    res.json(
        {
            status : "Estoy bien",
        }
    )
})

module.exports = router;