const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Course = require('../models/Course');
const { updateCourse, getCourses, addCourse, deleteCourse } = require('../controllers/courseController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddCourse Function Test', () => {

  it('should create a new course successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        courseId: "COMP101",
        courseName: "Introduction to Programming",
        credits: 6,
        teacherName: "Dr. Ahmad Ahmad",
        capacity: 30
      }
    };

    // Mock course that would be created
    const createdCourse = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      seatsLeft: req.body.capacity,
      createdBy: req.user.id
    };

    // Stub Course.create to return the createdCourse
    const createStub = sinon.stub(Course, 'create').resolves(createdCourse);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addCourse(req, res);

    // Assertions
    expect(createStub.calledOnceWith({
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      credits: req.body.credits,
      teacherName: req.body.teacherName,
      capacity: req.body.capacity,
      seatsLeft: req.body.capacity,
      createdBy: req.user.id
    })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdCourse)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Course.create to throw an error
    const createStub = sinon.stub(Course, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: {
        courseId: "COMP101",
        courseName: "Introduction to Programming",
        credits: 6,
        teacherName: "Dr. Ahmad Ahmad",
        capacity: 30
      }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addCourse(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update course successfully', async () => {
    // Mock course data
    const courseId = new mongoose.Types.ObjectId();
    const existingCourse = {
      _id: courseId,
      courseId: "COMP101",
      courseName: "Old Course Name",
      credits: 6,
      teacherName: "Old Teacher",
      capacity: 30,
      seatsLeft: 10,
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Course.findById to return mock course
    const findByIdStub = sinon.stub(Course, 'findById').resolves(existingCourse);

    // Mock request & response
    const req = {
      params: { id: courseId },
      body: { courseName: "New Course Name", teacherName: "New Teacher" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateCourse(req, res);

    // Assertions
    expect(existingCourse.courseName).to.equal("New Course Name");
    expect(existingCourse.teacherName).to.equal("New Teacher");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if course is not found', async () => {
    const findByIdStub = sinon.stub(Course, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateCourse(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Course not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Course, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateCourse(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetCourse Function Test', () => {

  it('should return all courses', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock course data
    const courses = [
      { _id: new mongoose.Types.ObjectId(), courseId: "COMP101", courseName: "Introduction to Programming", createdBy: userId },
      { _id: new mongoose.Types.ObjectId(), courseId: "CAB203", courseName: "Data Structures", createdBy: userId }
    ];

    // Stub Course.find to return mock courses
    const findStub = sinon.stub(Course, 'find').resolves(courses);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getCourses(req, res);

    // Assertions
    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(courses)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Course.find to throw an error
    const findStub = sinon.stub(Course, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getCourses(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteCourse Function Test', () => {

  it('should delete a course successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock course found in the database
    const course = { deleteOne: sinon.stub().resolves() };

    // Stub Course.findById to return the mock course
    const findByIdStub = sinon.stub(Course, 'findById').resolves(course);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(course.deleteOne.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Course deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if course is not found', async () => {
    // Stub Course.findById to return null
    const findByIdStub = sinon.stub(Course, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteCourse(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Course not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Course.findById to throw an error
    const findByIdStub = sinon.stub(Course, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteCourse(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});