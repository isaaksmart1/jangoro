import { API_URL,httpProvider } from '../data';

export const updatePassword = async (data) => {
 try {
    await httpProvider.custom(`${API_URL}/user/update/password`,         {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    } catch (err) {
        console.log(err);
    }
}