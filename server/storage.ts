import {
  type User, type InsertUser,
  type Course, type InsertCourse,
  type Subject, type InsertSubject,
  type Lesson, type InsertLesson,
  type Teacher, type InsertTeacher,
  type Conversation, type InsertConversation
} from "@shared/schema";

export interface IStorage {
  // Users
  listUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Courses
  listCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;

  // Subjects
  listSubjects(): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject>;
  deleteSubject(id: string): Promise<void>;

  // Lessons
  listLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;

  // Teachers
  listTeachers(): Promise<Teacher[]>;
  getTeacher(id: number): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher>;
  deleteTeacher(id: number): Promise<void>;

  // Conversations
  listConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private courses: Map<string, Course>;
  private subjects: Map<string, Subject>;
  private lessons: Map<string, Lesson>;
  private teachers: Map<number, Teacher>;
  private conversations: Map<string, Conversation>;
  private teacherIdCounter: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.subjects = new Map();
    this.lessons = new Map();
    this.teachers = new Map();
    this.conversations = new Map();
    this.teacherIdCounter = 1;
  }

  // Users
  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) throw new Error("User not found");
    const updated = { ...existing, ...user };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Courses
  async listCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const id = crypto.randomUUID();
    const newCourse = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course> {
    const existing = this.courses.get(id);
    if (!existing) throw new Error("Course not found");
    const updated = { ...existing, ...course };
    this.courses.set(id, updated);
    return updated;
  }

  async deleteCourse(id: string): Promise<void> {
    this.courses.delete(id);
  }

  // Subjects
  async listSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const id = crypto.randomUUID();
    const newSubject = { ...subject, id };
    this.subjects.set(id, newSubject);
    return newSubject;
  }

  async updateSubject(id: string, subject: Partial<InsertSubject>): Promise<Subject> {
    const existing = this.subjects.get(id);
    if (!existing) throw new Error("Subject not found");
    const updated = { ...existing, ...subject };
    this.subjects.set(id, updated);
    return updated;
  }

  async deleteSubject(id: string): Promise<void> {
    this.subjects.delete(id);
  }

  // Lessons
  async listLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = crypto.randomUUID();
    const newLesson = { ...lesson, id };
    this.lessons.set(id, newLesson);
    return newLesson;
  }

  async updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson> {
    const existing = this.lessons.get(id);
    if (!existing) throw new Error("Lesson not found");
    const updated = { ...existing, ...lesson };
    this.lessons.set(id, updated);
    return updated;
  }

  async deleteLesson(id: string): Promise<void> {
    this.lessons.delete(id);
  }

  // Teachers
  async listTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const id = this.teacherIdCounter++;
    const newTeacher = { ...teacher, id };
    this.teachers.set(id, newTeacher);
    return newTeacher;
  }

  async updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher> {
    const existing = this.teachers.get(id);
    if (!existing) throw new Error("Teacher not found");
    const updated = { ...existing, ...teacher };
    this.teachers.set(id, updated);
    return updated;
  }

  async deleteTeacher(id: number): Promise<void> {
    this.teachers.delete(id);
  }

  // Conversations
  async listConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = crypto.randomUUID();
    const newConversation = { ...conversation, id };
    this.conversations.set(id, newConversation);
    return newConversation;
  }
}

export const storage = new MemStorage();
