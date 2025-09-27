export enum ProductsApiRoutes {
  // products section
  GET_PRODUCTS_SECTIONS = '/api/products/sections',
  GET_PRODUCTS_SECTION = '/api/products/sections/:sectionId',
  CREATE_PRODUCTS_SECTION = '/api/products/sections',
  UPDATE_PRODUCTS_SECTION = '/api/products/sections/:sectionId',
  DELETE_PRODUCTS_SECTION = '/api/products/sections/:sectionId',
  UPDATE_PRODUCTS_SECTION_LINKS = '/api/products/sections/:sectionId/links',
  // products section rental interval
  GET_PRODUCTS_SECTION_RENTAL_INTERVAL = '/api/rental/sections/:sectionId/interval',
  CREATE_PRODUCTS_SECTION_RENTAL_INTERVAL = '/api/rental/sections/:sectionId/interval',
  // product categories
  GET_PRODUCT_CATEGORIES = '/api/products/sections/:sectionId/categories',
  CREATE_PRODUCT_CATEGORY = '/api/products/sections/:sectionId/categories',
  UPDATE_PRODUCT_CATEGORY = '/api/products/sections/:sectionId/categories/:categoryId',
  DELETE_PRODUCT_CATEGORY = '/api/products/sections/:sectionId/categories/:categoryId',
  // warehouses
  GET_WAREHOUSES = '/api/products/sections/:sectionId/warehouses',
  CREATE_WAREHOUSE = '/api/products/sections/:sectionId/warehouses',
  UPDATE_WAREHOUSE = '/api/products/sections/:sectionId/warehouses/:warehouseId',
  DELETE_WAREHOUSE = '/api/products/sections/:sectionId/warehouses/:warehouseId',
  // product orders
  GET_ENTITY_PRODUCT_ORDER = '/api/products/orders/:orderId',
  GET_ENTITY_PRODUCT_ORDERS = '/api/products/orders',
  CREATE_ENTITY_PRODUCT_ORDER = '/api/products/sections/:sectionId/orders',
  UPDATE_ENTITY_PRODUCT_ORDER = '/api/products/sections/:sectionId/orders/:orderId',
  DELETE_ENTITY_PRODUCT_ORDER = '/api/products/sections/:sectionId/orders/:orderId',
  // product rental order
  GET_ENTITY_PRODUCT_RENTAL_ORDER = '/api/rental/sections/:sectionId/orders/:orderId',
  GET_ENTITY_PRODUCT_RENTAL_ORDERS = '/api/rental/sections/:sectionId/orders/entity/:entityId',
  CREATE_ENTITY_PRODUCT_RENTAL_ORDER = '/api/rental/sections/:sectionId/orders',
  UPDATE_ENTITY_PRODUCT_RENTAL_ORDER = '/api/rental/sections/:sectionId/orders/:orderId',
  DELETE_ENTITY_PRODUCT_RENTAL_ORDER = '/api/rental/sections/:sectionId/orders/:orderId',
  UPDATE_ENTITY_PRODUCT_RENTAL_ORDER_STATUS = '/api/rental/sections/:sectionId}/orders/:orderId/status/:statusId',
  CHECK_RENTAL_PRODUCTS_AVAILABILITY_STATUS = '/api/rental/sections/:sectionId/schedule/check',
  SEARCH_RENTAL_ORDERS = '/api/rental/sections/:sectionId/orders/search',
  CHANGE_ENTITY_PRODUCT_RENTAL_ORDER_STATUS = '/api/rental/sections/:sectionId/orders/:orderId/status/:status',
  // product orders statuses
  GET_PRODUCT_ORDER_STATUSES = '/api/products/order-statuses',
  // rentals
  GET_RENTALS = '/api/rental/sections/:sectionId/schedule',
  GET_RENTAL = '/api/rental/sections/:sectionId/schedule/products/:productId',
  // shipments
  GET_SHIPMENTS = '/api/products/sections/:sectionId/shipments',
  GET_SHIPMENT = '/api/products/sections/:sectionId/shipments/:shipmentId',
  CHANGE_SHIPMENT_STATUS = '/api/products/sections/:sectionId/shipments/:shipmentId/status/:statusId',
  // products
  GET_PRODUCT = '/api/products/sections/:sectionId/products/:productId',
  GET_PRODUCTS = '/api/products/sections/:sectionId/products',
  CREATE_PRODUCT = '/api/products/sections/:sectionId/products',
  UPDATE_PRODUCT = '/api/products/sections/:sectionId/products/:productId',
  DELETE_PRODUCT = '/api/products/sections/:sectionId/products/:productId',
  UPDATE_PRODUCT_STOCKS = '/api/products/sections/:sectionId/products/:productId/stocks',
  UPLOAD_PRODUCT_IMAGES = '/api/products/sections/:sectionId/products/:productId/photos',
  // product prices
  CREATE_PRODUCT_PRICE = '/api/products/sections/:sectionId/products/:productId/prices',
  UPDATE_PRODUCT_PRICE = '/api/products/sections/:sectionId/products/:productId/prices/:priceId',
  DELETE_PRODUCT_PRICE = '/api/products/sections/:sectionId/products/:productId/prices/:priceId',
}
