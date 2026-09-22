interface DashboardOverview {
  isNewUser: boolean;

  stats: {
    totalProjects: number;
    totalMeetings: number;
    totalPeople: number;
    upcomingMeetings: number;
  };

  /*upcomingMeetings: MeetingPreview[];
  recentActivity: ActivityItem[];
  activeProjects: ProjectPreview[];*/
}