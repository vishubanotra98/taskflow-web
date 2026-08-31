import {
  completedIssueCountService,
  createIssueService,
  createProjectService,
  createTeamService,
  createWorkspaceService,
  deletedIssueService,
  editIssueService,
  fetchActivitiesService,
  fetchDeletedProjectsService,
  fetchDeletedTeamsService,
  fetchGithubRepoService,
  fetchIssuesByProjectService,
  fetchIssuesService,
  fetchProjectByIdService,
  fetchProjectRepoService,
  fetchProjectsService,
  fetchTeamsDataService,
  fetchUserService,
  fetchWorkspaceMambersService,
  fetchWorkspaceService,
  fetchWorkspaceStatusService,
  getMyIssuesService,
  moveCardService,
  permanentDeleteProjectService,
  permanentDeleteTeamService,
  projectSoftDeleteService,
  restoreProjectService,
  restoreTeamService,
  selectRepoService,
  teamSoftDeleteService,
} from "@/services/workspace.service";
import {
  ProjectPayloadType,
  TeamPayloadType,
  WorkspacePayloadType,
} from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserAction = createAsyncThunk<any, void>(
  "fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchUserService();
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchWorkspaceAction = createAsyncThunk<any, void>(
  "fetchWorkSpaces",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchWorkspaceService();
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const createWorkspaceAction = createAsyncThunk<
  any,
  WorkspacePayloadType
>("createWorkspace", async (payload, { rejectWithValue }) => {
  try {
    const res = await createWorkspaceService(payload);
    return res;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data);
  }
});

export const fetchTeamsDataAction = createAsyncThunk<any, string>(
  "fetchTeams",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchTeamsDataService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const createTeamAction = createAsyncThunk<any, TeamPayloadType>(
  "createTeam",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createTeamService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const createProjectAction = createAsyncThunk<any, ProjectPayloadType>(
  "createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createProjectService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

// export const lastActiveWorkspaceAction = createAsyncThunk<any, string>(
//   "lastActiveWorkspace",
//   async (workspaceId, { rejectWithValue }) => {
//     try {
//       const res = await lastActiveWorkspaceService(workspaceId);
//       return res;
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data);
//     }
//   },
// );

export const fetchWorkspaceStatusAction = createAsyncThunk<any, any>(
  "workspaceStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetchWorkspaceStatusService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchWorkspaceMambersAction = createAsyncThunk<any, string>(
  "workspaceMembers",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchWorkspaceMambersService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchActivitiesAction = createAsyncThunk<any, string>(
  "fetchActivities",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchActivitiesService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const createIssueAction = createAsyncThunk<any, any>(
  "createIssue",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createIssueService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchIssuesAction = createAsyncThunk<any, string>(
  "fetchIssues",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchIssuesService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const editIssueAction = createAsyncThunk<any, any>(
  "editIssue",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await editIssueService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const completedIssueCountAction = createAsyncThunk<any, any>(
  "completedIssueCount",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await completedIssueCountService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchIssuesByProjectAction = createAsyncThunk<any, any>(
  "issuesByProject",
  async ({ projectId, params }, { rejectWithValue }) => {
    try {
      const res = await fetchIssuesByProjectService(projectId, params);

      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const moveCardAction = createAsyncThunk<any, any>(
  "moveCard",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await moveCardService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const deleteIssueAction = createAsyncThunk<any, any>(
  "deleteIssue",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await deletedIssueService(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchProjectByIdAction = createAsyncThunk<any, string>(
  "fetchProjectById",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await fetchProjectByIdService(projectId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchProjectsAction = createAsyncThunk<any, string>(
  "fetchProjects",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchProjectsService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const teamSoftDeleteAction = createAsyncThunk<any, string>(
  "softDeleteTeam",
  async (teamId, { rejectWithValue }) => {
    try {
      const res = await teamSoftDeleteService(teamId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const projectSoftDeleteAction = createAsyncThunk<any, string>(
  "softDeleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await projectSoftDeleteService(projectId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchDeletedProjectsAction = createAsyncThunk<any, string>(
  "fetchDeletedProjectsAction",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchDeletedProjectsService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchDeletedTeamsAction = createAsyncThunk<any, string>(
  "fetchDeletedTeamsAction",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchDeletedTeamsService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const restoreProjectAction = createAsyncThunk<any, string>(
  "restoreProjectAction",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await restoreProjectService(projectId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const restoreTeamAction = createAsyncThunk<any, string>(
  "restoreTeamAction",
  async (teamId, { rejectWithValue }) => {
    try {
      const res = await restoreTeamService(teamId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const permanentDeleteProjectAction = createAsyncThunk<any, string>(
  "permanentDeleteProjectAction",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await permanentDeleteProjectService(projectId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const permanentDeleteTeamAction = createAsyncThunk<any, string>(
  "permanentDeleteTeamAction",
  async (teamId, { rejectWithValue }) => {
    try {
      const res = await permanentDeleteTeamService(teamId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const getMyIssuesAction = createAsyncThunk<any, string>(
  "myIssuesAction",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await getMyIssuesService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchGithubReposAction = createAsyncThunk<any, string>(
  "githubRepos",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetchGithubRepoService(workspaceId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const fetchProjectReposAction = createAsyncThunk<any, string>(
  "projectRepos",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await fetchProjectRepoService(projectId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);

export const selectRepoAction = createAsyncThunk<any, any>(
  "selectProjectRepo",
  async (
    { workspaceId, projectId, repoId, repoFullName },
    { rejectWithValue },
  ) => {
    try {
      const res = await selectRepoService(workspaceId, projectId, {
        repoId,
        repoFullName,
      });

      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  },
);
