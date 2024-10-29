export const HOST = import.meta.env.VITE_SERVER_URL;
// Auth Routes
export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/user-info`;
export const UPDATE_USER_INFO_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
// Contact Routes
export const CONTACT_ROUTES = "api/contact";
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTES}/search-contacts`;
export const GET_DM_LIST_ROUTE = `${CONTACT_ROUTES}/get-DM-List`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTES}/get-all-contacts`;
// Message Routes
export const MESSAGE_ROUTES = "api/message";
export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages`;
export const ADD_FILES_ROUTE = `${MESSAGE_ROUTES}/upload-files`;
// Channel Routes
export const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_CHANNELS_ROUTE = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;
