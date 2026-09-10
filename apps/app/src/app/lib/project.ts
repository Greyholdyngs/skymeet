/*import api from "./api";

export const projectsApi = {
  checkName: async (name: string) => {
    const response = await api.get("/projects/check-name", {
      params: { name },
    });

    return response.data;
  },

  create: async (data: {
    name: string;
    description: string;
  }) => {
    const response = await api.post("/projects", data);

    return response.data;
  },
};*/