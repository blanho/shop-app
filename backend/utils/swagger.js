const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:
        "An E-commerce Shop using MERN Stack and Swagger, Docker allows user to purchse products",
      version: "3.0.0",
      description: "Docker, Swagger, Express.js, React.js, Mongoose, React V6",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ho Bao Lan",
        url: "https://github.com/blanho/mern-shop",
        email: "h.baolan20025@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
module.exports = options;
