const supertest = require('supertest');
const generateToken = require('../helper/generateToken');

global.env = 'test';

const todoService = require('../service/todoService');
const app = require('../app');
const userService = require("../service/userService");

const todoInput = {
    content: "test",
    state: true,
}

describe('todo', () => {
    describe('create todo', () => {
        describe('given the user is not authenticate', () => {
            it('should return a 401', async () => {
                const getTodoServiceMock = jest
                    .spyOn(todoService, 'create')
                    .mockReturnValueOnce(true);

                const {statusCode} = await supertest(app)
                    .post('/todos/')
                    .send(todoInput);

                expect(statusCode).toBe(401);

                expect(getTodoServiceMock).not.toHaveBeenCalled();
            });
        });

        describe('given the user is authenticate', () => {
            it('should return with created message', async () => {
                const token = generateToken({sub: "1"});

                const getTodoServiceMock = jest
                    .spyOn(todoService, 'create')
                    .mockReturnValueOnce(true);

                const {statusCode, body} = await supertest(app)
                    .post('/todos/')
                    .set('Authorization', token)
                    .send(todoInput);

                expect(statusCode).toBe(200);
                expect(body).toEqual({status: 'created'});

                expect(getTodoServiceMock).toHaveBeenCalledWith(todoInput.content, expect.any(Boolean), "1");
            });
        });

        describe('given the content is empty', () => {
            it('should return with 400', async () => {
                const token = generateToken({sub: "1"});

                const getTodoServiceMock = jest
                    .spyOn(todoService, 'create')
                    .mockReturnValueOnce(true);

                const {statusCode} = await supertest(app)
                    .post('/todos/')
                    .set('Authorization', token)
                    .send({...todoInput, content: undefined});

                expect(statusCode).toBe(400);

                expect(getTodoServiceMock).not.toHaveBeenCalled();
            });
        });

        describe('given the create throws', () => {
            it('should return with 500', async () => {
                const token = generateToken({sub: "1"});

                const getTodoServiceMock = jest
                    .spyOn(todoService, 'create')
                    .mockRejectedValue("bad type of data");

                const {statusCode} = await supertest(app)
                    .post('/todos/')
                    .set('Authorization', token)
                    .send(todoInput);

                expect(statusCode).toBe(500);

                expect(getTodoServiceMock).toHaveBeenCalled();
            });
        });
    });
});