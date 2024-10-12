export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const CONTACT_ROUTES = "api/contact";
export const MESSAGE_ROUTES = "api/message";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const USER_INFO_ROUTE = `${AUTH_ROUTES}/user-info`;
export const UPDATE_USER_INFO_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTES}/search-contacts`;

export const GET_MESSAGES_ROUTE = `${MESSAGE_ROUTES}/get-messages`;
