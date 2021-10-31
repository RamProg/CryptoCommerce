import { denormalize, schema } from "normalizr";

const authorSchema = new schema.Entity("author", {}, { idAttribute: "email" });

const messageSchema = new schema.Entity("message");

const chatSchema = new schema.Entity("chat", {
  author: authorSchema,
  message: messageSchema,
});

const register = function (Handlebars: any) {
  var helpers = {
    loud: function (str: string) {
      return str.toUpperCase();
    },
    denormalize: function (normal: any) {
      return denormalize(
        normal.result,
        chatSchema,
        normal.entities
      );
    },
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
