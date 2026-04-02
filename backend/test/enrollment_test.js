const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { registerCourse, getMyCourses, dropCourse } = require('../controllers/enrollmentController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('RegisterCourse Function Test', () => {

  it('should register a course successfully', async () => {
    // Mock request data
    const studentId = new mongoose.Types.ObjectId();
    const courseId = new mongoose.Types.ObjectId();

    const req = {
      user: { id: studentId },
      body: { courseId }
    };

    // Mock course that would be found
    const course = {
      _id: courseId,
      seatsLeft: 5,
      save: sinon.stub().resolvesThis()
    };

    // Mock enrollment that would be created
    const createdEnrollment = {
      _id: new mongoose.Types.ObjectId(),
      student: studentId,
      course: courseId
    };

    // Stub Course.findById to return the course
    const courseStub = sinon.stub(Course, 'findById').resolves(course);

    // Stub Enrollment.findOne to return no existing enrollment
    const findOneStub = sinon.stub(Enrollment, 'findOne').resolves(null);

    // Stub Enrollment.create to return the created enrollment
    const createStub = sinon.stub(Enrollment, 'create').resolves(createdEnrollment);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerCourse(req, res);

    // Assertions
    expect(courseStub.calledOnceWith(req.body.courseId)).to.be.true;
    expect(findOneStub.calledOnceWith({
      student: req.user.id,
      course: course._id
    })).to.be.true;
    expect(createStub.calledOnceWith({
      student: req.user.id,
      course: course._id
    })).to.be.true;
    expect(course.seatsLeft).to.equal(4);
    expect(course.save.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdEnrollment)).to.be.true;

    // Restore stubbed methods
    courseStub.restore();
    findOneStub.restore();
    createStub.restore();
  });

  it('should return 404 if course is not found', async () => {
    // Stub Course.findById to return null
    const courseStub = sinon.stub(Course, 'findById').resolves(null);

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { courseId: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerCourse(req, res);

    // Assertions
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Course not found' })).to.be.true;

    // Restore stubbed methods
    courseStub.restore();
  });

  it('should return 400 if the course is full', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { courseId: new mongoose.Types.ObjectId() }
    };

    // Mock course that would be found
    const course = {
      _id: req.body.courseId,
      seatsLeft: 0
    };

    // Stub Course.findById to return the course
    const courseStub = sinon.stub(Course, 'findById').resolves(course);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerCourse(req, res);

    // Assertions
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Course full' })).to.be.true;

    // Restore stubbed methods
    courseStub.restore();
  });

  it('should return 400 if already enrolled', async () => {
    // Mock request data
    const studentId = new mongoose.Types.ObjectId();
    const courseId = new mongoose.Types.ObjectId();

    const req = {
      user: { id: studentId },
      body: { courseId }
    };

    // Mock course that would be found
    const course = {
      _id: courseId,
      seatsLeft: 5
    };

    // Stub Course.findById to return the course
    const courseStub = sinon.stub(Course, 'findById').resolves(course);

    // Stub Enrollment.findOne to return an existing enrollment
    const findOneStub = sinon.stub(Enrollment, 'findOne').resolves({
      _id: new mongoose.Types.ObjectId(),
      student: studentId,
      course: courseId
    });

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerCourse(req, res);

    // Assertions
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Already enrolled' })).to.be.true;

    // Restore stubbed methods
    courseStub.restore();
    findOneStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Course.findById to throw an error
    const courseStub = sinon.stub(Course, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { courseId: new mongoose.Types.ObjectId() }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await registerCourse(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    courseStub.restore();
  });

});


describe('GetMyCourses Function Test', () => {

  it('should return enrolled courses for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock enrollment data
    const enrollments = [
      {
        _id: new mongoose.Types.ObjectId(),
        student: userId,
        course: { _id: new mongoose.Types.ObjectId(), courseId: 'COMP101', courseName: 'Introduction to Programming' }
      },
      {
        _id: new mongoose.Types.ObjectId(),
        student: userId,
        course: { _id: new mongoose.Types.ObjectId(), courseId: 'CAB203', courseName: 'Data Structures' }
      }
    ];

    // Stub Enrollment.find to return mock enrollments
    const populateStub = sinon.stub().resolves(enrollments);
    const findStub = sinon.stub(Enrollment, 'find').returns({ populate: populateStub });

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getMyCourses(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ student: userId })).to.be.true;
    expect(populateStub.calledOnceWith('course')).to.be.true;
    expect(res.json.calledWith(enrollments)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Enrollment.find to throw an error
    const findStub = sinon.stub(Enrollment, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getMyCourses(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DropCourse Function Test', () => {

  it('should drop a course successfully', async () => {
    // Mock request data
    const courseId = new mongoose.Types.ObjectId();
    const enrollmentId = new mongoose.Types.ObjectId();

    const req = { params: { id: enrollmentId.toString() } };

    // Mock enrollment found in the database
    const enrollment = {
      _id: enrollmentId,
      course: courseId,
      deleteOne: sinon.stub().resolves()
    };

    // Mock course found in the database
    const course = {
      _id: courseId,
      seatsLeft: 3,
      save: sinon.stub().resolvesThis()
    };

    // Stub Enrollment.findById to return the mock enrollment
    const enrollmentStub = sinon.stub(Enrollment, 'findById').resolves(enrollment);

    // Stub Course.findById to return the mock course
    const courseStub = sinon.stub(Course, 'findById').resolves(course);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await dropCourse(req, res);

    // Assertions
    expect(enrollmentStub.calledOnceWith(req.params.id)).to.be.true;
    expect(courseStub.calledOnceWith(enrollment.course)).to.be.true;
    expect(course.seatsLeft).to.equal(4);
    expect(course.save.calledOnce).to.be.true;
    expect(enrollment.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Course dropped' })).to.be.true;

    // Restore stubbed methods
    enrollmentStub.restore();
    courseStub.restore();
  });

  it('should return 404 if enrollment is not found', async () => {
    // Stub Enrollment.findById to return null
    const enrollmentStub = sinon.stub(Enrollment, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await dropCourse(req, res);

    // Assertions
    expect(enrollmentStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Enrollment not found' })).to.be.true;

    // Restore stubbed methods
    enrollmentStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Enrollment.findById to throw an error
    const enrollmentStub = sinon.stub(Enrollment, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await dropCourse(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    enrollmentStub.restore();
  });

});