import { API, axiosClient } from "@/apiConstant/apiConstant";
import {
  ProjectPayloadType,
  TeamPayloadType,
  WorkspacePayloadType,
} from "@/types/types";

export const fetchUserService = async () => {
  try {
    const res = await axiosClient.get(`${API.V1.ME}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWorkspaceService = async () => {
  try {
    const res = await axiosClient.get(`${API.V1.FETCH_WORKSPACES}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createWorkspaceService = async (payload: WorkspacePayloadType) => {
  try {
    const res = await axiosClient.post(`${API.V1.CREATE_WORKSPACE}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeamsDataService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.TEAM}/${workspaceId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createTeamService = async (payload: TeamPayloadType) => {
  try {
    const res = await axiosClient.post(`${API.V1.TEAM}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createProjectService = async (payload: ProjectPayloadType) => {
  try {
    const res = await axiosClient.post(`${API.V1.PROJECT}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

// export const lastActiveWorkspaceService = async (workspaceId: string) => {
//   try {
//     const res = await axiosClient.post(
//       `${API.V1.LAST_ACTIVE_WORKSPACE}/${workspaceId}`,
//     );
//     return res?.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchWorkspaceStatusService = async (payload: any) => {
  const { workspaceId, projectId } = payload;
  try {
    const res = await axiosClient.get(`${API.V1.STATUS}/${workspaceId}`, {
      params: { projectId },
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWorkspaceMambersService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(
      `${API.V1.FETCH_WORKSPACES}/${workspaceId}`,
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchActivitiesService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.ACTIVITIES}/${workspaceId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const createIssueService = async (payload: any) => {
  try {
    const res = await axiosClient.post(`${API.V1.ISSUE}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchIssuesService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.ISSUE}/${workspaceId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const editIssueService = async (payload: any) => {
  try {
    const res = await axiosClient.patch(`${API.V1.ISSUE}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const completedIssueCountService = async (payload: any) => {
  try {
    const res = await axiosClient.get(`${API.V1.COMPLETED_COUNT}`, {
      params: payload,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchIssuesByProjectService = async (
  projectId: string,
  params?: Record<string, string>,
) => {
  try {
    const res = await axiosClient.get(`${API.V1.ISSUE}/project/${projectId}`, {
      params,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const moveCardService = async (payload: any) => {
  try {
    const res = await axiosClient.put(`${API.V1.MOVE_ISSE}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const deletedIssueService = async (payload: any) => {
  try {
    const res = await axiosClient.delete(`${API.V1.ISSUE}`, {
      params: payload,
    });
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectByIdService = async (projectId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.PROJECT}/${projectId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProjectsService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.PROJECTS}/${workspaceId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const teamSoftDeleteService = async (teamId: string) => {
  try {
    const res = await axiosClient.patch(`${API.V1.TEAM}/${teamId}/delete`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const projectSoftDeleteService = async (projectId: string) => {
  try {
    const res = await axiosClient.patch(
      `${API.V1.PROJECT}/${projectId}/delete`,
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDeletedProjectsService = async (projectId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.PROJECT}/${projectId}/delete`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDeletedTeamsService = async (teamId: string) => {
  try {
    const res = await axiosClient.get(`${API.V1.TEAM}/${teamId}/delete`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const restoreProjectService = async (projectId: string) => {
  try {
    const res = await axiosClient.patch(
      `${API.V1.PROJECT}/${projectId}/restore`,
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const restoreTeamService = async (teamId: string) => {
  try {
    const res = await axiosClient.patch(`${API.V1.TEAM}/${teamId}/restore`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const permanentDeleteProjectService = async (projectId: string) => {
  try {
    const res = await axiosClient.delete(`${API.V1.PROJECT}/${projectId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const permanentDeleteTeamService = async (teamId: string) => {
  try {
    const res = await axiosClient.delete(`${API.V1.TEAM}/${teamId}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const getMyIssuesService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(
      `/api/v1/workspace/${workspaceId}/my-issues`,
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchGithubRepoService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(
      `/api/v1/workspace/${workspaceId}/github/repos`,
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
