const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

afterEach(() => {
  sinon.restore();
});


describe('RegisterUser Function Test', () => {

  it('should create a new user successfully', async () => {
    // Mock request data
    const req = {
      body: { name: "Yoonjin", email: "yoonjin@test.com", password: "123456" }
    };

    // Stub User.findOne to return null
    const findOneStub = sinon.stub(User, 'findOne').resolves(null);

    // Mock user that would be created
    const createdUser = {
      id: new mongoose.Types.ObjectId().toString(),
      name: req.body.name,
      email: req.body.email
    };

    // Stub User.create to return the createdUser
    const createStub = sinon.stub(User, 'create').resolves(createdUser);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerUser(req, res);

    // Assertions
    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.firstCall.args[0]).to.deep.equal({ email: req.body.email });

    expect(createStub.calledOnce).to.be.true;
    expect(createStub.firstCall.args[0]).to.deep.equal({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'student',
      university: '',
      address: ''
    });

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(201);
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];
    expect(responseData.name).to.equal(createdUser.name);
    expect(responseData.email).to.equal(createdUser.email);
    expect(responseData).to.have.property('token');
  });

  it('should return 400 if user already exists', async () => {
    // Stub User.findOne to return an existing user
    sinon.stub(User, 'findOne').resolves({
      id: new mongoose.Types.ObjectId().toString(),
      name: "Existing User",
      email: "existing@test.com"
    });

    // Mock request data
    const req = {
      body: { name: "Yoonjin", email: "existing@test.com", password: "123456" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerUser(req, res);

    // Assertions
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(400);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ message: 'User already exists' });
  });

  it('should return 500 if an error occurs', async () => {
    // Stub User.findOne to throw an error
    sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      body: { name: "Yoonjin", email: "yoonjin@test.com", password: "123456" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerUser(req, res);

    // Assertions
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(500);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.include({ message: 'DB Error' });
  });

});


describe('Login Function Test', () => {

  it('should login user successfully', async () => {
    // Mock user data
    const user = {
      id: new mongoose.Types.ObjectId().toString(),
      name: "Yoonjin",
      email: "yoonjin@test.com",
      password: "hashedpassword"
    };

    // Stub User.findOne to return mock user
    const findOneStub = sinon.stub(User, 'findOne').resolves(user);

    // Stub bcrypt.compare to return true
    const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);

    // Mock request & response
    const req = {
      body: { email: "yoonjin@test.com", password: "123456" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await loginUser(req, res);

    // Assertions
    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.firstCall.args[0]).to.deep.equal({ email: req.body.email });

    expect(compareStub.calledOnce).to.be.true;
    expect(compareStub.firstCall.args[0]).to.equal(req.body.password);
    expect(compareStub.firstCall.args[1]).to.equal(user.password);

    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];
    expect(responseData.name).to.equal(user.name);
    expect(responseData.email).to.equal(user.email);
    expect(responseData).to.have.property('token');
  });

  it('should return 401 if email or password is invalid', async () => {
    // Stub User.findOne to return mock user
    sinon.stub(User, 'findOne').resolves({
      id: new mongoose.Types.ObjectId().toString(),
      name: "Yoonjin",
      email: "yoonjin@test.com",
      password: "hashedpassword"
    });

    // Stub bcrypt.compare to return false
    sinon.stub(bcrypt, 'compare').resolves(false);

    // Mock request & response
    const req = {
      body: { email: "yoonjin@test.com", password: "wrongpassword" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await loginUser(req, res);

    // Assertions
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(401);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('should return 500 on error', async () => {
    // Stub User.findOne to throw an error
    sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    // Mock request & response
    const req = {
      body: { email: "yoonjin@test.com", password: "123456" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await loginUser(req, res);

    // Assertions
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(500);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.include({ message: 'DB Error' });
  });

});


describe('GetProfile Function Test', () => {

  it('should return profile for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock user data
    const user = {
      _id: userId,
      name: "Yoonjin",
      email: "yoonjin@test.com",
      role: "student",
      university: "QUT",
      address: "Brisbane"
    };

    // Stub User.findById to return mock user
    const findByIdStub = sinon.stub(User, 'findById').resolves(user);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProfile(req, res);

    // Assertions
    expect(findByIdStub.calledOnce).to.be.true;
    expect(findByIdStub.firstCall.args[0]).to.equal(req.user.id);

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(200);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({
      name: user.name,
      email: user.email,
      role: user.role,
      university: user.university,
      address: user.address
    });
  });

  it('should return 404 if user is not found', async () => {
    // Stub User.findById to return null
    sinon.stub(User, 'findById').resolves(null);

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProfile(req, res);

    // Assertions
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(404);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ message: 'User not found' });
  });

  it('should return 500 on error', async () => {
    // Stub User.findById to throw an error
    sinon.stub(User, 'findById').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getProfile(req, res);

    // Assertions
    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(500);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.include({ message: 'Server error' });
    expect(res.json.firstCall.args[0]).to.deep.include({ error: 'DB Error' });
  });

});


describe('UpdateUserProfile Function Test', () => {

  it('should update user profile successfully', async () => {
    // Mock user data
    const userId = new mongoose.Types.ObjectId();
    const existingUser = {
      _id: userId,
      id: userId.toString(),
      name: "Old Name",
      email: "old@test.com",
      university: "Old University",
      address: "Old Address",
      save: sinon.stub().resolvesThis(), // Mock save method
    };

    // Stub User.findById to return mock user
    const findByIdStub = sinon.stub(User, 'findById').resolves(existingUser);

    // Mock request & response
    const req = {
      user: { id: userId },
      body: {
        name: "New Name",
        email: "new@test.com",
        university: "QUT",
        address: "Brisbane"
      }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateUserProfile(req, res);

    // Assertions
    expect(existingUser.name).to.equal("New Name");
    expect(existingUser.email).to.equal("new@test.com");
    expect(existingUser.university).to.equal("QUT");
    expect(existingUser.address).to.equal("Brisbane");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];
    expect(responseData.name).to.equal("New Name");
    expect(responseData.email).to.equal("new@test.com");
    expect(responseData.university).to.equal("QUT");
    expect(responseData.address).to.equal("Brisbane");
    expect(responseData).to.have.property('token');
  });

  it('should return 404 if user is not found', async () => {
    sinon.stub(User, 'findById').resolves(null);

    const req = { user: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateUserProfile(req, res);

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(404);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ message: 'User not found' });
  });

  it('should return 500 on error', async () => {
    sinon.stub(User, 'findById').throws(new Error('DB Error'));

    const req = { user: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateUserProfile(req, res);

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(500);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.include({ message: 'DB Error' });
  });

});