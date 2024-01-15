/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default class SignUpController {
  handle(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 422,
        body: new Error("Missing param: name"),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 422,
        body: new Error("Missing param: email"),
      };
    }
  }
}
