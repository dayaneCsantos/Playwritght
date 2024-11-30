import { test, expect } from '@playwright/test'

test.beforeEach('Abre a url do ToDOMVC', async ({ page }) => {
    await page.goto('/examples/react/dist/#')
})

test.describe('Todos - Default', () => {
    test('Deverá carregar o site do TodoMVC: React', async ({ page}) => {

        const inputText = page.getByTestId('text-input')

        await expect(page).toHaveTitle('TodoMVC: React')
        await expect(inputText).toBeVisible()
    })
    test('Deverá cadastrar uma lista de itens com sucesso', async ({ page }) => {
        const inputText = page.getByTestId('text-input')
        const listaCompra = ['Banana', 'Maça', 'Abacate']

        for (let i of listaCompra){
            await inputText.click()
            await inputText.fill(i)
            await inputText.press('Enter')
        }
        const itens = page.getByTestId('footer')
        const ul = page.locator('ul.todo-list li')
        const listaItens = await ul.evaluateAll( itens => itens.length)
        const filterAll = page.locator('a[href="#/"]')

        await expect(itens).toContainText('3 items left!')
        await expect(listaItens).toBe(3)
        await expect(filterAll).toHaveClass(/selected/)
    })
    test('Deverá excluir um item com sucesso', async ({ page }) => {
        const inputText = page.getByTestId('text-input')
        await inputText.click()
        await inputText.fill('Banana')
        await inputText.press('Enter')
        const itemLabel = page.getByTestId('todo-item-label')
        const buttonExclud = page.getByTestId('todo-item-button')
        await itemLabel.hover()
        await buttonExclud.click()
        const ul = page.locator('ul.todo-list li')
        const listaItens = await ul.evaluateAll( itens => itens.length)

        await expect(listaItens).toBe(0)
    })
})

test.describe('Todos - Filtragem', () => {
    test.beforeEach('Cadastra lista de todos', async ({ page }) => {
        const listaCompra = ['Banana', 'Maça', 'Abacate', 'Laranja', 'Pera']
        const inputText = page.getByTestId('text-input')

        for (let i of listaCompra){
            await inputText.click()
            await inputText.fill(i)
            await inputText.press('Enter')
        }
    })

    test('Deverá filtrar por Active', async ({ page }) => {
        const itemChecked = page.getByTestId('todo-item-toggle').first()
        await itemChecked.click()
        const activeItens = page.getByRole('link', { name: 'Active' })
        await activeItens.click()
        const filterActive = page.locator('a[href="#/active"]')
        const ul = page.locator('ul.todo-list li')
        const listaItens = await ul.evaluateAll( itens => itens.length)
        const itensLeft = page.locator('span[class="todo-count"]')

        await expect(filterActive).toHaveClass(/selected/)
        await expect(itensLeft).toHaveText('4 items left!')
        await expect(listaItens).toBe(4)

    })
    test('Deverá filtrar por Completed', async ({ page }) => {
        const itemChecked = page.getByTestId('todo-item-toggle').first()
        await itemChecked.click()
        const completedItens = page.getByRole('link', { name: "Completed" })
        await completedItens.click()
        const filterCompleted = page.locator('a[href="#/completed"]')
        const itensLeft = page.locator('span[class="todo-count"]')
        const ul = page.locator('ul.todo-list li')
        const listaItens = await ul.evaluateAll( itens => itens.length)
  
        await expect(filterCompleted).toHaveClass(/selected/)
        await expect(itensLeft).toHaveText('4 items left!')
        await expect(listaItens).toBe(1)
        await expect(itemChecked).toBeChecked()
    })
    test('Deverá excluir os itens completed', async ({ page }) => {
        const itemChecked = page.getByTestId('todo-item-toggle').first()
        await itemChecked.click()
        const completedItens = page.getByRole('link', { name: "Completed" })
        await completedItens.click()
        const clearCompleted = page.getByRole('button', { name: "Clear completed" })
        await clearCompleted.click()
        const itensLeft = page.locator('span[class="todo-count"]')
        const ul = page.locator('ul.todo-list li')
        const listaItens = await ul.evaluateAll( itens => itens.length)
        const filterCompleted = page.locator('a[href="#/completed"]')

        await expect(filterCompleted).toHaveClass(/selected/)
        await expect(itensLeft).toHaveText('4 items left!')
        await expect(listaItens).toBe(0)
    })
})