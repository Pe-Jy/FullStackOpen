const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  await helper.createUser()
})

test('the amount of blogs is correct and blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the identifying field of the blogs is "id"', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(blog.id, undefined)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added with token', async () => {
  const token = await helper.loginUser()
  const newBlog = {
    title: "Testiä",
    author: "Testaaja Timo",
    url: "https://testitimo.com",
    likes: 666
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  const authors = response.body.map(r => r.author)
  const urls = response.body.map(r => r.url)
  const likes = response.body.map(r => r.likes)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('Testiä'))
  assert(authors.includes('Testaaja Timo'))
  assert(urls.includes("https://testitimo.com",))
  assert(likes.includes(666))
})

test('adding a blog without token return status code 401', async () => {
  const newBlog = {
    title: "Testiä, ei tokenia",
    author: "Testaaja Timo",
    url: "https://testitimo.com",
    likes: 333
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('default value of likes to 0 if likes not included', async () => {
  const token = await helper.loginUser()

  const newBlog = {
    title: "Testaajasta ei tykätä",
    author: "Testaaja Timo",
    url: "https://testitimo.com"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const postedBlog = response.body.find(blog => blog.title === newBlog.title)

  assert.strictEqual(postedBlog.likes, 0)
})

test('a blog without a title or an url returns status code 400', async () => {
  const token = await helper.loginUser()

  const newBlogNoTitle = {
    author: "Testaaja Timo",
    url: "https://testitimo.com",
    likes: 666
  }

  const newBlogNoUrl = {
    title: "Testiä",
    author: "Testaaja Timo",
    likes: 666
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogNoTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogNoUrl)
    .expect(400)
})

test('a blog can be deleted', async () => {
  await Blog.deleteMany({})
  const token = await helper.loginUser()

  const newBlog = {
    title: "Testi blogi",
    author: "Testaaja",
    url: "https://testiblogi.com",
    likes: 100
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, 0)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('trying to delete a blog with invalid id returns status code 400', async () => {
  const randomId = 'invalidId66666666666666'

  await api
    .delete(`/api/blogs/${randomId}`)
    .expect(400)
})

test('a blog can be edited', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogEdit = blogsAtStart[0]
  const editedLikes = { likes: 100 }

  await api
    .put(`/api/blogs/${blogEdit.id}`)
    .send(editedLikes)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  console.log('Start:', blogsAtStart, 'End: ', blogsAtEnd)
  const editedBlog = blogsAtEnd.find(blog => blog.id === blogEdit.id)

  assert.strictEqual(editedBlog.likes, 100)
})

test('trying to edit a blog with invalid id returns status code 400', async () => {
  const randomId = 'invalidId66666666666666'

  await api
    .put(`/api/blogs/${randomId}`)
    .expect(400)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'Ainoa', passwordHash, name: 'Jaska' })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ainoa',
      password: 'virtanen-järvinen',
      name: 'Erkki',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is under 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ai',
      password: 'virtanen-järvinen',
      name: 'Erkki',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length (3)'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      password: 'virtanen-järvinen',
      name: 'Erkki',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('`username` is required'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is under 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ainoa',
      password: 'vi',
      name: 'Erkki',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `password` to be at least 3 characters long'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ainoa',
      name: 'Erkki',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password required!'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})