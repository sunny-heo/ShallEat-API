const { Model } = require("objection");
const knex = require("../db");

Model.knex(knex);

class Restaurant extends Model {
  static get tableName() {
    return "restaurants";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        description: { type: "string" },
        phoneNumber: {
          type: "string",
          pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        },
        geoLocation: {
          type: ["object", null],
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
          }
        },
        name: { type: "string", minLength: 1, maxLength: 50 },
        address: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            province: { type: "string" },
            zipCode: { type: "string", pattern: "([A-Z]{1}[0-9]{1}){3}" }
          }
        },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" }
      }
    };
  }

  static get relationMappings() {
    return {
      customers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/user",
        join: {
          from: "restaurants.id",
          through: {
            from: "restaurants_customers.restaurantId",
            to: "restaurants_customers.customerId"
          },
          to: "users.id"
        }
      }
    };
  }
}

module.exports = Restaurant;
