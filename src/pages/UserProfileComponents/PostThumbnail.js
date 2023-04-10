const PostThumbnail = (props) => {
  return (
    <div className="profile-page gallery-item">
      <img
        src={props.post.files[0]}
        className="profile-page gallery-image"
        alt=""
      />

      <div className="profile-page gallery-item-info">
        <ul>
          <li className="profile-page gallery-item-likes">
            <span className="profile-page visually-hidden">Likes:</span>
            <i
              className="profile-page fas fa-heart"
              aria-hidden="true"
            ></i>{" "}
            {props.post.engagement.likes.length}
          </li>
          <li className="profile-page gallery-item-comments">
            <span className="profile-page visually-hidden">Comments:</span>
            <i
              className="profile-page fas fa-comment"
              aria-hidden="true"
            ></i>{" "}
            {props.post.engagement.comments.length}
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PostThumbnail;
