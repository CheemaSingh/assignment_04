'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');

exports.register = function(server, options, next) {
const db = server.app.db;

server.route({  
    method: 'GET',
    path: '/Items',
    handler: function (request, reply) {

        db.groceries.find((err, docs) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            reply(docs);
        });

    }
});



server.route({  
    method: 'GET',
    path: '/Items/{id}',
    handler: function (request, reply) {
        var mysort = { price: 1 };
        db.groceries.find({
            itemName: request.params.id
        }).sort(mysort).toArray(function(err, result) {
         if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (!result) {
                return reply(Boom.notFound());
            }

            reply(result);
  });
    }
});



server.route({  
    method: 'POST',
    path: '/Items',
    handler: function (request, reply) {

        const groceries = request.payload;
        groceries._id = uuid.v1();

        db.groceries.save(groceries, (err, result) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            reply(groceries);
        });
    },
    config: {
        validate: {
            payload: {
                itemName: Joi.string().min(3).max(50).required(),
                price: Joi.string().min(1).max(50).required(),
                store: Joi.string().min(3).max(50).required(),
                date: Joi.string().min(3).max(50).required(),
                comment: Joi.string().min(3).max(50).optional()                
            }
        }
    }
});


server.route({  
    method: 'PUT',
    path: '/Items/{id}',
    handler: function (request, reply) {

        db.groceries.update({
            itemName: request.params.id
        }, {
            $set: request.payload
        }, function (err, result) {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (result.n === 0) {
                return reply(Boom.notFound());
            }

            reply().code(204);
        });
    },
    config: {
        validate: {
            payload: Joi.object({
                itemName: Joi.string().min(3).max(50).optional(),
                price: Joi.string().min(1).max(50).optional(),
                store: Joi.string().min(3).max(50).optional(),
                date: Joi.string().min(3).max(50).optional(),
                comment: Joi.string().min(3).max(50).optional() 
            }).required().min(1)
        }
    }
});


server.route({  
    method: 'DELETE',
    path: '/Items/{id}',
    handler: function (request, reply) {

        db.groceries.remove({
            itemName: request.params.id
        }, function (err, result) {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (result.n === 0) {
                return reply(Boom.notFound());
            }

            reply().code(204);
        });
    }
});





  return next();
};

exports.register.attributes = {  
  name: 'routes-groceries'
};