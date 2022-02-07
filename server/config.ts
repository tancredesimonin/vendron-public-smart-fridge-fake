export const knownCommands = ["check_machine_state", "smart_fridge_door_open"];
export const LOADING_TIME_MS = 5000;
// the errorToSend is the index of the error list where to pick from
export const flow = [
  {
    name: "check_machine_state",
    sendSuccess: true,
    errorToSend: 1,
  },
  {
    name: "smart_fridge_door_open",
    sendSuccess: true,
    errorToSend: 1,
  },
];

export const purchasedProducts = [
  {
    vpn: 'PRODUCT_001',
    unit_price: '1.60',
    name: '100 Plus (Small)'
  },
  {
    vpn: 'PRODUCT_006',
    unit_price: '2.10',
    name: 'Coca light (Small)'
  },
  {
    vpn: 'PRODUCT_009',
    unit_price: '7.50',
    name: 'Sandwich Poulet'
  }
]

export const fakeData = [
  {
    name: "check_machine_state",
    acknowledgmentData: {
      ack_status: 1,
      ack_code: "PUBLIC007",
    },
    successData: {
      status: 1,
      error_data: [],
      json_data: {
        code: 1,
        message: "Machine is available for API Dispensing",
      },
    },
    errorList: [
      {
        status: 0,
        error_data: {
          code: -1,
          message: "Invalid Parameters",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -2,
          message: "Invalid Public API Token",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -3,
          message: "Invalid Machine UID",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -4,
          message: "Machine is currently not online",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -5,
          message: "Machine is currently busy",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -11,
          message: "Machine subscription is already expired",
        },
        json_data: [],
      },
    ],
  },
  {
    name: "smart_fridge_door_open",
    acknowledgmentData: {
      ack_status: 1,
      ack_code: "PUBLIC011",
    },
    successData: {
      status: 1,
      error_data: [],
      json_data: {
        code: 1,
        message: "Smart Fridge Door is unlocked",
        data: [{ door_status: "OPENED" }],
      },
    },
    errorList: [
      {
        status: 0,
        error_data: {
          code: -1,
          message: "Invalid Parameters",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -2,
          message: "Invalid Public API Token",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -3,
          message: "Invalid Machine UID",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -4,
          message: "Machine is currently not online",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -5,
          message: "Machine is currently busy",
        },
        json_data: [],
      },
      {
        status: 0,
        error_data: {
          code: -11,
          message: "Machine subscription is already expired",
        },
        json_data: [],
      },
    ],
  },
];
