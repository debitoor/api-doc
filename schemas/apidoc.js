module.exports = { description: 'TODO: Add description',
	required: true,
	type: 'object',
	properties: {
		'/customers': {
			description: 'Root level properties are the routes in your express app',
			required: true,
			type: 'object',
			properties: {
				get: {
					description: 'One of HTTP mehtods (express): get, put, del or post',
					required: true,
					type: 'object',
					properties: {
						description: {
							description: 'Description of this endpoint',
							required: false,
							type: ['null', 'string'],
							example: 'list all customers'
						},
						produces: {
							description: 'data format produced',
							required: false,
							type: ['null', 'string'],
							example: 'application/json'
						},
						httpStatus: {
							description: 'TODO: Add description for: httpStatus',
							required: false,
							type: ['null', 'object'],
							properties: {
								'200': {
									description: 'Description of data returned when http status code is 200',
									required: false,
									type: ['null', 'string'],
									example: 'A list of customers'
								},
								'412': {
									description: 'Description why 412 can be returned',
									required: false,
									type: ['null', 'string'],
									examlpe: 'A malformed querystring prameter'
								}
							}
						},
						example: {
							description: 'string representing an example of the (pretty-printed) JSON this endpoint produces',
							required: false,
							type: ['null', 'string']
						}
					}
				},
				post: {
					description: 'One of HTTP mehtods (express): get, put, del or post',
					required: true,
					type: 'object',
					properties: {
						description: {
							description: 'Description of this endpoint',
							required: false,
							type: ['null', 'string'],
							example: 'creates a new customer'
						},
						produces: {
							description: 'data format produced',
							required: false,
							type: ['null', 'string'],
							example: 'application/json'
						},
						consumes: {
							description: 'type of accepted by endpoint ',
							required: false,
							type: ['null', 'string'],
							example: 'application/json'
						},
						httpStatus: {
							description: 'TODO: Add description for: httpStatus',
							required: false,
							type: ['null', 'object'],
							properties: {
								'200': {
									description: 'Description of data returned when http status code is 200',
									required: false,
									type: ['null', 'string'],
									example: 'A list of customers'
								},
								'400': {
									description: 'Description why 400 can be returned',
									required: false,
									type: ['null', 'string'],
									eaxmple: 'Error validating data passed'
								},
								'412': {
									description: 'Description why 412 can be returned',
									required: false,
									type: ['null', 'string'],
									examlpe: 'A malformed querystring prameter'
								}
							}
						},
						example: {
							description: 'string representing an example of the (pretty-printed) JSON this endpoint produces',
							required: false,
							type: ['null', 'string']
						}
					}
				}
			}
		}
	}
};