interface EnvironmentConfig {
  BASE_URL: string;
  LOGIN: string;
  DASHBOARD_ANALYTICS: string;
  TEACHERS: string;
  TEACHER_BY_ID: string;
  STUDENTS: string;
  STUDENTS_BY_ID: string;
  PARENTS: string;
  PARENTS_BY_ID: string;
  SUBJECTS: string;
  TOPICS: string;
  LESSONS: string;
  QUIZZES: string;
  QUIZ_BY_ID: string;
  UPDATE_USER: string;
  BLOCK_USER: string;
  UNBLOCK_USER: string;
  LESSONS_BY_ID: string;
  GET_ALL_GRADES: string;
  GET_SUBJECTS_BY_GRADE: string;
  ADD_SUBJECT: string;
  EDIT_SUBJECT: string;
  DELETE_SUBJECT: string;
  UPLOAD_IMAGE: string;
  ADD_TOPIC: string;
  EDIT_TOPIC: string;
  DELETE_TOPIC: string;
  ADD_LESSON: string;
  EDIT_LESSON: string;
  DELETE_LESSON: string;
  GET_TOPICS_BY_SUBJECT: string;
  GET_LESSON_BY_TOPIC: string;
  ADD_QUIZ: string;
  GET_ACTIVE_USERS: string;
  GET_STRIPE_DATA: string;
  QUIZ_STATS: string;
  COUPONS: string;
  CANCEL_SUBSCRIPTION: string;
  NOTIFICATIONS: string;
  USERS_FOR_NOTIFICATION: string;
}

interface Environments {
  development: EnvironmentConfig;
  production: EnvironmentConfig;
}

const _Environments: Environments = {
  development: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_DEV_BASE_URL || "http://localhost:3000/api/v1/",
    LOGIN: `auth/login`,
    DASHBOARD_ANALYTICS: `admin/analytics`,
    TEACHERS: `admin/teachers`,
    TEACHER_BY_ID: `admin/teacher/`,
    STUDENTS: `admin/students`,
    STUDENTS_BY_ID: `admin/student/`,
    PARENTS: `admin/parents`,
    PARENTS_BY_ID: `admin/parent/`,
    SUBJECTS: `admin/subjects`,
    LESSONS: `admin/lessons/`,
    LESSONS_BY_ID: `admin/lessons/lessonId/`,
    TOPICS: `admin/topics/`,
    QUIZZES: `admin/quizzes`,
    QUIZ_BY_ID: `admin/quiz/`,
    UPDATE_USER: `admin/updateuser`,
    BLOCK_USER: `admin/block`,
    UNBLOCK_USER: `admin/unblock`,
    GET_ALL_GRADES: `grade`,
    GET_SUBJECTS_BY_GRADE: `subject/grade/`,
    EDIT_SUBJECT: `admin/editSubject`,
    DELETE_SUBJECT: `admin/deleteSubject`,
    GET_TOPICS_BY_SUBJECT: `topic?subject=`,
    EDIT_TOPIC: `admin/editTopic`,
    DELETE_TOPIC: `admin/deleteTopic`,
    GET_LESSON_BY_TOPIC: `topic/lesson/`,
    ADD_SUBJECT: `subject`,
    UPLOAD_IMAGE: `uploadimage`,
    ADD_TOPIC: `topic`,
    ADD_LESSON: `topic/lesson`,
    EDIT_LESSON: `admin/editLesson`,
    DELETE_LESSON: `admin/deleteLesson`,
    ADD_QUIZ: `/quiz/teacher`,
    GET_ACTIVE_USERS: "admin/activeusers",
    GET_STRIPE_DATA: "admin/stripedata",
    QUIZ_STATS: "admin/quiz-stats",
    COUPONS: "admin/coupons",
    CANCEL_SUBSCRIPTION: "payment/cancel-subscription",
    NOTIFICATIONS: "admin/notifications",
    USERS_FOR_NOTIFICATION: "admin/users-for-notification"
  },
  production: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_PROD_BASE_URL || "https://your-production-backend.herokuapp.com/api/v1/",
    LOGIN: `auth/login`,
    DASHBOARD_ANALYTICS: `admin/analytics`,
    TEACHERS: `admin/teachers`,
    TEACHER_BY_ID: `admin/teacher/`,
    STUDENTS: `admin/students`,
    STUDENTS_BY_ID: `admin/student/`,
    PARENTS: `admin/parents`,
    PARENTS_BY_ID: `admin/parent/`,
    SUBJECTS: `admin/subjects`,
    LESSONS: `admin/lessons/`,
    LESSONS_BY_ID: `admin/lessons/lessonId/`,
    TOPICS: `admin/topics/`,
    QUIZZES: `admin/quizzes`,
    QUIZ_BY_ID: `admin/quiz/`,
    UPDATE_USER: `admin/updateuser`,
    BLOCK_USER: `admin/block`,
    UNBLOCK_USER: `admin/unblock`,
    GET_ALL_GRADES: `grade`,
    GET_SUBJECTS_BY_GRADE: `subject/grade/`,
    EDIT_SUBJECT: `admin/editSubject`,
    DELETE_SUBJECT: `admin/deleteSubject`,
    GET_TOPICS_BY_SUBJECT: `topic?subject=`,
    EDIT_TOPIC: `admin/editTopic`,
    DELETE_TOPIC: `admin/deleteTopic`,
    GET_LESSON_BY_TOPIC: `topic/lesson/`,
    ADD_SUBJECT: `subject`,
    UPLOAD_IMAGE: `uploadimage`,
    ADD_TOPIC: `topic`,
    ADD_LESSON: `topic/lesson`,
    EDIT_LESSON: `admin/editLesson`,
    DELETE_LESSON: `admin/deleteLesson`,
    ADD_QUIZ: `/quiz/teacher`,
    GET_ACTIVE_USERS: "admin/activeusers",
    GET_STRIPE_DATA: "admin/stripedata",
    QUIZ_STATS: "admin/quiz-stats",
    COUPONS: "admin/coupons",
    CANCEL_SUBSCRIPTION: "payment/cancel-subscription",
    NOTIFICATIONS: "admin/notifications",
    USERS_FOR_NOTIFICATION: "admin/users-for-notification"
  },
};

function getEnvironment(): EnvironmentConfig {
  const platform: keyof Environments = process.env.NODE_ENV === "production" ? "production" : "development";
  return _Environments[platform];
}

const Environment: EnvironmentConfig = getEnvironment();
export default Environment;
