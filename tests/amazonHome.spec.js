import {test, expect } from '@playwright/test'

test.use({
    locale: 'pt-BR',
    headless: true
})


test.beforeEach(async ({ page }) => {
    global.page = page
})

test.afterEach(async ({ page }) => {
    await page.close()
})


test('Validar tela principal da amazon', async () =>{
    
    await test.step('Navegue para a tela principal da amazon', async () => {
        await page.goto('https://www.amazon.com.br/')
    })

    await test,step('Deverá apresentar a tela inicial da Amazon', async () => {
        const currentUrl = page.url ()
        expect(currentUrl).toBe('https://www.amazon.com.br/')
    })

    await test.step('Deverá validar que a página está visível', async () => {
        await page.waitForSelector('#nav-logo-sprites')

        await expect('#nav-logo-sprites').toBeVisible()
        await expect('#twotabsearchtextbox').toBeVisible()
        await expect(('.nav-search-submit')).toBeVisible()
    })
})