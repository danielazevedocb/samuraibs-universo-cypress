
import signupPage from '../support/pages/signup'


describe('cadastro', function () {

  context('quando usuario é novato', function () {
    const user = {
      name: 'Daniel Azevedo',
      email: 'daniel@teste.com',
      password: '123456'
    }
    before(function () {
      cy.task('removeUser', user.email)
        .then(function (result) {
          console.log(result)
        })
    })
    it('deve cadastrar com sucesso', function () {
      signupPage.go()
      signupPage.form(user)
      signupPage.submit()
      signupPage.toast.shouldHaveTest('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
    })
  })
  context('quando o email já existir', function () {
    const user = {
      name: 'Jessica Tavares',
      email: 'jessica@teste.com',
      password: '123456',
      is_provider: true
    }
    before(function () {
      cy.task('removeUser', user.email)
        .then(function (result) {
          console.log(result)
        })
      cy.request(
        'POST',
        'http://localhost:3333/users',
        user
      ).then(function (response) {
        expect(response.status).to.eq(200)
      })
    })
    it('não deve cadastra usuario', function () {
      signupPage.go()
      signupPage.form(user)
      signupPage.submit()
      signupPage.toast.shouldHaveTest('Email já cadastrado para outro usuário.')

    })
  })
  context('quando email é incorreto', function () {
    const user = {
      name: 'Chris brown',
      email: 'chris.teste.com',
      password: '123456'
    }

    it('deve exibir mensagem de alerta', function () {
      signupPage.go()
      signupPage.form(user)
      signupPage.submit()
      signupPage.alertHaveText('Informe um email válido')
    })

  })
  context('quando a senha é muito curta', function () {

    const passwords = ['1', '12', '123', '1234', '12345']

    beforeEach(function () {
      signupPage.go()
    })

    passwords.forEach(function (p) {
      it('não deve cadastrar com a senha:  ' + p, function () {
        const user = {
          name: 'Simon Brown',
          email: 'simon@teste.com',
          password: p
        }

        signupPage.form(user)
        signupPage.submit()
      })
    })

    afterEach(function () {
      signupPage.alertHaveText('Pelo menos 6 caracteres')
    })

  })
  context.only('quando não preencho nenhum dos campo', function(){

    const alertMessages = [
      'Nome é obrigatório',
      'E-mail é obrigatório',
      'Senha é obrigatória'
    ]
    before(function(){
      signupPage.go()
      signupPage.submit()
    })

    alertMessages.forEach(function(alert){
      it('deve exibir' + alert.toLowerCase(), function(){
        signupPage.alertHaveText(alert)
      })
    })
  })

})

