const BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}`;
const API_VERSION = '/api/v1';
const URL = `${BASE_URL}${API_VERSION}`;

// Auth Routes
const AUTH_ROUTES = {
    auth: {
        login: `${URL}/user`,
        sanctumCsrfCookie: `${URL}/sanctum/csrf-cookie`,
        logout: `${URL}/logout`
    }
};

// Chat Routes
const CHAT_ROUTES = {
    chat: {
        Contacts: `${URL}/chat/contacts`,
        UserContacts: `${URL}/user-contacts`,
        ChatMessages: `${URL}/chat`,
        SendMessage: (selectedChatId) => `${URL}/send-message/chat-id/${selectedChatId}`
    }
};





// Combine all routes
const API_ROUTES = {
    ...AUTH_ROUTES,
    ...CHAT_ROUTES
};

// Export the routes
export { API_ROUTES };

