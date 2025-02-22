import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCourseSchema, insertSubjectSchema, insertLessonSchema, insertTeacherSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/list-users", async (_req, res) => {
    const users = await storage.listUsers();
    res.json(users);
  });

  app.post("/api/create-user", async (req, res) => {
    const data = await insertUserSchema.parseAsync(req.body);
    const user = await storage.createUser(data);
    res.json(user);
  });

  app.post("/api/get-user", async (req, res) => {
    const { identifier } = await z.object({ identifier: z.string() }).parseAsync(req.body);
    const user = await storage.getUser(identifier);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  });

  app.post("/api/edit-user", async (req, res) => {
    const { identifier, ...data } = await insertUserSchema.extend({
      identifier: z.string()
    }).parseAsync(req.body);
    const user = await storage.updateUser(identifier, data);
    res.json(user);
  });

  // Courses
  app.get("/api/list-courses", async (_req, res) => {
    const courses = await storage.listCourses();
    res.json(courses);
  });

  app.post("/api/create-course", async (req, res) => {
    const data = await insertCourseSchema.parseAsync(req.body);
    const course = await storage.createCourse(data);
    res.json(course);
  });

  app.post("/api/get-course", async (req, res) => {
    const { course_id } = await z.object({ course_id: z.string() }).parseAsync(req.body);
    const course = await storage.getCourse(course_id);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json(course);
  });

  app.post("/api/edit-course", async (req, res) => {
    const { course_id, ...data } = await insertCourseSchema.extend({
      course_id: z.string()
    }).parseAsync(req.body);
    const course = await storage.updateCourse(course_id, data);
    res.json(course);
  });

  app.post("/api/delete-course", async (req, res) => {
    const { course_id } = await z.object({ course_id: z.string() }).parseAsync(req.body);
    await storage.deleteCourse(course_id);
    res.json({ success: true });
  });

  // Subjects
  app.get("/api/list-subjects", async (_req, res) => {
    const subjects = await storage.listSubjects();
    res.json(subjects);
  });

  app.post("/api/create-subject", async (req, res) => {
    const data = await insertSubjectSchema.parseAsync(req.body);
    const subject = await storage.createSubject(data);
    res.json(subject);
  });

  app.post("/api/edit-subject", async (req, res) => {
    const { subject_id, ...data } = await insertSubjectSchema.extend({
      subject_id: z.string()
    }).parseAsync(req.body);
    const subject = await storage.updateSubject(subject_id, data);
    res.json(subject);
  });

  // Lessons
  app.get("/api/list-lessons", async (_req, res) => {
    const lessons = await storage.listLessons();
    res.json(lessons);
  });

  app.post("/api/create-lesson", async (req, res) => {
    const data = await insertLessonSchema.parseAsync(req.body);
    const lesson = await storage.createLesson(data);
    res.json(lesson);
  });

  app.post("/api/get-lesson", async (req, res) => {
    const { lesson_id } = await z.object({ lesson_id: z.string() }).parseAsync(req.body);
    const lesson = await storage.getLesson(lesson_id);
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }
    res.json(lesson);
  });

  app.post("/api/edit-lesson", async (req, res) => {
    const { lesson_id, ...data } = await insertLessonSchema.extend({
      lesson_id: z.string()
    }).parseAsync(req.body);
    const lesson = await storage.updateLesson(lesson_id, data);
    res.json(lesson);
  });

  app.post("/api/delete-lesson", async (req, res) => {
    const { lesson_id } = await z.object({ lesson_id: z.string() }).parseAsync(req.body);
    await storage.deleteLesson(lesson_id);
    res.json({ success: true });
  });

  // Teachers
  app.get("/api/list-teachers", async (_req, res) => {
    const teachers = await storage.listTeachers();
    res.json(teachers);
  });

  app.post("/api/create-teacher", async (req, res) => {
    const data = await insertTeacherSchema.parseAsync(req.body);
    const teacher = await storage.createTeacher(data);
    res.json(teacher);
  });

  app.post("/api/get-teacher", async (req, res) => {
    const { model_id } = await z.object({ model_id: z.number() }).parseAsync(req.body);
    const teacher = await storage.getTeacher(model_id);
    if (!teacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }
    res.json(teacher);
  });

  app.post("/api/edit-teacher", async (req, res) => {
    const { model_id, ...data } = await insertTeacherSchema.extend({
      model_id: z.number()
    }).parseAsync(req.body);
    const teacher = await storage.updateTeacher(model_id, data);
    res.json(teacher);
  });

  app.post("/api/delete-teacher", async (req, res) => {
    const { model_id } = await z.object({ model_id: z.number() }).parseAsync(req.body);
    await storage.deleteTeacher(model_id);
    res.json({ success: true });
  });

  // Content Blocks
  app.post("/api/list-content-blocks", async (req, res) => {
    const { lesson_id } = await z.object({ lesson_id: z.string() }).parseAsync(req.body);
    const blocks = await storage.listContentBlocks(lesson_id);
    res.json(blocks);
  });

  app.post("/api/create-content-block", async (req, res) => {
    const data = await insertContentBlockSchema.parseAsync(req.body);
    const block = await storage.createContentBlock(data);
    res.json(block);
  });

  app.post("/api/edit-content-block", async (req, res) => {
    const { block_id, ...data } = await insertContentBlockSchema.extend({
      block_id: z.string()
    }).parseAsync(req.body);
    const block = await storage.updateContentBlock(block_id, data);
    res.json(block);
  });

  app.post("/api/delete-content-block", async (req, res) => {
    const { block_id } = await z.object({ block_id: z.string() }).parseAsync(req.body);
    await storage.deleteContentBlock(block_id);
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
