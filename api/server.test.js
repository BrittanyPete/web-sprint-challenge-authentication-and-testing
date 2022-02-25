const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

const user1 = {
  username: 'marge',
  password: '1234'
}

const user2 = {
  username: 'homer',
  password: '1234'
}

const user3 = {
  username: '',
  password: ''
}

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  it('should return a 401 status if username exists', async () => {
    let res = await request(server).post('/api/auth/register').send(user1)
    res = await request(server).post('/api/auth/register').send(user1)
    expect(res.status).toBe(401)
  })
  it('should return a 400 status and message of username and password required if missing username or password', async () => {
    let res = await request(server).post('/api/auth/register').send(user3)
    expect(res.status).toBe(400)
    expect(res.body.message).toEqual('username and password required')
  })
  it('should return a 201 status if new user is created', async () => {
    let res = await request(server).post('/api/auth/register').send(user2)
    expect(res.status).toBe(201)
  })
})

describe('[POST] /api/auth/login', () => {
  it('should return a 400 status if missing username or password', async () => {
    let res = await request(server).post('/api/auth/login').send(user3)
    expect(res.status).toBe(400)
  })
  it('should respond with the logged in user', async () => {
    let res = await request(server).post('/api/auth/login').send(user1)
    expect(res.body.message).toEqual(`welcome, ${user1.username}`)
  })
})

describe('[GET] /api/jokes', () => {
  it('should return token required if not logged in', async () => {
    let res = await request(server).get('/api/jokes')
    expect(res.body.message).toEqual('token required')
  })
  it('should return the jokes array if logged in', async () => {
    let res = await request(server).post('/api/auth/login').send(user1)
    res = await request(server).get('/api/jokes').set({'Authorization': res.body.token})
    expect(res.body).toHaveLength(3)
  })
})