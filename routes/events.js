/*
Events Routes
/api/events

*/

const { Router } = require('express');
const { check } = require('express-validator');
const {isDate} = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validar-campos');
const {	getEventos,crearEvento,actualizarEvento,eliminarEvento} = require('../controllers/eventsController');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


//todas las peticiones pasan por validar token
router.use(validarJWT)

//obtener eventos 
router.get('/',getEventos);


//crear un nuevo evento

router.post(
	'/',
		//validacion de campos
	[ 	//nombre del campo y mensaje de error si no es valido
		check('title','el titulo es obligatorio').not().isEmpty(),
		check('start','Fecha de inicio es obligatoria').custom(isDate),
		check('end','Fecha de finalizacion es obligatoria').custom(isDate),
		validarCampos
	],
	crearEvento);


//actualizar evento

router.put('/:id',actualizarEvento);

//eliminar evento

router.delete('/:id',eliminarEvento)

module.exports = router;
