require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Issue = require('./models/Issue');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Issue.deleteMany({});

    // Create users
    const users = await User.create([
      {
        userId: 'USER001',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        department: 'Management',
        status: 'active'
      },
      {
        userId: 'USER002',
        name: 'John Manager',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
        department: 'Project Management',
        status: 'active'
      },
      {
        userId: 'USER003',
        name: 'Alice Developer',
        email: 'dev1@example.com',
        password: 'dev123',
        role: 'developer',
        department: 'Engineering',
        status: 'active'
      },
      {
        userId: 'USER004',
        name: 'Bob Developer',
        email: 'dev2@example.com',
        password: 'dev123',
        role: 'developer',
        department: 'Engineering',
        status: 'active'
      },
      {
        userId: 'USER005',
        name: 'Charlie Tester',
        email: 'tester@example.com',
        password: 'test123',
        role: 'tester',
        department: 'QA',
        status: 'active'
      }
    ]);

    console.log('Users created:', users.length);

    // Create projects
    const projects = await Project.create([
      {
        projectId: 'PRJ001',
        title: 'E-Commerce Platform',
        description: 'Building a modern e-commerce platform',
        owner: users[1]._id,
        members: [users[1]._id, users[2]._id, users[3]._id],
        status: 'active',
        startDate: new Date('2024-01-01')
      },
      {
        projectId: 'PRJ002',
        title: 'Mobile App',
        description: 'Native mobile application development',
        owner: users[1]._id,
        members: [users[1]._id, users[3]._id],
        status: 'active',
        startDate: new Date('2024-02-01')
      }
    ]);

    console.log('Projects created:', projects.length);

    // Create issues
    const issues = await Issue.create([
      {
        issueId: 'ISS001',
        title: 'Fix login authentication bug',
        description: 'Users unable to login with special characters in password',
        project: projects[0]._id,
        assignedTo: users[2]._id,
        reportedBy: users[4]._id,
        priority: 'high',
        severity: 'high',
        status: 'in progress',
        dueDate: new Date('2024-03-15')
      },
      {
        issueId: 'ISS002',
        title: 'Improve payment processing speed',
        description: 'Payment processing takes too long',
        project: projects[0]._id,
        assignedTo: users[3]._id,
        reportedBy: users[4]._id,
        priority: 'medium',
        severity: 'medium',
        status: 'open'
      },
      {
        issueId: 'ISS003',
        title: 'Add dark mode support',
        description: 'Implement dark mode for better user experience',
        project: projects[1]._id,
        assignedTo: users[2]._id,
        reportedBy: users[1]._id,
        priority: 'low',
        severity: 'low',
        status: 'open'
      }
    ]);

    console.log('Issues created:', issues.length);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
