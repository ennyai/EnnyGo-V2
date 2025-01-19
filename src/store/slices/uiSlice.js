import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  notifications: [],
  modals: {
    createEvent: false,
    editProfile: false,
    activityDetails: false,
  },
  sidebar: {
    isOpen: true,
    activeTab: 'dashboard'
  },
  toast: {
    message: '',
    type: '',
    isVisible: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    toggleModal: (state, action) => {
      const { modalName, isOpen } = action.payload;
      state.modals[modalName] = isOpen;
    },
    setSidebarState: (state, action) => {
      state.sidebar = { ...state.sidebar, ...action.payload };
    },
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isVisible: true
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    }
  }
});

export const {
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleModal,
  setSidebarState,
  showToast,
  hideToast
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModal = (modalName) => (state) => state.ui.modals[modalName];
export const selectSidebar = (state) => state.ui.sidebar;
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer; 