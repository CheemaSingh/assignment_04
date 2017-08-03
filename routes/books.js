'use strict';

const Boom = require('boom');  
const uuid = require('node-uuid');  
const Joi = require('joi');

exports.register = function(server, options, next) {
const db = server.app.db;

server.route({  
    method: 'GET',
    path: '/books',
    handler: function (request, reply) {

        db.books.find((err, docs) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            reply(docs);
        });

    }
});



server.route({  
    method: 'GET',
    path: '/books/{id}',
    handler: function (request, reply) {

        db.books.findOne({
            _id: request.params.id
        }, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });

    }
});


server.route({  
    method: 'GET',
    path: '/booksbytitle/{title}',
    handler: function (request, reply) {

        db.books.find({
            title: request.params.title
        }, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });

    }
});


server.route({  
    method: 'GET',
    path: '/booksbygenre/{genre}',
    handler: function (request, reply) {

        db.books.find({
            genre: request.params.genre
        }, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });

    }
});



server.route({  
    method: 'GET',
    path: '/bookbyauthor/{author}',
    handler: function (request, reply) {

        db.books.find({
            author: request.params.author
        }, (err, doc) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });

    }
});




server.route({  
    method: 'POST',
    path: '/books',
    handler: function (request, reply) {

        const book = request.payload;
        book._id = uuid.v1();

        db.books.save(book, (err, result) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            reply(book);
        });
    },
    config: {
        validate: {
            payload: {
                title: Joi.string().min(10).max(50).required(),
                author: Joi.string().min(10).max(50).required(),
                genre: Joi.string().min(3).max(50).required(),
                publisher: Joi.string().min(3).max(50).required(),
                publishDate: Joi.string().min(7).max(20).required(),
                edition: Joi.string().min(1).max(20).required(),
                isbn: Joi.number().required(),
                copies: Joi.number().required()
            }
        }
    }
});


server.route({  
    method: 'PATCH',
    path: '/books/{id}',
    handler: function (request, reply) {

        db.books.update({
            _id: request.params.id
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
                title: Joi.string().min(10).max(50).optional(),
                author: Joi.string().min(10).max(50).optional(),
                genre: Joi.string().min(3).max(50).optional(),
                publisher: Joi.string().min(3).max(50).optional(),
                publishDate: Joi.string().min(7).max(20).optional(),
                edition: Joi.string().min(7).max(20).optional(),
                isbn: Joi.number().optional(),
                copies: Joi.number().optional()
            }).required().min(1)
        }
    }
});


server.route({  
    method: 'DELETE',
    path: '/books/{id}',
    handler: function (request, reply) {

        db.books.remove({
            _id: request.params.id
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
  name: 'routes-books'
};