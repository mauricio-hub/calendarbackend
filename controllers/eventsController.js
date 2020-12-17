

const { response } = require('express');
const Evento = require('../models/EventoModel');



const getEventos =async(req, res = response )=>{

	//retornando lista de eventos

	const eventos = await Evento.find()
								.populate('user','name');

	res.json({
					ok:true,
					eventos
				}) 
}


const crearEvento = async(req,res = response)=>{
	//verificar que tenga el evento que llegan del body

	//se crea un nuevo objeto del modelo de evento
	const evento = new Evento(req.body) 

	try {
		
		evento.user = req.uid;

		const eventoGuardado =  await evento.save()

		res.json({
			ok:true,
			evento: eventoGuardado
		})
		
	} catch(e) {
		console.log(e);
		res.status(500).json({
			ok:false,
			msg:'Hable con el administrador'
		});
	}


}

const actualizarEvento =async(req,res = response)=>{


	const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}


const eliminarEvento = async(req,res = response)=>{

	const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
          });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


	
}




// crearEvento
// actualizarEvento
// eliminarEvento

module.exports = {
    getEventos,
    crearEvento,
	actualizarEvento,
	eliminarEvento,
   
}