export enum TelephonyApiRoutes {
  // Voximplant
  GET_VOXIMPLANT_CALLS = '/api/telephony/voximplant/calls',
  GET_VOXIMPLANT_ACCOUNT = '/api/telephony/voximplant/account',
  CREATE_VOXIMPLANT_ACCOUNT = '/api/telephony/voximplant/account',
  GET_VOXIMPLANT_USERNAME = '/api/telephony/voximplant/users/my/username',
  GET_VOXIMPLANT_LOGIN_TOKEN = '/api/telephony/voximplant/users/my/login-token',
  PATCH_VOXIMPLANT_CALL = '/api/telephony/voximplant/calls/:externalId',
  // Voximplant users
  GET_VOXIMPLANT_USERS = '/api/telephony/voximplant/users',
  GET_VOXIMPLANT_USER = '/api/telephony/voximplant/users/:userId',
  CREATE_VOXIMPLANT_USER = '/api/telephony/voximplant/users/:userId',
  DELETE_VOXIMPLANT_USER = '/api/telephony/voximplant/users/:userId',
  PATCH_VOXIMPLANT_USER = '/api/telephony/voximplant/users/:userId',
  GET_VOXIMPLANT_USER_SIP_SETTINGS = '/api/telephony/voximplant/users/:userId/sip',
  // Voximplant scenarios
  GET_VOXIMPLANT_SCENARIOS = '/api/telephony/voximplant/scenarios',
  CREATE_VOXIMPLANT_SCENARIOS = '/api/telephony/voximplant/scenarios',
  UPDATE_VOXIMPLANT_SCENARIOS = '/api/telephony/voximplant/scenarios',
  // Voximplant numbers
  GET_VOXIMPLANT_AVAILABLE_PHONE_NUMBERS = '/api/telephony/voximplant/numbers/available',
  GET_VOXIMPLANT_PHONE_NUMBERS = '/api/telephony/voximplant/numbers',
  CREATE_VOXIMPLANT_PHONE_NUMBER = '/api/telephony/voximplant/numbers',
  DELETE_VOXIMPLANT_PHONE_NUMBER = '/api/telephony/voximplant/numbers/:numberId',
  UPDATE_VOXIMPLANT_PHONE_NUMBER = '/api/telephony/voximplant/numbers/:numberId',
  // Voximplant SIP
  CREATE_VOXIMPLANT_SIP_REGISTRATION = '/api/telephony/voximplant/sip',
  GET_VOXIMPLANT_SIP_REGISTRATIONS = '/api/telephony/voximplant/sip',
  GET_VOXIMPLANT_SIP_REGISTRATION = '/api/telephony/voximplant/sip/:sipId',
  GET_VOXIMPLANT_SIP_REGISTRATION_BY_EXTERNAL_ID = '/api/telephony/voximplant/sip/external/:externalId',
  UPDATE_VOXIMPLANT_SIP_REGISTRATION = '/api/telephony/voximplant/sip/:sipId',
  DELETE_VOXIMPLANT_SIP_REGISTRATION = '/api/telephony/voximplant/sip/:sipId',
}
