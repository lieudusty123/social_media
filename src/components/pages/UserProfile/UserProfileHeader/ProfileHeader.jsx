import ProfileHeaderSettings from "./ProfileHeaderSettings";
import ProfileHeaderStats from "./ProfileHeaderStats";
import ProfileHeaderImage from "./ProfileHeaderImage";
export default function ProfileHeader({ userData, setUserData }) {
  return (
    <header>
      <div className="container">
        <div className="profile">
          <ProfileHeaderImage userData={userData} />
          <ProfileHeaderSettings userData={userData} setUserData={setUserData} />
          <ProfileHeaderStats userData={userData} setUserData={setUserData} />
        </div>
      </div>
    </header>
  );
}
