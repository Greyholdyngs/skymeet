export enum ActivityEntityType {
    PROJECT = 'project',
    TASK = 'task',
}

export enum ActivityAction {
    TASK_CREATED = 'task_created',
    TASK_UPDATED = 'task_updated',
    TASK_STARTED = 'task_started',
    TASK_SUBMITTED_FOR_REVIEW = 'task_submitted_for_review',
    TASK_REVIEWED = 'task_reviewed',
    TASK_DELETED = 'task_deleted',
    PROJECT_CREATED = 'project_created',
    PROJECT_UPDATED = 'project_updated',
    PROJECT_DELETED = 'project_deleted',
}
