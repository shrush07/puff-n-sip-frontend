import { environment } from "../../../environments/environment";

const BASE_URL = environment.apiUrl;

export const FOODS_URL = BASE_URL + '/api/foods';
export const FOODS_TAGS_URL = FOODS_URL + '/tags';
export const FOODS_BY_SEARCH_URL = FOODS_URL + '/search/';
export const FOODS_BY_TAG_URL = FOODS_URL + '/tag/';
export const FOODS_BY_ID_URL = FOODS_URL + '/';
export const ORDER_ADD_CART_URL = BASE_URL + '/cart/add';
export const UPDATE_FAVORITE_URL = BASE_URL + '/:id/favorite';


export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';
export const REFRESH_TOKEN_URL = BASE_URL + '/api/auth/refresh-token';
export const RESET_PASSWORD_URL = BASE_URL + '/api/users/reset-password';


export const ORDERS_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDERS_URL + '/create';
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDERS_URL + '/newOrderForCurrentUser';
export const ORDER_BY_ID_URL = ORDERS_URL + '/order';
export const ORDER_SUMMARY_URL = ORDERS_URL + '/order-summary';
export const ORDER_LATEST_URL = ORDERS_URL + '/latest';
export const ORDER_UPDATE_URL = ORDERS_URL + '/update/';
export const ORDER_PAY_URL = ORDERS_URL + '/payment'; 
export const PAYMENT_SUCCESS = ORDERS_URL + '/payment/success'; 
export const ORDER_TRACK_URL = ORDERS_URL + '/track/';
