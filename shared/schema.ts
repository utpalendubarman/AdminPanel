import { pgTable, text, serial, integer, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("user_id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  school: text("school").notNull(),
  board: text("board").notNull(),
  class_id: text("class_id").notNull(),
  profile_photo: text("profile_photo")
});

export const courses = pgTable("courses", {
  id: uuid("course_id").defaultRandom().primaryKey(),
  course_name: text("course_name").notNull(),
  board_name: text("board_name").notNull(),
  status: text("status").notNull(),
  thumbnail: text("thumbnail").notNull()
});

export const subjects = pgTable("subjects", {
  id: uuid("subject_id").defaultRandom().primaryKey(),
  subject_name: text("subject_name").notNull(),
  subject_image: text("subject_image").notNull(),
  board: text("board").notNull(),
  course_id: text("course_id").notNull(),
  status: text("status").notNull()
});

export const lessons = pgTable("lessons", {
  id: uuid("lesson_id").defaultRandom().primaryKey(),
  lesson_name: text("lesson_name").notNull(),
  summary: text("summary"),
  board: text("board").notNull(), 
  status: text("status").notNull(),
  subject_id: text("subject_id").notNull(),
  course_id: text("course_id").notNull(),
  thumbnail: text("thumbnail").notNull()
});

export const contentBlocks = pgTable("content_blocks", {
  id: uuid("block_id").defaultRandom().primaryKey(),
  lesson_id: text("lesson_id").notNull(),
  order: integer("order").notNull(),
  image_url: text("image_url"),
  content: text("content"),
  created_at: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertContentBlockSchema = createInsertSchema(contentBlocks);
export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;

export const teachers = pgTable("teachers", {
  id: serial("teacher_id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  short_bio: text("short_bio").notNull(),
  image: text("image").notNull(),
  prompt: text("prompt").notNull(),
  greeting_messages: text("greeting_messages").notNull(),
  voice: text("voice").notNull()
});

export const conversations = pgTable("conversations", {
  id: uuid("session_id").defaultRandom().primaryKey(),
  lesson_id: text("lesson_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  diagram: text("diagram"),
  teacher_id: integer("teacher_id").notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);
export const insertSubjectSchema = createInsertSchema(subjects);
export const insertLessonSchema = createInsertSchema(lessons);
export const insertTeacherSchema = createInsertSchema(teachers);
export const insertConversationSchema = createInsertSchema(conversations);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
