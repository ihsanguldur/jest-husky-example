const supertest = require('supertest');

global.env = 'test';

const userService = require('../service/userService');
const app = require('../app');

const userInput = {
    email: "test@test.com",
    password: "123456"
}

describe('user', () => {
    describe('register', () => {
        describe('given the email and password are valid', () => {
            it('should return with registered message', async () => {
                const createUserMockService = jest
                    .spyOn(userService, 'create')
                    .mockReturnValueOnce(true);

                const {statusCode, body} = await supertest(app)
                    .post('/users/register')
                    .send(userInput);

                expect(statusCode).toBe(200);
                expect(body).toEqual({status: 'registered'});

                expect(createUserMockService).toBeCalledWith(userInput.email, userInput.password);
            });
        });

        describe('given the email or password are invalid', () => {
            it('should return with 400', async () => {
                const createUserMockService = jest
                    .spyOn(userService, 'create')
                    .mockReturnValueOnce(true);

                const {statusCode} = await supertest(app)
                    .post('/users/register')
                    .send({...userInput, email: null, password: null});

                expect(statusCode).toBe(400);

                expect(createUserMockService).not.toHaveBeenCalled();
            });
        });

        describe('given the register throws', () => {
            it('should return with 500', async () => {
                const createUserMockService = jest
                    .spyOn(userService, 'create')
                    .mockRejectedValue('bad type of data');

                const {statusCode} = await supertest(app)
                    .post('/users/register')
                    .send(userInput);

                expect(statusCode).toBe(500);

                expect(createUserMockService).toHaveBeenCalled();
            });
        });
    });

    describe('login', () => {
        describe('given the correct email and password', () => {
            it('should return JWT', async () => {
                const loginMockService = jest
                    .spyOn(userService, 'findOne')
                    .mockReturnValueOnce({
                        "id": 12,
                        "content": "test 2",
                        "state": 1,
                        "userID": 28,
                        "createdAt": "2023-02-17T22:39:27.000Z",
                        "updatedAt": "2023-02-17T22:39:27.000Z"
                    });

                const {statusCode, body} = await supertest(app)
                    .post('/users/login')
                    .send(userInput)

                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    token: expect.any(String)
                });

                expect(loginMockService).toHaveBeenCalledWith(userInput.email, userInput.password);
            });
        });

        describe('given the email or password are invalid', () => {
            it('should return with 400', async () => {
                const loginMockService = jest
                    .spyOn(userService, 'findOne')
                    .mockReturnValueOnce({
                        "id": 12,
                        "content": "test 2",
                        "state": 1,
                        "userID": 28,
                        "createdAt": "2023-02-17T22:39:27.000Z",
                        "updatedAt": "2023-02-17T22:39:27.000Z"
                    });

                const {statusCode} = await supertest(app)
                    .post('/users/login')
                    .send({...userInput, email: null, password: null})

                expect(statusCode).toBe(400);

                expect(loginMockService).not.toHaveBeenCalled();
            });
        });

        describe('given the user is not exists', () => {
            it('should return error 400 and not found', async () => {
                const loginMockService = jest
                    .spyOn(userService, 'findOne')
                    .mockReturnValueOnce(null);

                const {statusCode, body} = await supertest(app)
                    .post('/users/login')
                    .send(userInput)

                expect(statusCode).toBe(400);
                expect(body).toEqual({err: "user not found"});

                expect(loginMockService).toHaveBeenCalledWith(userInput.email, userInput.password);
            });
        });

        describe('given the login throws', () => {
            it('should return with 500', async () => {
                const loginMockService = jest
                    .spyOn(userService, 'findOne')
                    .mockRejectedValue('bad type of data');

                const {statusCode} = await supertest(app)
                    .post('/users/login')
                    .send(userInput);

                expect(statusCode).toBe(500);

                expect(loginMockService).toHaveBeenCalled();
            });
        });
    });
});