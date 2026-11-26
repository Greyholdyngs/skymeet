export enum ActivityEntityType {
    PROJECT = 'project',
    TASK = 'task',
    SPRINT = 'sprint',
    DOCUMENT = 'document',
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
    SPRINT_CREATED = 'sprint_created',
    SPRINT_UPDATED = 'sprint_updated',
    SPRINT_DELETED = 'sprint_deleted',
    DOCUMENT_CREATED = 'document_created',
    DOCUMENT_UPDATED = 'document_updated',
    DOCUMENT_DELETED = 'document_deleted',
}
