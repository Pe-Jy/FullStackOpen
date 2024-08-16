const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (previousBlog, currentBlog) => {
    return previousBlog.likes > currentBlog.likes
      ? previousBlog
      : currentBlog
  }

  const favorite = blogs.reduce(reducer)

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogAmounts = blogs.reduce((acc, blog) => {
    console.log(acc, blog)
    acc[blog.author] = (acc[blog.author] || 0) + 1
    console.log(acc)
    return acc
  }, {})

  const authorMostBlogs = Object.keys(blogAmounts).reduce((a, b) => {
    console.log(a, b)
    console.log('blog amount A:', blogAmounts[a], 'blog amount B:', blogAmounts[b])
    return blogAmounts[a] > blogAmounts[b]
      ? a
      : b
  })

  return {
    author: authorMostBlogs,
    blogs: blogAmounts[authorMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likeAmounts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    console.log('likeAmounts:', acc)
    return acc
  }, {})

  const authorMostLikes = Object.keys(likeAmounts).reduce((a, b) => {
    return likeAmounts[a] > likeAmounts[b]
      ? a
      : b
  })

  return {
    author: authorMostLikes,
    likes: likeAmounts[authorMostLikes]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}