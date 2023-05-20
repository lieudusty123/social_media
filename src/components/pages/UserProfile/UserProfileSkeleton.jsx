export default function UserProfileSkeleton() {
  return (
    <div id="skeleton_wrapper">
      <header id="skeleton_header">
        <div id="skeleton_profile_image"></div>
        <div id="skeleton_profile_info_container">
          <div id="skeleton_profile_id"></div>
          <div id="skeleton_profile_stats">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div id="skeleton_profile_bio">
            <div></div>
            <div></div>
          </div>
        </div>
      </header>
      <main id="skeleton_posts_wrapper">
        <div id="skeleton_posts_container">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </main>
    </div>
  );
}
