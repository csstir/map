var express = require('express');
var router = express.Router();


// Require the controllers WHICH WE DID NOT CREATE YET!!
var product_controller = require('../controllers/product');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', product_controller.test);

router.get('/home', function(req,res){

    res.render('index', {
        map:product_controller.product_get,
         title: 'Cool, huh!',
          condition: true,
           anyArray: [1,2,3] 
        });
});

router.post('/create', product_controller.product_create);

router.get('/:id', product_controller.product_details);

router.put('/:id/update', product_controller.product_update);

router.delete('/:id/delete', product_controller.product_delete);


module.exports = router;