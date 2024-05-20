import axios from "../axios";
import { API_ROUTES } from "./api_constants";



export const getChatContacts = async () => {
    try {
        const { data } = await axios.get(`${API_ROUTES.chat.Contacts}`);
        return { error: null, data };
    } catch (error) {
        return handleApiError(error);
    }
};


export const getUserContacts = async () => {
    try {
        const { data } = await axios.get(`${API_ROUTES.chat.UserContacts}`);
        return { error: null, data };
    } catch (error) {
        return handleApiError(error);
    }
};


export const getUserChatMessages = async (selectedChatId,id,page) => {
    try {
        const { data } = await axios.get(`${API_ROUTES.chat.ChatMessages}?contact_user_id=${selectedChatId}&sender_id=${id}&page=${page}`);
        return { error: null, data };
    } catch (error) {
        return handleApiError(error);
    }
};


export const getUserGroupChatMessages = async(selectedGroupChatId,id,page) =>
{
    try {
        const { data } = await axios.get(`${API_ROUTES.chat.ChatMessages}?group_id=${selectedGroupChatId}&sender_id=${id}&page=${page}`);
        return { error: null, data };
    } catch (error) {
        return handleApiError(error);
    }
}



export const sendEditedMessageToUser = async (selectedChatId,id,form_data) => {
    try {
        const { data } = await axios.post(`${API_ROUTES.chat.SendMessage(selectedChatId)}?edit_mode=on&id=${id}`, form_data);
        return { error: null, data };
    } catch (error) {
        return handleApiError(error);
    }
};

export const sendMessageToUser = async (selectedChatId,form_data) => {
    try {
        const { data } = await axios.post(`${API_ROUTES.chat.SendMessage(selectedChatId)}`, form_data);
        return { error: null, data };
    } catch (error) {
        return handleApiError(error);
    }
};



export const handleApiError = async (error) => {
    try {
        const errorMessage =
            error.response?.data?.message || "An unexpected error occurred.";
        const data = null;
        return { error: errorMessage, data };
    } catch (err) {
        throw new Error("An unexpected error occurred.");
    }
};