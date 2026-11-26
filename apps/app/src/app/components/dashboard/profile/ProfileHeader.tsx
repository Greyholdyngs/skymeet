import type { UserProfile } from "@/app/types/user";

interface ProfileHeaderProps {
    profile: UserProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

    return (
        <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C5CFC]/15 text-xl font-semibold text-[#7C5CFC]">
                {initials}
            </div>
            <div>
                <h1 className="text-xl font-semibold theme-text"> {profile.firstName} {profile.lastName} </h1>
                <p className="mt-1 text-sm theme-text-secondary"> @{profile.userName} </p>
                <p className="mt-1 text-xs theme-text-muted">
                    Member since{" "}
                    {new Date(profile.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                    )}
                </p>
            </div>
        </div>
    );
};

export default ProfileHeader;
