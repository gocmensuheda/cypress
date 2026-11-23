describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('geçersiz e-posta girildiğinde hata mesajı gösterir ve butonu pasif tutar', () => {
    cy.get('[data-cy="email-input"]').type('hatali-eposta');
    cy.get('[data-cy="password-input"]').type('GucluSifre1');
    cy.get('[data-cy="terms-checkbox"]').check();

    cy.contains('Geçerli bir e-posta adresi giriniz.').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('zayıf şifre girildiğinde hata mesajı gösterir ve butonu pasif tutar', () => {
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('zayif');
    cy.get('[data-cy="terms-checkbox"]').check();

    cy.contains(
      'Şifre en az 8 karakter olmalı; en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.'
    ).should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('şartlar kutusu işaretlenmezse submit butonu pasif kalır', () => {
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('GucluSifre1');

    cy.get('[data-cy="submit-button"]').should('be.disabled');
  });

  it('tüm alanlar geçerli olduğunda butonu aktif eder ve başarılı girişte /success sayfasına yönlendirir', () => {
    cy.intercept('GET', 'https://6540a96145bedb25bfc247b4.mockapi.io/api/login', {
      statusCode: 200,
      body: [
        {
          email: 'kullanici@ornek.com',
          password: 'Password123',
        },
      ],
    }).as('loginRequest');

    cy.get('[data-cy="email-input"]').type('kullanici@ornek.com');
    cy.get('[data-cy="password-input"]').type('Password123');
    cy.get('[data-cy="terms-checkbox"]').check();

    cy.get('[data-cy="submit-button"]').should('be.enabled').click();
    cy.wait('@loginRequest');

    cy.url().should('include', '/success');
    cy.contains('Giriş Başarılı').should('be.visible');
  });
});