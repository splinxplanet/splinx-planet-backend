const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
};

const AvailableOrderStatuses = Object.values(OrderStatusEnum);

const PaymentProviderEnum = {
  UNKNOWN: "UNKNOWN",
  RAZORPAY: "RAZORPAY",
  PAYPAL: "PAYPAL",
};

const AvailablePaymentProviders = Object.values(PaymentProviderEnum);

const CouponTypeEnum = {
  FLAT: "FLAT",
};

const AvailableCouponTypes = Object.values(CouponTypeEnum);

const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

const AvailableSocialLogins = Object.values(UserLoginType);

const YouTubeFilterEnum = {
  MOST_VIEWED: "mostViewed",
  MOST_LIKED: "mostLiked",
  LATEST: "latest",
  OLDEST: "oldest",
};

const AvailableYouTubeFilters = Object.values(YouTubeFilterEnum);

const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes
const MAXIMUM_SUB_IMAGE_COUNT = 4;
const MAXIMUM_SOCIAL_POST_IMAGE_COUNT = 6;
const DB_NAME = "freeapi";

const paypalBaseUrl = {
  sandbox: "https://api-m.sandbox.paypal.com",
};

const ChatEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  NEW_CHAT_EVENT: "newChat",
  SOCKET_ERROR_EVENT: "socketError",
  STOP_TYPING_EVENT: "stopTyping",
  TYPING_EVENT: "typing",
});

const AvailableChatEvents = Object.values(ChatEventEnum);

module.exports = {
  UserRolesEnum,
  AvailableUserRoles,
  OrderStatusEnum,
  AvailableOrderStatuses,
  PaymentProviderEnum,
  AvailablePaymentProviders,
  CouponTypeEnum,
  AvailableCouponTypes,
  UserLoginType,
  AvailableSocialLogins,
  YouTubeFilterEnum,
  AvailableYouTubeFilters,
  USER_TEMPORARY_TOKEN_EXPIRY,
  MAXIMUM_SUB_IMAGE_COUNT,
  MAXIMUM_SOCIAL_POST_IMAGE_COUNT,
  DB_NAME,
  paypalBaseUrl,
  ChatEventEnum,
  AvailableChatEvents,
};