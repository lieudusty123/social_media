<>
  {validUser && !isLoading && (
    <div id={UserProfileStyling["user_wrapper"]}>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
        }}
      >
        <img
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
          alt="profile pic"
          src={userData.image === "default" ? defaultImage : userData.image}
        />
        <h1>{userData.name}</h1>
        <div>followers: {userData.followers.length}</div>
        <div>following: {userData.following.length}</div>

        {followButton && <button onClick={follow}>{followButton}</button>}

        <BackButton
          handleClick={() => {
            navigate("/");
          }}
        >
          Return
        </BackButton>
      </section>
      <AllPostsThumbnails user={postData} />
    </div>
  )}
  {!validUser && !isLoading && <UserNotFound />}
  {isLoading && <div>Loading.................</div>}
</>;
