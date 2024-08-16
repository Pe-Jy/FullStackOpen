const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlogs = [
  {
    "title": "Testi3",
    "author": "Testi3 Testinen3",
    "url": "https://testimoinen3.com",
    "likes": 667,
  },
  {
    "title": "Testi",
    "author": "Testi Testinen",
    "url": "https://testimoinen.com",
    "likes": 666,
  },
  {
    "title": "Testi2",
    "author": "Testi Testinen2",
    "url": "https://testimoinen2.com",
    "likes": 666,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON)
}

const createUser = async () => {
  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({ username: 'Keijo', passwordHash})

  await user.save()
  return user
}

const loginUser = async () => {
  const user = {
    username: 'Keijo', 
    password: 'salasana'
  }

  const response = await api  
    .post('/api/login')
    .send(user
    )
  
  return response.body.token
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb, createUser, loginUser
}