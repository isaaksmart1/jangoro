import { API_URL, httpProvider } from "../data";

export const authProvider: any = {
  updateIdentity: async (user: any) => {
    try {
      if (user) {
        const response = await httpProvider.custom(`${API_URL}/user/update`, {
          method: "post",
          body: JSON.stringify(user),
        });

        const result = await response.json();

        const idStr = user.id;
        const idNum = Math.floor(Math.random() * 10 ** 21);

        const account = { ...user, id: idNum, idStr };

        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        localStorage.setItem("user", JSON.stringify(account));
      }
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Update failed",
          name: "name" in error ? error.name : "Unknown error",
        },
      };
    }
  },
};
