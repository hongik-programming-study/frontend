// react
import React, { useEffect, useState } from "react";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  editComment,
  deleteComment,
  getPost,
  deletePost,
} from "../reducers/slices/postSlice.js";

// react-router-dom
import { Link, useParams, useNavigate } from "react-router-dom";

// style
import GlobalStyle from "../Styles/Globalstyle.js";
import { Container } from "../Styles/theme";
import styled from "styled-components";

// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faUser,
  faEye,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// toast-ui editor
import { Viewer } from "@toast-ui/react-editor";

// sample data
const samplePost = {
  id: 1,
  title: "title",
  content:
    "# hi \n## this is \n### content123123 `hi` \n 123123 \n* 1\n * 222\n * 33333",
  create_at: "2022-01-21",
  author: "자몽",
  tags: ["자바스크립트", "리액트", "스프링"],
  view: 3,
  like: 2,
  comments: [
    { author: "김방울", content: "야옹" },
    { author: "Dever", content: "댓글 샘플2" },
  ],
};

// style
const PostView = styled.div`
  width: 80%;
  margin: 0 auto;
  position: relative;

  /* 하단 수정 버튼 */
  & .btnWrap {
    margin-top: 34px;
    & .linkBtn {
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const PostHead = styled.div`
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  & .postInfo {
    margin-bottom: 34px;
    & .postTitle {
      font-size: 4em;
      font-weight: 600;
    }
    & .infoWrap {
      font-size: 1.4em;
      color: #aaa;
      & span {
        margin-right: 15px;
      }
      & svg {
        display: inline-block;
        margin-right: 3px;
      }
    }
  }

  & .postTag {
    & > span {
      padding: 5px 7px;
      margin-right: 15px;
      border-radius: 5px;
      background: #ddd;
      color: #666;
      font-size: 1.1em;
    }
    &::before {
      content: "Tags";
      display: inline-block;
      margin-right: 15px;
      color: #666;
      font-size: 1.2em;
    }
  }
`;

const PostContent = styled.article`
  padding: 20px 0;
  /* 토스트ui viewer */
  .toastui-editor-contents {
    font-size: 1.6em;
  }
`;

const CommentWrap = styled.div`
  border-top: 1px solid #ddd;
  padding: 20px 0;

  & h3 {
    font-size: 1.8em;
    margin-bottom: 15px;
    & span {
      color: #ff6c26;
    }
  }

  & .comment {
    font-size: 1.5em;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 7px;
    margin-bottom: 10px;

    & .commentAuthor {
      font-weight: 600;
      margin-bottom: 5px;
      & svg {
        font-size: 0.9em;
        margin-right: 5px;
      }
    }

    & .commentContent {
      color: #666;
      padding-left: 15px;
    }
  }
`;

const UserInfo = styled.div`
  padding: 20px 0;

  & .authorName {
    font-size: 1.6em;
    margin-right: 10px;
    font-weight: 500;
  }
`;

const AuthorImg = styled.div`
  width: 60px;
  height: 60px;
  background: #ddd;
  border-radius: 100%;
  overflow: hidden;
  position: relative;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const SideBar = styled.div`
  position: fixed;
  top: 40%;
  left: 50px;
`;

const LikeWrap = styled.div`
  padding: 15px;
  border: 1px solid #aaa;
  border-radius: 100%;
  background: #fff;
  cursor: pointer;

  & svg {
    color: ${props => (props.Liked ? "#FF4444" : "#aaa")};
    font-size: 2.6em;
    display: block;
    transition: color 0.3s, transform 0.3s, opacity 0.3s;
    margin-bottom: -2px;
  }

  &:hover svg {
    transform: scale(0.85);
    transform-origin: center;
    opacity: 0.8;
    color: ${props => (props.Liked ? "aaa" : "#FF4444")};
  }

  & .num {
    color: #222;
    position: absolute;
    font-size: 1.3em;
    top: 105%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    &::after {
      content: "Likes";
      display: inline-block;
      margin-left: 3px;
      color: #aaa;
    }
  }
`;

const LikeIcon = styled(FontAwesomeIcon)`
  color: ${props => (props.Liked ? "#FF4444" : "#aaa")};
  font-size: 2em;
  display: block;
  transition: color 0.3s, transform 0.3s;
`;

