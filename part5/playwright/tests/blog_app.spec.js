const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'Joo',
        password: 'test'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User II',
        username: 'Joo II',
        password: 'test II',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('blogs')).toBeVisible()
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('Joo')
      await page.getByTestId('password').fill('test')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()

      const logoutButton = (page.getByRole('button', { name: 'logout' }))
      await expect(logoutButton).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('Joo')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(errorDiv).toHaveCSS('background-color', 'rgb(211, 211, 211)')
      await expect(errorDiv).toHaveCSS('font-size', '20px')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('Joo')
      await page.getByTestId('password').fill('test')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle')
      await page.getByTestId('author').fill('TestAuthor')
      await page.getByTestId('url').fill('TestURL')
      await page.getByRole('button', { name: 'create' }).click()

      const addedDiv = await page.locator('.added')
      await expect(addedDiv).toHaveCSS('border-style', 'solid')
      await expect(addedDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(addedDiv).toHaveCSS('background-color', 'rgb(211, 211, 211)')
      await expect(addedDiv).toHaveCSS('font-size', '20px')
      await expect(addedDiv).toContainText('a new blog TestTitle by TestAuthor added')

      const blogDiv = await page.locator('.blog')
      const viewButton = (page.getByRole('button', { name: 'view' }))
      await expect(blogDiv).toContainText('TestTitle TestAuthor')
      await expect(viewButton).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle')
      await page.getByTestId('author').fill('TestAuthor')
      await page.getByTestId('url').fill('TestURL')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      const blogDiv = await page.locator('.blog')
      await expect(blogDiv).toContainText('likes 1')
    })

    test('a blog can be deleted by the creator', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle')
      await page.getByTestId('author').fill('TestAuthor')
      await page.getByTestId('url').fill('TestURL')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      const blogDiv = await page.locator('.blog')

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(blogDiv).not.toBeVisible()
    })

    test('only the creator of a blog can see the remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle')
      await page.getByTestId('author').fill('TestAuthor')
      await page.getByTestId('url').fill('TestURL')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      const removeButton = (page.getByRole('button', { name: 'remove' }))
      await expect(removeButton).toBeVisible()

      await page.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByTestId('username').fill('Joo II')
      await page.getByTestId('password').fill('test II')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(removeButton).not.toBeVisible()
    })

    test('blogs are sorted in descending order by likes', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle')
      await page.getByTestId('author').fill('TestAuthor')
      await page.getByTestId('url').fill('TestURL')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle2')
      await page.getByTestId('author').fill('TestAuthor2')
      await page.getByTestId('url').fill('TestURL2')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'create new blog ' }).click()
      await page.getByTestId('title').fill('TestTitle3')
      await page.getByTestId('author').fill('TestAuthor3')
      await page.getByTestId('url').fill('TestURL3')
      await page.getByRole('button', { name: 'create' }).click()

      await page.waitForTimeout(500)

      const blogDiv = await page.locator('.blog')

      await blogDiv.getByText('TestTitle TestAuthor view').locator('..').getByRole('button', { name: 'view' }).click()
      await blogDiv.getByText('TestTitle TestAuthor view').locator('..').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)

      await blogDiv.getByText('TestTitle2 TestAuthor2 view').locator('..').getByRole('button', { name: 'view' }).click()
      await blogDiv.getByText('TestTitle2 TestAuthor2 view').locator('..').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await blogDiv.getByText('TestTitle2 TestAuthor2 view').locator('..').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await blogDiv.getByText('TestTitle2 TestAuthor2 view').locator('..').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)

      await blogDiv.getByText('TestTitle3 TestAuthor3 view').locator('..').getByRole('button', { name: 'view' }).click()
      await blogDiv.getByText('TestTitle3 TestAuthor3 view').locator('..').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)
      await blogDiv.getByText('TestTitle3 TestAuthor3 view').locator('..').getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(500)

      const blogTitles = await page.locator('.blog').allTextContents()

      expect(blogTitles[0]).toContain('TestTitle2')
      expect(blogTitles[1]).toContain('TestTitle3')
      expect(blogTitles[2]).toContain('TestTitle')
    })
  })
})