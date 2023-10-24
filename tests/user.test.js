const { JsonWebTokenError } = require('jsonwebtoken')
const request = require('supertest')
const app = require('../app')
const db = require('../model/sequelize')



  describe('Auth tests', () =>{
    let thisDb = db
    let userId = null
    let forumId = null
    let postId = null
    let token = null
    beforeAll(async () => {
        const value = await thisDb.post.destroy({where: {}, force: true})
                .then(()=> { return thisDb.user_history.destroy({ where: {}, force: true})})
                .then(()=> { return thisDb.forum.destroy({  where: {}, force: true})})
                .then(()=> { return thisDb.user.destroy({  where: {}, force: true })});   
      await request(app)
        .post('/auth/register')
        .send({
            "name":"Bob Fischer",
            "email": "bob@2.com",
            "password": "12345678",
        })
      await request(app)
        .post('/auth/login')
        .send({
            password: "12345678",
            email: "bob@2.com"
        }).then(res => {
          userId = res.body.model.id
          token = res.body.jwt
        });
      await request(app)
      .post('/forum')
      .send({
        "name": "I need a Life",
        "details": "As mentioned in the title, i need life.",
        "token":token
      }).then(res => {
        forumId = res.body.model.id
      });
      await request(app)
        .post('/post')
        .send({
          "ForumId": forumId,
          "token": token,
          "details": "Just get one."
        }).then(res => {
          postId = res.body.model.id
        });
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    })

    it('should register new user', async () =>{
        const res = await request(app)
        .post('/auth/register')
        .send({
            "name":"Brake Gnewood",
            "email": "Brake@2521.com",
            "password": "12345678",
        })
      expect(res.statusCode).toEqual(200)
      expect(typeof res.body.model.certificate).toEqual('string')
    })

    it('should not register new user without name', async () =>{
      const res = await request(app)
      .post('/auth/register')
      .send({
          "email": "bob@2522.com",
          "password": "12345678",
      })
      
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual("Name can not be empty!")
  })

it("should not register new user without email", async () =>{
  const res = await request(app)
  .post('/auth/register')
  .send({
      "name":"Brake Job",
      "password": "12345678",
  })
  expect(res.statusCode).toEqual(400)
  expect(res.body.error).toEqual("Email can not be empty!")
})

    it('should login as user', async () =>{
        const res = await request(app)
        .post('/auth/login')
        .send({
            password: "12345678",
            email: "Brake@2521.com"
        })
      expect(res.statusCode).toEqual(200)
    })
    

    it('should give error with wrong token', async () =>{
      const res = await request(app)
      .get('/users')
      .send({
          "token": "Nep token"
      })
     
    expect(res.body.error).toEqual('Failed to authenticate token.')
  })
  it('should give 404 status with wrong url', async () =>{
    const res = await request(app)
    .get('/usernames')
    .send({
        "token": "Nep token"
    })
    
    expect(res.statusCode).toEqual(404)
})



it('should get users', async () =>{
  const res = await request(app)
  .get('/users')
  
  expect(res.body.error).toEqual('Failed to authenticate token.')
})
    it('should get a single user', async () =>{
      const res = await request(app)
      .get('/users/' + userId)
      .send({
        "token": token
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.model.name).toEqual("Bob Fischer")
  })
  it('should update a single user', async () =>{
    const res = await request(app)
    .put('/users/' + userId)
    .send({
        "name":"bob",
        "token": token
    })

  expect(res.statusCode).toEqual(200)
  expect(res.body.success).toEqual(true)
})
    
it('should create new Forum', async () =>{
      const res = await request(app)
      .post('/forum')
      .send({
        "name": "I need a ride to NY for Song Fest",
        "details": "As mentioned in the title, i would like to know if there is someone willing to take me to the Song Fest from Boston.",
        "token":token
      })
      
    expect(res.statusCode).toEqual(200)
  })
  it('should not register new Forum without details', async () =>{
    const res = await request(app)
    .post('/forum')
    .send({
      "name": "I need a ride to NY for Song Fest",
      "token":token
    })
    
  expect(res.statusCode).toEqual(400)
    })
    it('should not register new Forum without name', async () =>{
      const res = await request(app)
      .post('/forum')
      .send({
        "details": "As mentioned in the title, i would like to know if there is someone willing to take me to the Song Fest from Boston.",
        "token":token
      })

    expect(res.statusCode).toEqual(400)
    })
      it('should get Forums', async () =>{
        const res = await request(app)
        .get('/view/forum')
        .send({
          "token": token
        })

      expect(res.statusCode).toEqual(200)
    })
    it('should get a Forum', async () =>{
      const res = await request(app)
      .get('/view/forum/' + forumId)
      .send({
        "token": token
      })

    expect(res.statusCode).toEqual(200)
    })  

    it('should update a Forum', async () =>{
      const res = await request(app)
      .put('/forum/' + forumId)
      .send({

        "token": token,
        "name": "I need a ride to NY for Song Fest from Boston"
      })

    expect(res.statusCode).toEqual(200)
    })

    it('should create new Post', async () =>{
      const res = await request(app)
      .post('/post')
      .send({
        "ForumId": forumId,
        "token": token,
        "details": "You can try walking. XD"
      })

    expect(res.statusCode).toEqual(200)
    })
    it('should not register new Post without details', async () =>{
    const res = await request(app)
    .post('/post')
    .send({
      "token": token,
    })

    expect(res.statusCode).toEqual(400)
    })

    it('should get Posts', async () =>{
    const res = await request(app)
    .get('/view/post')
    .send({
      "token": token
    })

    expect(res.statusCode).toEqual(200)
    })
    it('should get a Post', async () =>{
    const res = await request(app)
    .get('/view/post/' + postId)
    .send({

    "token": token
    })

    expect(res.statusCode).toEqual(200)
    })  

    it('should update a Post', async () =>{
    const res = await request(app)
    .put('/post/' + postId)
    .send({
    "token": token,
    "details": "You can try walking to that dumb Fest. XD"
    })

    expect(res.statusCode).toEqual(200)
    })

    it('should get all history', async () =>{
      const res = await request(app)
      .get('/history')
      .send({
        "token":token
      })
    expect(res.statusCode).toEqual(200)
    })
    
    afterAll(async () => {
        await thisDb.sequelize.close()
    })
})

  
