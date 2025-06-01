// Моковая база данных
const users = [
  {
    id: 1,
    name: 'Администратор Системы',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Иванов Иван Иванович',
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher',
    discipline: 'Математика',
  },
  {
    id: 3,
    name: 'Петрова Анна Сергеевна',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    group: 'ИТ-101',
  },
  {
    id: 4,
    name: 'Сидорова Ольга Владимировна',
    email: 'quality@example.com',
    password: 'quality123',
    role: 'quality',
  },
];

// Моковые данные для анализа
const academicData = {
  performance: {
    labels: ['Математика', 'Физика', 'Информатика', 'История', 'Английский язык'],
    datasets: [
      {
        label: 'Средняя успеваемость',
        data: [85, 78, 92, 65, 88],
      },
    ],
  },
  satisfaction: {
    labels: ['Математика', 'Физика', 'Информатика', 'История', 'Английский язык'],
    datasets: [
      {
        label: 'Удовлетворенность студентов',
        data: [75, 68, 90, 72, 85],
      },
    ],
  },
  trends: {
    labels: ['Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', 'Январь'],
    datasets: [
      {
        label: 'Динамика успеваемости',
        data: [70, 75, 82, 85, 88],
      },
    ],
  },
  attendance: {
    labels: ['ИТ-101', 'ИТ-102', 'ИТ-103', 'ИТ-104', 'ИТ-105'],
    values: [95, 88, 92, 85, 90],
  },
  feedback: {
    positive: 68,
    neutral: 22,
    negative: 10,
  },
};

// Моковые данные для отчетов
const reportsData = [
  {
    id: 1,
    program: 'Информационные технологии',
    discipline: 'Программирование',
    qualityScore: 92,
    status: 'Высокий',
    date: '2023-12-15',
  },
  {
    id: 2,
    program: 'Информационные технологии',
    discipline: 'Базы данных',
    qualityScore: 88,
    status: 'Высокий',
    date: '2023-12-10',
  },
  {
    id: 3,
    program: 'Экономика',
    discipline: 'Микроэкономика',
    qualityScore: 75,
    status: 'Средний',
    date: '2023-12-05',
  },
  {
    id: 4,
    program: 'Экономика',
    discipline: 'Макроэкономика',
    qualityScore: 68,
    status: 'Низкий',
    date: '2023-12-01',
  },
  {
    id: 5,
    program: 'Лингвистика',
    discipline: 'Английский язык',
    qualityScore: 85,
    status: 'Высокий',
    date: '2023-11-28',
  },
];

// Моковые отзывы
const feedbacks = [
  {
    id: 1,
    discipline: 'Программирование',
    teacher: 'Иванов И.И.',
    student: 'Петров А.А.',
    rating: 5,
    comment: 'Отличный курс, много практических заданий',
    sentiment: 'positive',
    date: '2023-12-10',
  },
  {
    id: 2,
    discipline: 'Базы данных',
    teacher: 'Сидорова О.В.',
    student: 'Иванова М.М.',
    rating: 4,
    comment: 'Хороший курс, но не хватает практики',
    sentiment: 'neutral',
    date: '2023-12-05',
  },
  {
    id: 3,
    discipline: 'Микроэкономика',
    teacher: 'Петров П.П.',
    student: 'Сидоров С.С.',
    rating: 2,
    comment: 'Слишком сложные тесты, материал объясняется непонятно',
    sentiment: 'negative',
    date: '2023-12-01',
  },
];

// Функции для работы с "базой данных"

// Аутентификация пользователя
export const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        u => u.email === email && u.password === password
      );
      
      if (user) {
        resolve({ ...user });
      } else {
        reject('Неверный email или пароль');
      }
    }, 800);
  });
};

// Регистрация пользователя
export const registerUser = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: users.length + 1,
        ...userData
      };
      users.push(newUser);
      resolve(newUser);
    }, 1000);
  });
};

// Получение текущего пользователя из localStorage
export const getCurrentUser = () => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

// Получение данных для анализа
export const getAnalysisData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(academicData);
    }, 800);
  });
};

// Получение данных для отчетов
export const getReportsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reportsData);
    }, 800);
  });
};

// Получение отзывов
export const getFeedbacks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(feedbacks);
    }, 800);
  });
};

// Добавление нового отзыва
export const addFeedback = (feedback) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFeedback = {
        id: feedbacks.length + 1,
        ...feedback,
        date: new Date().toISOString().split('T')[0],
        sentiment: 'neutral', // В реальной системе это определяла бы LSTM
      };
      feedbacks.push(newFeedback);
      resolve(newFeedback);
    }, 800);
  });
};