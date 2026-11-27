import { ArrowUpRight, CheckCircle2, CircleDot, MessageCircle, MoreHorizontal, Paperclip, Sparkles,
         Users, } from "lucide-react";
import styles from "./AuthShowcase.module.css";

export default function AuthProductPreview() {
    return (
        <div className={styles.previewStage}>
            <div className={styles.previewGlow} />
            <div className={styles.previewHeading}>
                <span className={styles.eyebrow}>
                    <Sparkles size={14} />
                    A clearer way to work
                </span>
                <h2>
                    Good work happens
                    <span> when teams move together.</span>
                </h2>
                <p> Bring projects, priorities and conversations together. Keep everyone moving in the same direction. </p>
            </div>
            <div className={styles.workspaceCard}>
                <div className={styles.workspaceHeader}>
                    <div className={styles.workspaceIdentity}>
                        <div className={styles.workspaceIcon}>
                            <CircleDot size={19} />
                        </div>
                        <div>
                            <span className={styles.mutedLabel}>PROJECT WORKSPACE</span>
                            <h3>Website Redesign</h3>
                        </div>
                    </div>
                    <button type="button" className={styles.moreButton} aria-label="More options">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <div className={styles.projectMeta}>
                    <span className={styles.status}>
                        <span className={styles.statusDot} />
                        In progress
                    </span>
                    <span className={styles.metaItem}>
                        <Users size={13} />
                        3 members
                    </span>
                </div>
                <div className={styles.taskBlock}>
                    <div className={styles.taskTop}>
                        <div>
                            <span className={styles.mutedLabel}>CURRENT TASK</span>
                            <h4>Homepage implementation</h4>
                        </div>
                        <span className={styles.taskStatus}>Active</span>
                    </div>
                    <div className={styles.progressInfo}>
                        <span>Task progress</span>
                        <strong>75%</strong>
                    </div>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} />
                    </div>
                </div>
                <div className={styles.activityHeader}>
                    <div>
                        <h4>Team conversation</h4>
                        <span>Recent project activity</span>
                    </div>
                    <span className={styles.liveIndicator}>
                        <span />
                        Active
                    </span>
                </div>
                <div className={styles.comments}>
                    <div className={`${styles.comment} ${styles.commentOne}`}>
                        <div className={`${styles.avatar} ${styles.avatarPurple}`}>JD</div>
                        <div className={styles.commentContent}>
                            <div className={styles.commentMeta}>
                                <strong>Jordan</strong>
                                <span>Just now</span>
                            </div>
                            <div className={styles.commentBubble}> The new homepage layout is ready for review. </div>
                        </div>
                    </div>
                    <div className={`${styles.comment} ${styles.commentTwo}`}>
                        <div className={`${styles.avatar} ${styles.avatarBlue}`}>AM</div>
                        <div className={styles.commentContent}>
                            <div className={styles.commentMeta}>
                                <strong>Alex</strong>
                                <span>Just now</span>
                            </div>
                            <div className={styles.commentBubble}> Looks good! I'll handle the responsive checks. </div>
                        </div>
                    </div>
                    <div className={styles.typingRow}>
                        <div className={`${styles.avatar} ${styles.avatarGreen}`}>SK</div>
                        <div className={styles.typingBubble} aria-label="Someone is typing">
                            <span />
                            <span />
                            <span />
                        </div>
                        <span className={styles.typingText}>Sam is typing</span>
                    </div>
                </div>
                <div className={styles.commentInput}>
                    <MessageCircle size={15} />
                    <span>Continue the conversation...</span>
                    <Paperclip size={15} />
                    <ArrowUpRight size={16} className={styles.sendIcon} />
                </div>
            </div>
            <div className={`${styles.floatingBadge} ${styles.badgeTop}`}>
                <CheckCircle2 size={17} />
                <span>Task completed</span>
            </div>
            <div className={`${styles.floatingBadge} ${styles.badgeBottom}`}>
                <Users size={17} />
                <span>Team in sync</span>
            </div>
        </div>
    );
}