// main
const Post = () => {
  const { post, status } = useSelector(state => state.post);
  const [postData, setPostData] = useState();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const boardId = useParams().boardId;
  const postId = useParams().postId;

  const [commentData, setCommentData] = useState("");

  const onChangeComment = e => {
    setCommentData(e.target.value);
  };

  const onPostComment = async () => {
    await dispatch(addComment({ postId, commentData }));
    setCommentData("");
  };

  const onDeletePost = async () => {
    await dispatch(deletePost({ boardId, postId }));
    navigate(-1);
  };

  const onRemoveComment = commentId => {
    dispatch(deleteComment({ postId, commentId }));
  };

  const onEditComment = (commentId, content) => {
    dispatch(editComment({ postId, commentId, content }));
  };

  useEffect(async () => {
    await dispatch(
      getPost({
        postId: postId,
        boardId: boardId,
      }),
    );
    setPostData(post);
  }, []);

  useEffect(() => {
    dispatch(
      getPost({
        postId: postId,
        boardId: boardId,
      }),
    );
  }, [status]);
  return (
    <Container>
      <GlobalStyle />
      {postData && (
        <PostView>
          <PostHead>
            <div className="postInfo flex flex-jc-b flex-ai-c">
              {/* 게시물 제목 */}
              <div className="postTitle">{post.responseInfo.title}</div>
              <div className="infoWrap">
                {/* 조회수 */}
                <span>
                  <FontAwesomeIcon icon={faEye} />
                  {samplePost.view}
                </span>
                {/* 글 등록 시각 */}
                <span>
                  <FontAwesomeIcon icon={faClock} />{" "}
                  {post.responseInfo.createdAt}
                </span>
              </div>
            </div>

            {/* 태그 */}
            <div className="postTag">
              {post.responseInfo.tags.map(tag => (
                <span>{tag.name}</span>
              ))}
            </div>
          </PostHead>

          {/* 게시물 본문 */}
          <PostContent>
            <Viewer initialValue={post.responseInfo.content} />
          </PostContent>

          {/* 작성자 정보 */}
          <UserInfo className="flex flex-ai-c flex-jc-e">
            {/* 작성자 이름 */}
            <div className="authorName">{post.responseInfo.author}</div>
            {/* 프로필 이미지 */}
            <AuthorImg></AuthorImg>
          </UserInfo>

          {/* 댓글 */}
          <CommentWrap>
            <h3>
              <span>{post.comments.length}</span> Comment
            </h3>
            {post.comments.map((comment, id) => (
              <div
                className="comment"
                key={id} //api 문서대로 id, createAt, account 추가해야함
              >
                {/* 댓글 작성자 */}
                <div className="commentAuthor">
                  <FontAwesomeIcon icon={faUser} />
                  {comment.nickname}
                </div>
                {/* 댓글 내용 */}
                <div className="commentContent">{comment.content}</div>
                <div className="commentCreateAt">2020.01.02</div>
                <button
                  onClick={() => {
                    onRemoveComment(id);
                  }}
                >
                  댓글 삭제
                </button>
                <button
                  onClick={() => {
                    onEditComment(id);
                  }}
                >
                  댓글 수정
                </button>
              </div>
            ))}
            <input
              placeholder="댓글을 작성하세요"
              onChange={onChangeComment}
              value={commentData}
            />
            <button onClick={onPostComment}>댓글 작성</button>
          </CommentWrap>

          {/* 사이드바 */}
          <SideBar>
            {/* 좋아요 */}
            <LikeWrap>
              <FontAwesomeIcon icon={faHeart} />
              <span className="num"> {samplePost.like}</span>
            </LikeWrap>
          </SideBar>

          {/* 수정, 삭제버튼 */}
          <div className="btnWrap flex flex-jc-e">
            <Link
              className="linkBtn black"
              to={{ pathname: `/edit/${boardId}/${postId}` }}
            >
              수정
            </Link>
            <div className="linkBtn black" onClick={onDeletePost}>
              삭제
            </div>
          </div>
        </PostView>
      )}
    </Container>
  );
};

export default Post;
