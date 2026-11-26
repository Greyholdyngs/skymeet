import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProjectsService } from '../projects/projects.service.js';

import { TaskService } from '../tasks/task.service.js';
import { ActivityService } from '../activity/activity.service.js';

@Injectable()
export class DashboardService {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly taskService: TaskService,
        private readonly activityService: ActivityService,
    ) {}

    async getSummary(userId: Types.ObjectId) {
        const [ projects, taskData ] = await Promise.all([
            this.projectsService.findAccessibleToUser(userId),
            this.taskService.getDashboardData(userId),
        ]);

        const projectIds = projects.map((project) => project._id);
        const [recentActivity, recentActivityCount] = await Promise.all([
            this.activityService.findRecentForProjects(projectIds, 5),
            this.activityService.countForProjects(projectIds),
        ]);

        return {
            totalProjects: projects.length,
            recentProjects: projects.slice(0, 5),
            myTasksCount: taskData.myTasksCount,

            myTasks: taskData.myTasks,
            overdueTasks: taskData.overdueTasks,
            upcomingDeadline: taskData.upcomingDeadline,

            upcomingDeadlinesCount: taskData.upcomingDeadlinesCount,
            recentActivityCount,

            recentActivity,
        };
    }
}