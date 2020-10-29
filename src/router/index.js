import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Reset from '../components/Reset'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import Course from '../pages/course/Course'
import CourseDetail from '../pages/course/CourseDetail'
import QBank from '../pages/questionBank/QuestionBank'
import CreateQBank from '../pages/questionBank/CreateQuestion'
import QNA from '../pages/qna/Qna'
import QNAForum from '../pages/qna/Forum'
import CreateQuiz from '../pages/course/CreateQuiz'
import QuizRecapt from '../pages/course/QuizRecapt'
import Complaint from '../pages/complaint/Complaint'
import Review from '../pages/complaint/Review'
import Settings from '../pages/Settings'
import store from '../store/store'

Vue.use(Router)


let routes = [
  {
    path: '/login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/register',
    component: Register,
    meta: { title: 'Register' }
  },
  {
    path: '/reset-password',
    component: Reset,
    meta: { title: 'Reset Password' }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { title: 'Profile' }
  },
  {
    path: '*',
    meta: { title: 'Page Not Found' },
    component: NotFound
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    meta: { title: 'Dashboard' },
    component: Dashboard
  },
  {
    path: '/course',
    meta: { title: 'Course' },
    component: Course
  },
  {
    path: '/course/detail/:id',
    meta: { title: 'Course' },
    component: CourseDetail
  },
  {
    path: '/course/create',
    meta: { title: 'Create New Course' },
    component: CourseDetail
  },
  {
    path: '/questionbank',
    meta: { title: 'Question Bank' },
    component: QBank
  },
  {
    path: '/questionbank/edit/:id',
    meta: { title: 'Edit Question Bank' },
    component: CreateQBank
  },
  {
    path: '/questionbank/create',
    meta: { title: 'Create Question Bank' },
    component: CreateQBank
  },
  {
    path: '/course/:idCourse/quiz/create',
    meta: { title: 'Create New Quiz' },
    component: CreateQuiz
  },
  {
    path: '/course/:idCourse/quiz/edit',
    meta: { title: 'Edit Quiz' },
    component: CreateQuiz
  },
  {
    path: '/course/quiz/recapt/:id',
    meta: { title: 'Quiz Recapt' },
    component: QuizRecapt
  },
  {
    path: '/qna',
    meta: { title: 'Q&A Forum' },
    component: QNA
  },
  {
    path: '/qna/forum',
    meta: { title: 'Q&A Forum' },
    component: QNAForum
  },
  {
    path: '/complaint',
    meta: { title: 'Complaint' },
    component: Complaint
  },
  {
    path: '/course/quiz/review',
    meta: { title: 'Review' },
    component: Review
  },
  {
    path: '/complaint/detail',
    meta: { title: 'Complaint Detail' },
    component: Review
  },
  {
    path: '/settings',
    meta: { title: 'Settings' },
    component: Settings
  },
  {
    path: '/archive',
    meta: { title: 'Archive' },
    component: Course
  },

]

const router = new Router({
  routes,
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("ujol-token");
  let user = localStorage.getItem("data_user");

  if (to.path !== '/login' && to.path != '/register' && to.path != '/reset-password') {
    if (!token || !user) {
      store.dispatch("login/logout")
      next('/login')
    }  else {
      next()
    }
  } else {
    next()
  }

})
export default router;
